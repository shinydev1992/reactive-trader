import React from 'react'

import centered from '@storybook/addon-centered'
import { boolean, select, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { Direction, Notification, NotificationType, PriceMovementTypes } from 'rt-types'
import SpotTile from './_SpotTile'
import NotionalInput from './NotionalInput'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'
import { DeliveryDate, TileSymbol } from './Styled'
import TileBooking from './TileBooking'
import TileExecuted from './TileExecuted'
import TileSwitch from './TileSwitch'

const stories = storiesOf('Spot Tile', module).addDecorator(centered)
stories.addDecorator(withKnobs)

stories.add('Price button', () => (
  <Story>
    <Flex>
      <PriceButton direction={Direction.Buy} big={33} pip={1} tenth={22} />
      <PriceButton direction={Direction.Sell} big={33} pip={1} tenth={22} />
    </Flex>
  </Story>
))

stories.add('Price movement', () => {
  const priceMovementType = select('Direction', { Up: 'Up', Down: 'Down' }, 'Up')
  return (
    <Story>
      <PriceMovement priceMovementType={priceMovementType} spread={'3.0'} />
    </Story>
  )
})

stories.add('Notional input', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <NotionalInput currencyPairSymbol="USD" />
    </div>
  </Story>
))

stories.add('Delivery date', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <DeliveryDate>04 AUG</DeliveryDate>
    </div>
  </Story>
))

stories.add('Symbol', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <TileSymbol>USD/JPY</TileSymbol>
    </div>
  </Story>
))

const currencyPair = {
  base: 'EUR',
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: 'EURUSD',
  terms: 'USD'
}

const spotTileData = {
  currencyChartIsOpening: false,
  isTradeExecutionInFlight: false,
  hasError: false,
  price: {
    ask: 184.775,
    bid: 184.767,
    creationTimestamp: 31566750203189236,
    mid: 184.771,
    priceMovementType: PriceMovementTypes.Up,
    symbol: 'GBPJPY',
    valueDate: '2018-08-04T00:00:00Z'
  }
}

const executeTrade = action('executeTrade')

const notification: Notification = {
  hasError: false,
  notificationType: NotificationType.Trade,
  message: 'Test',
  trade: {
    dealtCurrency: 'EUR',
    direction: 'Buy',
    notional: 1000000,
    spotRate: 1.09403,
    status: 'done',
    symbol: 'EURUSD',
    tradeDate: new Date('Fri Aug 03 2018 10:56:24 GMT-0400 (Eastern Daylight Time)'),
    tradeId: 2896,
    traderName: 'KLA',
    valueDate: new Date('Sun Aug 05 2018 20:00:00 GMT-0400 (Eastern Daylight Time)')
  }
}

stories.add('Tile', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade} />
    </div>
  </Story>
))

stories.add('Tile switch', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <TileSwitch
        currencyPair={currencyPair}
        spotTileData={{ ...spotTileData, isTradeExecutionInFlight: boolean('Booking', false) }}
        executeTrade={executeTrade}
      />
    </div>
  </Story>
))

stories.add('Tile executing', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <TileBooking />
      <SpotTile
        currencyPair={currencyPair}
        spotTileData={{ ...spotTileData, isTradeExecutionInFlight: true }}
        executeTrade={executeTrade}
      />
    </div>
  </Story>
))

stories.add('Tile executed', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <TileExecuted
        symbols={`${notification.trade.dealtCurrency}/${currencyPair.terms}`}
        tradeId={notification.trade.tradeId}
        currency={`${notification.trade.dealtCurrency} ${notification.trade.notional}`}
        rate={notification.trade.spotRate}
        counterCurrency={`${currencyPair.terms} ${notification.trade.notional * notification.trade.spotRate}`}
        date={`(Spt) ${notification.trade.tradeDate.toString()}`}
      />
    </div>
  </Story>
))
