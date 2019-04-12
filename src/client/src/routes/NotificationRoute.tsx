import React from 'react'
import { Trade } from 'rt-types'

import { ThemeProvider } from 'rt-theme'
import TradeNotification from '../shell/notification/TradeNotification'
import { openFinNotifications, InteropTopics } from 'rt-components'

interface Message {
  tradeNotification: Trade
}

interface State {
  message: Message | null
}

export class NotificationRoute extends React.Component<{}, State> {
  state: State = {
    message: null,
  }

  componentDidMount = () => {
    if (typeof fin !== 'undefined') {
      if (openFinNotifications.length > 0) {
        const message = openFinNotifications.pop()
        this.setState({ message }, () =>
          // send a message back to the main application - required to restore the main application window if it's minimised
          fin.desktop.Notification.getCurrent().sendMessageToApplication('ack'),
        )
      }
    }
  }

  onDismissNotification = () => fin.desktop.Notification.getCurrent().close()

  highlightTradeInBlotter = () =>
    fin.desktop.InterApplicationBus.publish(InteropTopics.HighlightBlotter, this.state.message)

  render() {
    const { message } = this.state
    return !!message ? (
      <ThemeProvider>
        <TradeNotification
          trade={message.tradeNotification}
          dismissNotification={this.onDismissNotification}
          highlightTradeInBlotter={this.highlightTradeInBlotter}
        />
      </ThemeProvider>
    ) : null
  }
}

export default NotificationRoute
