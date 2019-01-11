import { styled } from 'rt-theme'
import { TileBaseStyle } from '../styled'

export const AnalyticsTileWrapper = styled.div`
  position: relative;
  min-height: 10rem;
  height: 100%;
  color: ${({ theme }) => theme.tile.textColor};
`
export const AnalyticsTileContent = styled.div`
  display: flex;
  height: 85%;
  justify-content: space-between;
`
export const GraphNotionalWrapper = styled.div`
  width: 58%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const LineChartWrapper = styled.div`
  width: 100%;
  height: 80%;
`

export const AnalyticsTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.tile.backgroundColor};
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
