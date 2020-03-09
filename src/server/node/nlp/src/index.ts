import { config } from 'dotenv'
import { interval, Observable, ReplaySubject } from 'rxjs'
import {
  filter,
  map,
  mapTo,
  multicast,
  refCount,
  retryWhen,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators'
import {
  AutobahnConnectionProxy,
  ConnectionEvent,
  ConnectionEventType,
  ConnectionOpenEvent,
  createConnection$,
  logger,
  retryWithBackOff,
} from 'shared'
import uuid from 'uuid/v1'
import { NlpIntentRequest } from './types'
import { detectIntent } from './dialogFlowClient'

config()

const host = process.env.BROKER_HOST || 'localhost'
const realm = process.env.WAMP_REALM || 'com.weareadaptive.reactivetrader'
const port = process.env.BROKER_PORT || 8000

const HOST_TYPE = 'nlp'
const hostInstance = `${HOST_TYPE}.${uuid().substring(0, 4)}`
const HEARTBEAT_INTERVAL_MS = 1000

const exit$ = new Observable(observer => {
  process.on('exit', () => {
    observer.next()
    observer.complete()
  })
})

logger.info(`Starting NLP service for ${host}:${port} on realm ${realm}`)

const proxy = new AutobahnConnectionProxy(host, realm, +port)

const connection$ = createConnection$(proxy).pipe(
  retryWhen(retryWithBackOff()),
  multicast(() => {
    return new ReplaySubject<ConnectionEvent>(1)
  }),
  refCount(),
)

const session$ = connection$.pipe(
  filter(
    (connection): connection is ConnectionOpenEvent =>
      connection.type === ConnectionEventType.CONNECTED,
  ),
  tap(() => logger.info('Starting new session...')),
  map(connection => connection.session),
)

logger.info(`Starting heartbeat for ${hostInstance}`)

session$
  .pipe(
    takeUntil(exit$),
    switchMap(session => interval(HEARTBEAT_INTERVAL_MS).pipe(mapTo(session))),
    tap(() => logger.debug('Publish heartbeat')),
  )
  .subscribe(session => {
    const status = {
      Type: HOST_TYPE,
      Load: 1,
      TimeStamp: Date.now(),
      Instance: hostInstance,
    }

    try {
      session.publish('status', [status])
    } catch (err) {
      logger.error('Failed to publish heartbeat', err)
    }
  })

session$.pipe(takeUntil(exit$)).subscribe(session => {
  const topic = `${hostInstance}.getNlpIntent`
  logger.info(`Registering ${topic}`)

  session.register(topic, async (request: NlpIntentRequest) => {
    const result = await detectIntent(request[0].payload)
    logger.info(`Received response: ${JSON.stringify(result)} for ${JSON.stringify(request)}`)

    return result
  })
})
