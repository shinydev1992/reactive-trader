import React from 'react'
import { AnalyticsContainer } from '../../ui/analytics'

import { Resizer, TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import { BlotterContainer } from '../../ui/blotter'
import StatusBar from '../../ui/status-bar'
import { WorkspaceContainer } from '../../ui/workspace'

import ReconnectModal from '../components/reconnect-modal'

import DefaultLayout from '../layouts/DefaultLayout'

const portalProps = {
  blotterRegion: {
    title: 'Blotter',
    config: {
      name: 'blotter',
      width: 850,
      height: 450,
      url: 'about:Blotter'
    }
  },
  analyticsRegion: {
    title: 'Analytics',
    config: {
      name: 'analytics',
      width: 400,
      height: 800,
      url: 'about:Analytics'
    }
  }
}

export const ShellRoute: React.SFC<{ header: React.ReactChild }> = ({ header }) => (
  <DefaultLayout
    header={header}
    body={
      <Resizer
        defaultHeight={30}
        component={() => (
          <BlotterWrapper>
            <TearOff
              id="blotter"
              portalProps={portalProps.blotterRegion}
              render={(popOut, tornOff) => <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} />}
            />
          </BlotterWrapper>
        )}
      >
        <WorkspaceWrapper>
          <WorkspaceContainer />
        </WorkspaceWrapper>
      </Resizer>
    }
    aside={
      <AnalyticsWrapper>
        <TearOff
          id="region"
          portalProps={portalProps.analyticsRegion}
          render={(popOut, tornOff) => <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} />}
        />
      </AnalyticsWrapper>
    }
    footer={<StatusBar />}
    after={<ReconnectModal />}
  />
)

const Wrapper = styled.div`
  user-select: none;
  height: 100%;
  width: 100%;
`

const WorkspaceWrapper = styled(Wrapper)`
  padding: 0 0.5rem 0 1rem;
  position: absolute;
  overflow: scroll;
`

const AnalyticsWrapper = styled(Wrapper)`
  padding: 0.375rem 1.25rem 0 0;
  overflow: hidden;

  @media (max-width: 750px) {
    display: none;
  }
`

const BlotterWrapper = styled(Wrapper)`
  padding: 0 0.5rem 0 1rem;
  position: absolute;
`

export default ShellRoute
