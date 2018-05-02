import { Observable, Scheduler } from 'rxjs'
import { map } from 'rxjs/operators'
import { logger, RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { Connection } from '../system/service/connection'
import { PositionUpdates, ServiceConst } from '../types'
import { ReferenceDataService } from './../types/referenceDataService'
import { PositionsMapper } from './mappers'
import { PositionsRaw } from './mappers/positionsMapper'

const log = logger.create('AnalyticsService')

export default function analyticsService(
  connection: Connection,
  referenceDataService: ReferenceDataService
) {
  const serviceClient = new ServiceClient(
    ServiceConst.AnalyticsServiceKey,
    connection
  )
  const positionsMapper = new PositionsMapper(referenceDataService)
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getAnalyticsStream(analyticsRequest: string) {
      return new Observable<PositionUpdates>(obs => {
        log.debug('Subscribing to analytics stream')

        return serviceClient
          .createStreamOperation<PositionsRaw, string>(
            'getAnalytics',
            analyticsRequest
          )
          .pipe(
            retryWithPolicy(
              RetryPolicy.backoffTo10SecondsMax,
              'getAnalytics',
              Scheduler.async
            ),
            map(dto => positionsMapper.mapFromDto(dto))
          )
          .subscribe(obs)
      })
    }
  }
}
