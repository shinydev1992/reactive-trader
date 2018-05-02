import {
  CurrencyPairPosition,
  HistoricPosition,
  PositionUpdates,
  ReferenceDataService
} from '../../types'

export interface CurrencyPairPostionRaw {
  Symbol: string
  BasePnl: number
  BaseTradedAmount: number
}

export interface PositionsRaw {
  CurrentPositions: CurrencyPairPostionRaw[]
  History: HistoryRaw[]
}

export interface HistoryRaw {
  Timestamp: string
  UsdPnl: number
}

export default class PositionsMapper {
  referenceDataService: ReferenceDataService

  constructor(referenceDataService: ReferenceDataService) {
    this.referenceDataService = referenceDataService
  }

  static mapToDto(ccyPairPosition: CurrencyPairPosition) {
    return {
      symbol: ccyPairPosition.symbol,
      basePnl: ccyPairPosition.basePnl,
      baseTradedAmount: ccyPairPosition.baseTradedAmount
    }
  }

  mapFromDto(dto: PositionsRaw): PositionUpdates {
    const positions = this.mapPositionsFromDto(dto.CurrentPositions)
    const history = this.mapHistoricPositionFromDto(dto.History)
    return {
      history,
      currentPositions: positions
    }
  }

  mapPositionsFromDto(dtos: CurrencyPairPostionRaw[]): CurrencyPairPosition[] {
    return dtos.map<CurrencyPairPosition>(dto => ({
      symbol: dto.Symbol,
      basePnl: dto.BasePnl,
      baseTradedAmount: dto.BaseTradedAmount,
      basePnlName: 'basePnl',
      baseTradedAmountName: 'baseTradedAmount'
    }))
  }

  mapHistoricPositionFromDto(dtos: HistoryRaw[]): HistoricPosition[] {
    return dtos.map<HistoricPosition>(dto => ({
      timestamp: new Date(dto.Timestamp),
      usdPnl: dto.UsdPnl
    }))
  }
}
