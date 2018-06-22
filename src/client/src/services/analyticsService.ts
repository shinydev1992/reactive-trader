import { map, retryWhen } from 'rxjs/operators'
import { retryConstantly, ServiceClient } from '../system'
import { ServiceConst } from '../types'
import { PositionsMapper } from './mappers'
import { PositionsRaw } from './mappers/positionsMapper'

export default class AnalyticsService {
  constructor(private readonly serviceClient: ServiceClient) {}

  getAnalyticsStream(analyticsRequest: string) {
    return this.serviceClient
      .createStreamOperation<PositionsRaw, string>(ServiceConst.AnalyticsServiceKey, 'getAnalytics', analyticsRequest)
      .pipe(
        retryWhen(retryConstantly({ interval: 3000 })),
        map(dto => PositionsMapper.mapFromDto(dto))
      )
  }
}
