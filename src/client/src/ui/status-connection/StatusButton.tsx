import _ from 'lodash'
import React, { Component, SyntheticEvent } from 'react'

import { ConnectionState } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { Button, StatusCircle, StatusLabel, Root, AppUrl, ServiceListPopup, ServiceList } from './styled'
import Service from './Service'

interface State {
  opened: boolean
}

export class StatusButton extends Component<
  {
    connectionStatus: ConnectionState
    services: ServiceStatus[]
  },
  State
> {
  state = {
    opened: false,
  }

  toggleOpen = (e: SyntheticEvent) => {
    if (!this.isAppUrl(e.target)) {
      this.setState(({ opened }) => ({ opened: !opened }))
    }
  }

  isAppUrl = (element: any) => element instanceof HTMLInputElement

  selectAll = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement
    input.select()
  }

  getApplicationStatus = (services: ServiceStatus[]) => {
    if (services.every(s => s.connectionStatus === ServiceConnectionStatus.CONNECTED)) {
      return ServiceConnectionStatus.CONNECTED
    } else if (services.some(s => s.connectionStatus === ServiceConnectionStatus.CONNECTING)) {
      return ServiceConnectionStatus.CONNECTING
    } else {
      return ServiceConnectionStatus.DISCONNECTED
    }
  }

  render() {
    const {
      connectionStatus: { url, transportType },
      services,
    } = this.props

    const { opened } = this.state
    const appStatus = this.getApplicationStatus(services)
    return (
      <Root>
        <Button onClick={this.toggleOpen}>
          <StatusCircle status={appStatus} />
          <StatusLabel status={appStatus} />
        </Button>

        <ServiceListPopup open={opened} onClick={this.toggleOpen}>
          <ServiceList>
            <AppUrl
              title={`${url} (${transportType})`}
              readOnly={true}
              value={`${url} (${transportType})`}
              onFocus={this.selectAll}
              onClick={this.selectAll}
            />

            {services.map((service, index) => (
              <Service key={service.serviceType} service={service} index={index} />
            ))}
          </ServiceList>
        </ServiceListPopup>
      </Root>
    )
  }
}
