import { styled } from 'rt-theme'
import { transparentColor } from '../globals/variables'

export const AnalyticsStyle = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.analytics.textColor};
  background-color: ${({ theme }) => theme.analytics.backgroundColor};
  height: 100%;
  position: relative;
  padding: 1.25rem;
  font-size: 1rem;
  overflow-y: auto;

  /* axis */
  .nvd3 .nv-axis path,
  .nvd3 .nv-axis .tick.zero line {
    stroke: currentColor;
  }

  /* grid */
  .nvd3 .nv-axis line {
    stroke: ${transparentColor};
  }

  .analytics__positions-tooltip {
    position: absolute;
    width: auto;
    height: auto;
    padding: 2px 0.5rem;
    font-size: 0.75rem;
    background-color: ${({ theme }) => theme.analytics.textColor};
    color: ${({ theme }) => theme.analytics.backgroundColor};
    opacity: 1;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
    pointer-events: none;
    z-index: 1;
  }

  .analytics__positions-label {
    fill: ${({ theme }) => theme.white};
    font-size: 0.6875rem;
    pointer-events: none;
    user-select: none;
  }

  .new-chart-area {
    stroke-width: 2px !important;
    fill: url('#areaGradient');
  }
  .new-chart-stroke {
    stroke: url('#chartStrokeLinearGradient');
  }

  .stop1,
  .lineStop1 {
    stop-color: ${({ theme }) => theme.analytics.green.normal};
    stop-opacity: 0.5;
  }

  .stop1End,
  .lineStop1End {
    stop-color: ${({ theme }) => theme.analytics.green.normal};
  }

  .stop2,
  .lineStop2 {
    stop-color: ${({ theme }) => theme.analytics.red.normal};
  }

  .stop2End,
  .lineStop2End {
    stop-color: ${({ theme }) => theme.analytics.red.normal};
    stop-opacity: 0.5;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled.div``

export const LastPosition = styled.div<{ color?: string }>`
  color: ${({ theme, color }) => color && theme.analytics[color].normal};
  margin-bottom: 1rem;
`

export const BubbleChart = styled.div`
  text-anchor: middle;
  height: 18rem;
`

export const Chart = styled.div`
  position: relative;

  .nv-lineChart {
    .nv-axis.nv-y {
      text {
        font-size: 0.5rem;
        fill: ${({ theme }) => theme.analytics.textColor};
      }
    }

    .nv-axis.nv-x {
      text {
        font-size: 0.5rem;
        fill: ${({ theme }) => theme.analytics.textColor};
      }
    }
  }

  /* axis labels */
  .nv-lineChart .nv-axis.nv-x text,
  .nv-lineChart .nv-axis.nv-y text {
    fill: currentColor;
  }
`

export const Disconnected = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`

export const Controls = styled('div')`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;

  ${AnalyticsStyle}:hover & {
    opacity: 0.75;
  }
`

export const PopoutButton = styled('button')`
  .svg-icon {
    stroke: ${({ theme }) => theme.analytics.textColor};
    fill: ${({ theme }) => theme.analytics.textColor};
  }
`
