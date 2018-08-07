import React, { Component } from 'react'
import { CurrencyPair, Direction, NotificationType, TradeStatus } from 'rt-types'
import { SpotTileData } from '../model/spotTileData'
import { TileBooking, TileExecuted, TileNotification, TileRejected } from './notifications'
import SpotTile from './SpotTile'
import TileControls from './TileControls'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  tornOff: boolean
  executeTrade: (direction: Direction, notional: number) => void
  onPopoutClick?: () => void
  onNotificationDismissedClick: () => void
}

export default class TileSwitch extends Component<Props> {
  render() {
    const { currencyPair, spotTileData, executeTrade, tornOff, onPopoutClick } = this.props

    if (!spotTileData || !spotTileData.price || !currencyPair) {
      return null
    }

    const { notification, isTradeExecutionInFlight } = spotTileData

    return (
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade}>
        <TileControls tornOff={tornOff} onPopoutClick={onPopoutClick} />
        <TileBooking show={isTradeExecutionInFlight} />

        {notification && this.renderNotifications()}
      </SpotTile>
    )
  }

  private renderNotifications = () => {
    const {
      spotTileData: { notification },
      currencyPair,
      onNotificationDismissedClick
    } = this.props
    if (!notification) {
      return null
    }
    if (notification.notificationType === NotificationType.Trade) {
      const { dealtCurrency, tradeId } = notification.trade
      const { terms } = currencyPair
      if (notification.trade.status === TradeStatus.Done) {
        const { direction, notional, spotRate, tradeDate } = notification.trade

        return (
          <TileExecuted
            onNotificationDismissedClick={onNotificationDismissedClick}
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
        return (
          <TileRejected
            onNotificationDismissedClick={onNotificationDismissedClick}
            dealtCurrency={dealtCurrency}
            counterCurrency={terms}
            tradeId={tradeId}
          />
        )
      }
    } else if (notification.notificationType === NotificationType.Text) {
      return (
        <TileNotification
          symbols={`${currencyPair.base}/${currencyPair.terms}`}
          icon="warning"
          colors={{ bg: 'accentBad', color: 'white' }}
        >
          {notification.message}
        </TileNotification>
      )
    } else {
      return null
    }
  }
}
