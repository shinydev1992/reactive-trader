import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// TODO: change to import when webpack bug solved https://github.com/webpack/webpack/issues/4160
import { getEnvVars } from './config/config'
import { OpenFin } from './system/openFin'
import createConnection from './system/service/connection'
import { ServiceConst, ServiceInstanceStatus, User } from './types'
import { OpenFinProvider, ShellContainer } from './ui/shell'

import configureStore from './configureStore'
import {
  AnalyticsService,
  BlotterService,
  CompositeStatusService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService
} from './services'

import { merge, Observer, of, Subscriber } from 'rxjs'
import {
  catchError,
  filter,
  mergeMap,
  scan,
  share,
  shareReplay
} from 'rxjs/operators'
import { ServiceClient } from './system/service'
import { serviceInstanceDictionaryStream$ } from './system/service/serviceStatusStream'

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

const config = getEnvVars(process.env.REACT_APP_ENV)

const connectSocket = () => {
  const user: User = FakeUserRepository.currentUser
  const realm = 'com.weareadaptive.reactivetrader'
  const url = config.overwriteServerEndpoint
    ? config.serverEndpointUrl
    : location.hostname
  const port = config.overwriteServerEndpoint
    ? config.serverPort
    : location.port
  return createConnection(user.code, url, realm, +port)
}

const HEARTBEAT_TIMEOUT = 3000

const appBootstrapper = () => {
  const createLogger = (name: string) => {
    return {
      next: x => console.log(`${name}: next `, x),
      error: x => console.error(`${name}: error `, x),
      complete: () => console.log(`${name}: complete `)
    }
  }

  const connection = connectSocket()

  const serviceStatus$ = serviceInstanceDictionaryStream$(
    connection,
    HEARTBEAT_TIMEOUT
  ).pipe(share())

  serviceStatus$.subscribe(createLogger('serviceStatus'))

  const createServiceClient = (serviceName: ServiceConst) =>
    new ServiceClient(serviceName, connection, serviceStatus$)

  const blotterService = new BlotterService(
    createServiceClient(ServiceConst.BlotterServiceKey)
  )

  const pricingService = new PricingService(
    createServiceClient(ServiceConst.PricingServiceKey)
  )

  const refDataService = new ReferenceDataService(
    createServiceClient(ServiceConst.ReferenceServiceKey)
  )

  const openFin = new OpenFin()

  const execService = new ExecutionService(
    createServiceClient(ServiceConst.ExecutionServiceKey),
    openFin
  )
  const analyticsService = new AnalyticsService(
    createServiceClient(ServiceConst.AnalyticsServiceKey)
  )

  const compositeStatusService = new CompositeStatusService(
    connection,
    serviceStatus$
  )

  const isRunningInFinsemble = window.FSBL

  // const s = merge(
  //   connection.connectionStream,
  //   serviceStatus$,
  //   blotterService.getTradesStream(),
  //   refDataService.getCurrencyPairUpdatesStream(),
  //   analyticsService.getAnalyticsStream('USD')
  // ).subscribe(log)

  const store = configureStore(
    refDataService,
    blotterService,
    pricingService,
    analyticsService,
    compositeStatusService,
    execService,
    openFin
  )
  window.store = store
  ReactDOM.render(
    <Provider store={store}>
      <OpenFinProvider
        openFin={openFin}
        isRunningInFinsemble={isRunningInFinsemble}
      >
        <ShellContainer />
      </OpenFinProvider>
    </Provider>,
    document.getElementById('root')
  )
}

const runBootstrapper = location.pathname === '/' && location.hash.length === 0

// if we're not the root we (perhaps a popup) we never re-run the bootstrap logic

export function run() {
  if (runBootstrapper) {
    appBootstrapper()
  }
}
