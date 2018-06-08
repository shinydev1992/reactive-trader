import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { CurrencyPair, Direction, ExecuteTradeRequest } from '../../types/'
import { SpotPriceTick } from '../../types/spotPriceTick'
import { SpotTileData } from '../../types/spotTileData'
import { addRegion, openWindow } from '../common/regions/regionsOperations'
import { createDeepEqualSelector } from '../utils/mapToPropsSelectorFactory'
import { spotRegionSettings, SpotTileActions } from './actions'
import SpotTile from './SpotTile'
import { createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from './spotTileUtils'

const buildSpotTileDataObject = (tileData, spotTick: SpotPriceTick, currencyPair: CurrencyPair) => {
  const tileDataObject: any = { ...tileData, ...spotTick, ...currencyPair }
  return tileDataObject
}

const makeGetSpotTileData = () =>
  createDeepEqualSelector(
    (state: any, props) => state.spotTilesData[props.id],
    (state: any, props) => state.pricingService[props.id],
    (state: any, props) => state.currencyPairs[props.id],
    (spotTilesData = {}, pricingService, currencyPairs) =>
      buildSpotTileDataObject(spotTilesData, pricingService, currencyPairs)
  )

const makeGetCurrencyPair = () =>
  createDeepEqualSelector((state: any, props) => state.currencyPairs[props.id], currencyPairs => currencyPairs)

interface SpotTileContainerOwnProps {
  id: string
}

interface SpotTileContainerStateProps {
  isConnected: boolean
  executionConnected: boolean
  pricingConnected: boolean
  canPopout: boolean
  currencyPair: CurrencyPair
  spotTilesData: SpotTileData
  notionals: any
  isRunningOnDesktop: boolean
}

interface SpotTileContainerDispatchProps {
  executeTrade: (request: any) => void
  onComponentMount: (id: string) => void
  onPopoutClick: (region: string) => () => void
  undockTile: (title: string) => () => void
  displayCurrencyChart: (symbol: string) => () => void
  onNotificationDismissedClick: (symbol: string) => () => void
}

type SpotTileContainerProps = SpotTileContainerOwnProps & SpotTileContainerStateProps & SpotTileContainerDispatchProps

class SpotTileContainer extends React.Component<SpotTileContainerProps, any> {
  componentDidMount() {
    this.props.onComponentMount(this.props.id)
  }

  shouldComponentUpdate(nextProps: SpotTileContainerProps, nextState: any) {
    const shouldUpdate = !_.isEqual(this.props.spotTilesData, nextProps.spotTilesData)
    return shouldUpdate
  }
  render() {
    const {
      id,
      currencyPair,
      spotTilesData,
      executionConnected,
      // tslint:disable-next-line:no-shadowed-variable
      pricingConnected,
      onPopoutClick,
      // tslint:disable-next-line:no-shadowed-variable
      undockTile,
      onNotificationDismissedClick,
      // tslint:disable-next-line:no-shadowed-variable
      displayCurrencyChart
    } = this.props
    const spotTitle = spotRegionSettings(id).title
    return (
      <SpotTile
        key={id}
        pricingConnected={pricingConnected}
        executionConnected={executionConnected}
        currencyPair={currencyPair}
        isRunningOnDesktop={this.props.isRunningOnDesktop}
        spotTileData={spotTilesData}
        onPopoutClick={onPopoutClick(id)}
        displayCurrencyChart={displayCurrencyChart(id)}
        onNotificationDismissedClick={onNotificationDismissedClick(id)}
        undockTile={undockTile(spotTitle)}
        executeTrade={this.executeTrade}
      />
    )
  }

  private executeTrade = (direction: Direction) => {
    const { executionConnected, spotTilesData } = this.props
    if (!executionConnected || spotTilesData.isTradeExecutionInFlight) {
      return
    }

    const rate = direction === Direction.Buy ? spotTilesData.ask : spotTilesData.bid
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: this.props.currencyPair.base,
      symbol: this.props.currencyPair.symbol,
      notional: this.props.notionals[this.props.currencyPair.symbol] || DEFAULT_NOTIONAL,
      rawSpotRate: rate
    }

    this.props.executeTrade(createTradeRequest(tradeRequestObj))
  }
}

const mapDispatchToProps = dispatch => {
  return {
    executeTrade: (tradeRequestObj: ExecuteTradeRequest) => {
      dispatch(SpotTileActions.executeTrade(tradeRequestObj, null))
    },
    onComponentMount: id => {
      dispatch(addRegion(spotTileRegion(id)))
    },
    onPopoutClick: id => {
      return () => {
        dispatch(openWindow(spotTileRegion(id)))
      }
    },
    undockTile: tileName => {
      return () => {
        dispatch(SpotTileActions.undockTile(tileName))
      }
    },
    displayCurrencyChart: symbol => {
      return () => dispatch(SpotTileActions.displayCurrencyChart(symbol))
    },
    onNotificationDismissedClick: symbol => {
      return () => dispatch(SpotTileActions.dismissNotification(symbol))
    }
  }
}

const makeMapStateToProps = () => {
  const getCurrencyPair = makeGetCurrencyPair()
  const getSpotTileData = makeGetSpotTileData()
  const mapStateToProps = (state: GlobalState, props) => {
    const { compositeStatusService, displayAnalytics, notionals, environment } = state
    const executionConnected =
      compositeStatusService && compositeStatusService.execution && compositeStatusService.execution.isConnected
    const pricingConnected =
      compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected
    const isConnected =
      compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected
    return {
      isRunningOnDesktop: environment.isRunningOnDesktop,
      isConnected,
      executionConnected,
      pricingConnected,
      displayAnalytics,
      currencyPair: getCurrencyPair(state, props),
      spotTilesData: getSpotTileData(state, props),
      notionals
    }
  }

  return mapStateToProps
}

const ConnectedSpotTileContainer = connect(makeMapStateToProps, mapDispatchToProps)(SpotTileContainer)
const spotTileRegion = id => ({
  id,
  isTearedOff: false,
  container: connect(state => ({ id }))(ConnectedSpotTileContainer),
  settings: spotRegionSettings(id)
})

export default ConnectedSpotTileContainer
