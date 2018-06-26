import * as React from 'react'
import { BlotterContainer } from '../blotter'
import FooterContainer from '../footer/FooterContainer'
import { Modal } from '../modal'
import SidebarRegionContainer from '../sidebar'
import { WorkspaceContainer } from '../workspace/'

import * as classnames from 'classnames'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
import { Dispatch } from 'redux'
import RegionWrapper, { Region, RegionActions } from '../common/regions'
import TradeNotificationContainer from '../notification/TradeNotificationContainer'
import '../styles/css/index.css'
import { TearOff } from '../tearoff'

export interface ShellProps {
  sessionExpired: boolean
  showSplitter: boolean
  reconnect: () => void
}

type ShellDispatchProps = ReturnType<typeof mapDispatchToProps>

class Shell extends React.Component<ShellProps & ShellDispatchProps> {
  state = {
    gridDocument: null,
    tornOff: false
  }

  popout = () => {
    this.setState({ tornOff: true }, () => this.props.onPopout(blotterRegion))
  }

  popIn = () => {
    this.setState({ tornOff: false }, () => this.props.onPopin(blotterRegion))
  }

  static contextTypes = {
    openFin: PropTypes.object
  }
  appVersion: string = process.env.REACT_APP_VERSION // version from package.json exported in webpack.config.js

  render() {
    const { sessionExpired } = this.props
    const { tornOff } = this.state

    const portalProps = {
      name: 'blotter',
      title: 'Blotter',
      width: 850,
      height: 450,
      onUnload: this.popIn,
      url: 'about:Blotter'
    }

    return (
      <div
        className={classnames({
          shell__browser_wrapper: !this.context.openFin
        })}
      >
        <div className="shell__splash">
          <span className="shell__splash-message">
            {this.appVersion}
            <br />Loading...
          </span>
        </div>
        <div className="shell__container">
          <Modal shouldShow={sessionExpired} title="Session expired">
            <div>
              <div>Your 15 minute session expired, you are now disconnected from the server.</div>
              <div>Click reconnect to start a new session.</div>
              <button className="btn shell__button--reconnect" onClick={this.props.reconnect}>
                Reconnect
              </button>
            </div>
          </Modal>

          <WorkspaceContainer />
          <TearOff
            tornOff={tornOff}
            portalProps={portalProps}
            render={() => (
              <div className="shell__blotter-container">
                <div className="shell__blotter">
                  <BlotterContainer onPopoutClick={this.popout} tornOff={this.state.tornOff} />
                </div>
              </div>
            )}
          />

          <RegionWrapper region="analytics">
            <SidebarRegionContainer />
          </RegionWrapper>
        </div>
        <div className="shell__footer">
          <FooterContainer />
          <TradeNotificationContainer />
        </div>
      </div>
    )
  }
}

export const blotterRegion: Region = {
  id: 'blotter'
}

export const Conditional = ({ showSplitter, children }) => {
  if (showSplitter) {
    return (
      <SplitPane minSize={300} size={600} split="horizontal" style={{ position: 'relative' }}>
        {children}
      </SplitPane>
    )
  }
  return <div className="shell_workspace_blotter">{children}</div>
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPopout: region => dispatch(RegionActions.popoutOpened(region)),
  onPopin: region => dispatch(RegionActions.popoutClosed(region))
})

export default connect(
  null,
  mapDispatchToProps
)(Shell)
