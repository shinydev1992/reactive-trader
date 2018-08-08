import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'emotion-theming'

import { Environment, withEnvironment } from 'rt-components'
import { Flex } from 'rt-components'
import { ConnectionType, ServiceConnectionInfo } from 'system'
import Icon from './Icon'

import { Root, Body, Fill, ExpandToggle, ServiceList, ServiceRoot, ServiceName, NodeCount } from './styled.js'

export const SERVICES = ['blotter', 'reference', 'execution', 'pricing', 'analytics'].map(serviceType => ({
  serviceType
}))

class StatusBar extends Component {
  state = {
    expanded: true
  }

  resolveTheme = theme => {
    const { mode } = this.props
    const currentTheme = theme.statusBar[mode]

    theme = {
      ...theme,
      ...theme.statusBar,
      ...theme.statusBar[mode],
      serviceItem: {
        connecting: theme.statusBar.connected,
        disconnected: mode === 'connecting' ? theme.statusBar.connecting : theme.statusBar.disconnected
      }
    }

    return theme
  }

  toggleExpanded = () => this.setState(({ expanded }) => ({ expanded: !expanded }))

  render() {
    const {
      connectionStatus: { url, transportType },
      mode,
      serviceStatus
    } = this.props

    const { expanded } = this.state

    return (
      <ThemeProvider key={mode} theme={this.resolveTheme}>
        <Root expand={expanded}>
          <Body onClick={this.toggleExpanded}>
            <Icon name="check" />

            {mode === 'disconnected' ? (
              'Disconnected'
            ) : (
              <React.Fragment>
                {_.capitalize(mode)} to {url} ({transportType})
              </React.Fragment>
            )}

            <Fill />

            <ExpandToggle expand={expanded} />
          </Body>

          <ServiceList>
            {_.map(SERVICES, (service, index) => (
              <Service
                key={service.serviceType + service.isConnected}
                service={serviceStatus[service.serviceType] || service}
                index={index}
              />
            ))}
          </ServiceList>
        </Root>
      </ThemeProvider>
    )
  }
}

const Service = ({ service: { serviceType, isConnected, connectedInstanceCount }, index }) => (
  <ThemeProvider theme={theme => theme.serviceItem[isConnected ? 'connecting' : 'disconnected']}>
    <ServiceRoot index={index + 2}>
      <Icon name={isConnected == null ? 'ellipsis-h' : isConnected ? 'check' : 'times'} />
      <div>
        <ServiceName>{serviceType}</ServiceName>
        <NodeCount>
          {connectedInstanceCount != null && (
            <React.Fragment>
              ({connectedInstanceCount} Node{connectedInstanceCount !== 1 ? 's' : ''})
            </React.Fragment>
          )}
        </NodeCount>
      </div>
    </ServiceRoot>
  </ThemeProvider>
)

export default connect(({ compositeStatusService: serviceStatus, connectionStatus }) => {
  const services = Object.values(serviceStatus).map(s => s.isConnected)
  const mode =
    services.length < SERVICES.length || (services.some(s => s) && !services.every(s => s))
      ? 'connecting'
      : services.every(s => s)
        ? 'connected'
        : 'disconnected'

  return {
    connectionStatus,
    serviceStatus,
    mode
  }
})(StatusBar)
