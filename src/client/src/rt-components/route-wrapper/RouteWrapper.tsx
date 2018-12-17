import React from 'react'
import { OpenFinChrome, OpenFinHeader, PlatformAdapter, withPlatform } from 'rt-components'
import { testStyled } from 'test-theme'

const RouteStyle = testStyled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`

interface Props {
  platform: PlatformAdapter
}

const RouteWrapperBase: React.SFC<Props> = ({ children, platform }) => (
  <RouteStyle>
    {platform.name === 'openfin' ? (
      <OpenFinChrome>
        <OpenFinHeader close={platform.window.close} />
        {children}
      </OpenFinChrome>
    ) : (
      children
    )}
  </RouteStyle>
)

const RouteWrapper = withPlatform(RouteWrapperBase)

export { RouteStyle, RouteWrapper }
