import numeral from 'numeral'
import React from 'react'
import { Environment } from 'rt-system'
import { PNLChartModel } from '../model/pnlChartModel'
import { PositionsChartModel } from '../model/positionsChartModel'
import AnalyticsBarChart from './AnalyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

import { CurrencyPairMap } from 'rt-types'
import PNLChart from './pnlChart/PNLChart'

import { PopoutIcon } from 'rt-components'
import { ThemeProvider } from 'rt-theme'
import {
  AnalyticsStyle,
  BubbleChart,
  Chart,
  Controls,
  Disconnected,
  Header,
  LastPosition,
  PopoutButton,
  Title
} from './styled'

export interface Props {
  tornOff: boolean
  isConnected: boolean
  currencyPairs: CurrencyPairMap
  pnlChartModel?: PNLChartModel
  positionsChartModel?: PositionsChartModel
  onMount?: () => void
  onPopoutClick?: () => void
}

const RESIZE_EVENT = 'resize'

export default class Analytics extends React.Component<Props> {
  private handleResize = () => this.forceUpdate()

  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount()
    }
  }

  // Resizing the window is causing the nvd3 chart to resize incorrectly. This forces a render when the window resizes
  componentWillMount() {
    window.addEventListener(RESIZE_EVENT, this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener(RESIZE_EVENT, this.handleResize)
  }

  render() {
    const { tornOff, isConnected, currencyPairs, pnlChartModel, positionsChartModel, onPopoutClick } = this.props

    if (!isConnected) {
      return <Disconnected>Disconnected</Disconnected>
    }

    const lastPos = (pnlChartModel && pnlChartModel.lastPos) || 0
    const color = getLastPositionColor(lastPos)

    const formattedLastPos = numeral(lastPos).format()

    return (
      <ThemeProvider theme={theme => theme.analytics}>
        <AnalyticsStyle>
          <Header>
            {!Environment.isRunningInIE() &&
              !tornOff && (
                <Controls>
                  <PopoutButton onClick={onPopoutClick}>
                    <PopoutIcon width={0.8125} height={0.75} />
                  </PopoutButton>
                </Controls>
              )}
            <Title>Analytics</Title>
          </Header>
          <LastPosition color={color}>USD {formattedLastPos}</LastPosition>
          <Chart>{pnlChartModel && <PNLChart {...pnlChartModel} />}</Chart>
          {positionsChartModel &&
            positionsChartModel.seriesData.length !== 0 && (
              <React.Fragment>
                <Title>Positions</Title>
                <BubbleChart>
                  <PositionsBubbleChart data={positionsChartModel.seriesData} currencyPairs={currencyPairs} />
                </BubbleChart>
                <Title>Profit and Loss</Title>
                <AnalyticsBarChart
                  chartData={positionsChartModel.seriesData}
                  currencyPairs={currencyPairs}
                  isPnL={true}
                />
              </React.Fragment>
            )}
        </AnalyticsStyle>
      </ThemeProvider>
    )
  }
}

function getLastPositionColor(lastPos: number) {
  let color = ''
  if (lastPos > 0) {
    color = 'green'
  }
  if (lastPos < 0) {
    color = 'red'
  }
  return color
}
