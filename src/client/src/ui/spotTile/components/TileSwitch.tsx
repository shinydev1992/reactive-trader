import React, { Component } from 'react'
import { CurrencyPair, Direction, NotificationType, TradeStatus } from 'rt-types'
import { SpotTileData } from '../model/spotTileData'
import SpotTile from './_SpotTile'
import TileBooking from './TileBooking'
import TileExecuted from './TileExecuted'
import TileRejected from './TileRejected'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executeTrade: (direction: Direction) => void
}

export default class TileSwitch extends Component<Props> {
  render() {
    const { currencyPair, spotTileData, executeTrade } = this.props
    return (
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade}>
        {this.renderStates()}
      </SpotTile>
    )
  }

  private renderStates = () => {
    const { spotTileData, currencyPair } = this.props
    if (spotTileData.isTradeExecutionInFlight) {
      return <TileBooking />
    }
    if (spotTileData.notification) {
      const { notification } = spotTileData
      if (notification.notificationType === NotificationType.Trade) {
        const { dealtCurrency, tradeId } = notification.trade
        const { terms } = currencyPair
        if (notification.trade.status === TradeStatus.Done) {
          const { direction, notional, spotRate, tradeDate } = notification.trade

          return (
            <TileExecuted
              direction={direction}
              dealtCurrency={dealtCurrency}
              counterCurrency={terms}
              notional={notional}
              tradeId={tradeId}
              rate={spotRate}
              date={tradeDate}
            />
          )
        } else if (notification.trade.status === TradeStatus.Rejected) {
          return <TileRejected dealtCurrency={dealtCurrency} counterCurrency={terms} tradeId={tradeId} />
        }
      }
    }
    return <div />
  }
}
