import moment from 'moment'
import React from 'react'
import { Direction, Trade, TradeStatus } from 'rt-types'
import { Bottom, Close, CloseContainer, MetaContainer, MetaTitle, Notification, Status, Top, Traded } from './styled'

export interface Props {
  trade: Trade
  dismissNotification: () => void
  highlightTradeInBlotter?: () => void
}

const TradeNotification: React.FC<Props> = ({ trade: trade, dismissNotification, highlightTradeInBlotter }) => {
  const formattedValueDate = trade
    ? moment(trade.valueDate)
        .format('DD MMM')
        .toUpperCase()
    : ''

  const isDone = trade.status === TradeStatus.Done

  const tradeStatus = isDone ? '' : 'REJECTED'
  const direction = trade.direction === Direction.Buy ? 'Bought' : 'Sold'

  return (
    <Notification onClick={highlightTradeInBlotter}>
      <Top justifyContent="space-between">
        <Traded isDone={isDone}>
          <div>{`${direction.toUpperCase()} ${trade.dealtCurrency} ${trade.notional}`}</div>
          <div>{`vs ${trade.termsCurrency}`}</div>
        </Traded>

        <Status isDone={isDone}>{tradeStatus.toUpperCase()}</Status>
      </Top>
      <Bottom justifyContent="space-between">
        <MetaContainer>
          <MetaTitle>Rate</MetaTitle>
          <div>{trade.spotRate}</div>
        </MetaContainer>
        <MetaContainer>
          <MetaTitle>Date</MetaTitle>
          <div>SP. {formattedValueDate.toString()}</div>
        </MetaContainer>
        <MetaContainer>
          <MetaTitle>Trade Id</MetaTitle>
          <div>{trade.tradeId}</div>
        </MetaContainer>
        <CloseContainer>
          <Close>
            <i className="fas fa-share fa-lg" onClick={dismissNotification} />
          </Close>
        </CloseContainer>
      </Bottom>
    </Notification>
  )
}

TradeNotification.defaultProps = {
  trade: {
    tradeId: 0,
    traderName: '',
    symbol: '',
    notional: 0,
    dealtCurrency: '',
    direction: '',
    spotRate: 0,
    tradeDate: new Date(),
    valueDate: new Date(),
    status: '',
  },
}

export default TradeNotification
