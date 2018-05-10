import { asyncScheduler } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { logger, RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { mapFromDto } from './mappers'
import { RawTradeUpdate } from './mappers/tradeMapper'

const log = logger.create('BlotterService')

export default class BlotterService {
  constructor(private readonly serviceClient: ServiceClient) {}

  getTradesStream() {
    log.info('Subscribing to blotter stream')
    return this.serviceClient
      .createStreamOperation<RawTradeUpdate, {}>('getTradesStream', {})
      .pipe(
        retryWithPolicy(
          RetryPolicy.backoffTo10SecondsMax,
          'getTradesStream',
          asyncScheduler
        ),
        map(dto => mapFromDto(dto))
      )
  }
}
