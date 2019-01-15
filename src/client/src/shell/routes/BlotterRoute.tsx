import React from 'react'
import { RouteWrapper } from 'rt-components'
import { BlotterContainer } from '../../ui/blotter'
import { styled } from 'rt-theme'

const BlotterContainerStyle = styled('div')`
  height: 450px;
  min-width: 850px;
  padding: 0rem 0.625rem;
  background-color: ${({ theme }) => theme.core.darkBackground};
`

const BlotterRoute = () => (
  <RouteWrapper>
    <BlotterContainerStyle>
      <BlotterContainer />
    </BlotterContainerStyle>
  </RouteWrapper>
)

export default BlotterRoute
