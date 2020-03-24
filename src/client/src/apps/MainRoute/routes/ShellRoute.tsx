import React from 'react'
import { useSelector, useMemo } from 'react-redux'
import { Resizer, TearOff } from 'rt-components'
import { externalWindowDefault, ExternalWindow, WindowPosition } from 'rt-platforms'
import { AnalyticsContainer } from '../widgets/analytics'
import { BlotterContainer } from '../widgets/blotter'
import StatusBar from '../widgets/status-bar'
import StatusButton from '../widgets/status-connection'
import { WorkspaceContainer } from '../widgets/workspace'
import ReconnectModal from '../components/reconnect-modal'
import { analyticsSelector, blotterSelector, liveRatesSelector, DefaultLayout } from '../layouts'
import { BlotterWrapper, AnalyticsWrapper, OverflowScroll, WorkspaceWrapper } from './styled'

interface Props {
  header?: React.ReactChild
}

const addLayoutToConfig = (windowConfig: ExternalWindow, layout: WindowPosition) => {
  return {
    ...windowConfig,
    config: {
      ...windowConfig.config,
      x: layout.x,
      y: layout.y,
    },
  }
}

const ShellRoute: React.FC<Props> = ({ header }) => {
  const blotter = useSelector(blotterSelector)
  const analytics = useSelector(analyticsSelector)
  const liveRates = useSelector(liveRatesSelector)

  const lastRemainingService = useMemo(() => {
    const numberOfVisibleService = [blotter.visible, analytics.visible, liveRates.visible].filter(
      visible => visible === true,
    ).length

    return numberOfVisibleService === 1
  }, [blotter.visible, analytics.visible, liveRates.visible])

  const body = (
    <Resizer
      defaultHeight={30}
      component={() => (
        <BlotterWrapper data-qa="shell-route__blotter-wrapper">
          <TearOff
            id="blotter"
            dragTearOff
            externalWindowProps={addLayoutToConfig(externalWindowDefault.blotterRegion, blotter)}
            render={(popOut, tornOff) => (
              <BlotterContainer
                onPopoutClick={popOut}
                tornOff={tornOff}
                tearable
                lastRemainingService
              />
            )}
            tornOff={!blotter.visible}
          />
        </BlotterWrapper>
      )}
      disabled={!blotter.visible}
    >
      <TearOff
        id="liveRates"
        dragTearOff
        externalWindowProps={addLayoutToConfig(externalWindowDefault.liveRatesRegion, liveRates)}
        render={(popOut, tornOff) => (
          <WorkspaceWrapper data-qa="shell-route__workspace-wrapper">
            <OverflowScroll>
              <WorkspaceContainer onPopoutClick={popOut} tornOff={tornOff} tearable />
            </OverflowScroll>
          </WorkspaceWrapper>
        )}
        tornOff={!liveRates.visible}
      />
    </Resizer>
  )

  const aside = (
    <AnalyticsWrapper data-qa="shell-route__analytics-wrapper">
      <TearOff
        id="region"
        dragTearOff
        externalWindowProps={addLayoutToConfig(externalWindowDefault.analyticsRegion, analytics)}
        render={(popOut, tornOff) => (
          <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} tearable />
        )}
        tornOff={!analytics.visible}
      />
    </AnalyticsWrapper>
  )

  const footer = (
    <StatusBar>
      <StatusButton />
    </StatusBar>
  )

  return (
    <DefaultLayout
      header={header}
      body={body}
      aside={aside}
      footer={footer}
      after={<ReconnectModal />}
    />
  )
}

export default ShellRoute
