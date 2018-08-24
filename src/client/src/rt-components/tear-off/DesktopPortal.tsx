import React from 'react'
import { OpenFinChrome, OpenFinHeader } from 'rt-components'
import { DesktopWindowConfig, WindowConfig } from './types'

type DesktopWindowProps = WindowConfig & DesktopWindowConfig

export default class DesktopWindow extends React.PureComponent<DesktopWindowProps> {
  async componentDidMount() {
    this.props.createWindow(await this.openChild())
    this.forceUpdate()
  }

  render() {
    return (
      <OpenFinChrome>
        <OpenFinHeader hide close={this.props.closeWindow} />
        {this.props.children}
      </OpenFinChrome>
    )
  }

  openChild() {
    const { url, name, width: defaultWidth, height: defaultHeight } = this.props

    return new Promise<Window>(resolve => {
      const win = new fin.desktop.Window(
        {
          name,
          url,
          defaultWidth,
          defaultHeight,
          defaultCentered: true,
          autoShow: true,
          frame: false,
          saveWindowState: false
        },
        () => {
          resolve(win.getNativeWindow())
        },
        error => {
          console.log('Error creating window:', error)
        }
      )
    })
  }
}
