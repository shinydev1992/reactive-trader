import React, { Component } from 'react'
import { Flex } from 'rt-components'
import { CurrencyPair, Direction, PriceMovementTypes } from 'rt-types'
import { styled, withDefaultProps } from 'rt-util'
import { spotDateFormatter } from '../model/dateUtils'
import { SpotTileData } from '../model/spotTileData'
import NotionalInput from './NotionalInput'
import PriceControls from './PriceControls'
import { DeliveryDate, TileSymbol } from './Styled'

const SpotTileStyle = styled('div')`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  height: 100%;
  border-radius: 3px;
  padding: 20px;
  box-sizing: border-box;
`

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executeTrade: (direction: Direction) => void
}

class SpotTile extends Component<Props> {
  render() {
    const { currencyPair, spotTileData, executeTrade } = this.props
    const priceData = spotTileData.price
    const spotDate = spotDateFormatter(priceData.valueDate, false).toUpperCase()
    return (
      <SpotTileStyle>
        <Flex direction="column" justifyContent="space-between" height="100%">
          <Flex alignItems="center" justifyContent="space-between">
            <TileSymbol symbol={`${currencyPair.base}/${currencyPair.terms}`} />
            <DeliveryDate date={spotDate} />
          </Flex>
          <PriceControls executeTrade={executeTrade} priceData={priceData} currencyPair={currencyPair} />
          <NotionalInput currencyPairSymbol={currencyPair.base} />
        </Flex>
      </SpotTileStyle>
    )
  }
}

const defaultProps = {
  currencyPair: {
    symbol: '',
    ratePrecision: 0,
    pipsPosition: 0,
    base: '',
    terms: ''
  },
  spotTileData: {
    currencyChartIsOpening: false,
    isTradeExecutionInFlight: false,
    hasError: false,
    price: {
      ask: 0,
      bid: 0,
      mid: 0,
      creationTimestamp: 0,
      symbol: '',
      valueDate: '',
      priceMovementType: PriceMovementTypes.None
    }
  }
}

export default withDefaultProps(defaultProps, SpotTile)
