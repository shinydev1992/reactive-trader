import React, { PureComponent } from 'react'

import { createEnvironment, Environment } from 'rt-components'
import { ThemeName, ThemeProvider, ThemeStorage } from 'rt-theme'

import { OrderTicket } from './OrderTicket'

export class OrderTicketRoute extends PureComponent {
  environment = createEnvironment()

  render() {
    return (
      <ThemeStorage.Provider storage={sessionStorage} default={ThemeName.Dark}>
        <Environment.Provider value={this.environment}>
          <ThemeProvider
            theme={theme => ({
              ruleColor: theme.primary.base,
            })}
          >
            <OrderTicket />
          </ThemeProvider>
        </Environment.Provider>
      </ThemeStorage.Provider>
    )
  }
}
