import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from '../model/index'
import SpotTile from './SpotTile'
import { ThemeProvider } from 'rt-theme'
import numeral from 'numeral'
import { AnalyticsTile } from './analyticsTile'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  tileView?: string
}

interface State {
  notional: string
}

class Tile extends React.Component<Props, State> {
  state = {
    notional: '1000000',
  }
  components = {
    Normal: SpotTile,
    Analytics: AnalyticsTile,
  }
  updateNotional = (notional: string) => this.setState({ notional })

  executeTrade = (direction: Direction, rawSpotRate: number) => {
    const { currencyPair, executeTrade } = this.props
    const notional = this.getNotional()
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional,
      rawSpotRate,
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }

  getNotional = () => numeral(this.state.notional).value() || DEFAULT_NOTIONAL

  canExecute = () => {
    const { spotTileData, executionStatus } = this.props
    return Boolean(
      executionStatus === ServiceConnectionStatus.CONNECTED &&
        !spotTileData.isTradeExecutionInFlight &&
        spotTileData.price,
    )
  }

  render() {
    const { currencyPair, spotTileData, executionStatus, tileView } = this.props
    const { notional } = this.state
    const Component = tileView ? this.components[tileView] : SpotTile
    return (
      <ThemeProvider theme={theme => theme.tile}>
        <Component
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={this.executeTrade}
          executionStatus={executionStatus}
          notional={notional}
          updateNotional={this.updateNotional}
          canExecute={!this.canExecute()}
        >
          {this.props.children}
        </Component>
      </ThemeProvider>
    )
  }
}

export default Tile
