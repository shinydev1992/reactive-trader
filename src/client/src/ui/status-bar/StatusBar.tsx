import _ from 'lodash'
import React, { Component } from 'react'

import { ConnectionState } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { Content, Fill, Header, Root } from './styled'
import { OpenFinLogo } from './assets/OpenFinLogo'
import { PlatformAdapter, withPlatform } from 'rt-components'
import { withTheme, ThemeProvider } from 'styled-components'
import { Theme } from 'rt-theme'

interface State {}

const mapToTheme = {
  [ServiceConnectionStatus.CONNECTED]: 'good',
  [ServiceConnectionStatus.CONNECTING]: 'aware',
  [ServiceConnectionStatus.DISCONNECTED]: 'bad',
}

const getApplicationStatus = (services: ServiceStatus[]) => {
  if (services.every(s => s.connectionStatus === ServiceConnectionStatus.CONNECTED)) {
    return ServiceConnectionStatus.CONNECTED
  } else if (services.some(s => s.connectionStatus === ServiceConnectionStatus.CONNECTING)) {
    return ServiceConnectionStatus.CONNECTING
  } else {
    return ServiceConnectionStatus.DISCONNECTED
  }
}

const Logo: React.SFC<{ platform: PlatformAdapter }> = ({ platform }) => (
  <div>{platform.type === 'desktop' && <OpenFinLogo />}</div>
)

const LogoWithPlatform = withPlatform(Logo)

class StatusBar extends Component<
  {
    connectionStatus: ConnectionState
    services: ServiceStatus[]
    theme: Theme
  },
  State
> {
  state = {}

  render() {
    const { services } = this.props

    const mode = getApplicationStatus(services)
    return (
      <ThemeProvider theme={theme.button[mapToTheme[mode]]}>
        <Root>
          <Content expand={false}>
            <Header>
              <Fill />
              <LogoWithPlatform />
              {this.props.children}
            </Header>
          </Content>
        </Root>
      </ThemeProvider>
    )
  }
}
