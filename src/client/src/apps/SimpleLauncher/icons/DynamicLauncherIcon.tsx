import React, { FC, memo } from 'react'
import { css, keyframes } from 'styled-components'
import { styled } from 'rt-theme'
import LauncherIcon from './LauncherIcon'

const fillChangeKeyframes = (path?: number) => keyframes`
  0% {
    fill: ${path === 2 ? '#8C7AE6' : '#FFF'};
  }
  50% {
    fill: ${path === 2 ? '#FFF' : '#8C7AE6'};
  }
`

const fillChangeAnimation = (delay: number, path?: number) => css`
  animation-name: ${fillChangeKeyframes(path)};
  animation-duration: 0.3s;
  animation-iteration-count: 1;
  animation-delay: ${delay}s;
`

const getPathFillAnimationProperty = ({ isMoving }: { isMoving: boolean }) => {
  if (!isMoving) {
    return ''
  }

  return css`
    path:nth-child(2) {
      ${fillChangeAnimation(0, 1)}
    }
    path:nth-child(3) {
      ${fillChangeAnimation(0.1)}
    }
    path:nth-child(4) {
      ${fillChangeAnimation(0.2)}
    }
    path:nth-child(5) {
      ${fillChangeAnimation(0.3)}
    }
  `
}

const DynamicLauncherLogoWrapper = styled.button<{ isMoving: boolean }>`
  svg {
    ${getPathFillAnimationProperty}
  }
`

interface Props {
  isMoving: boolean
}

const DynamicLauncherLogo: FC<Props> = ({ isMoving }) => (
  <DynamicLauncherLogoWrapper isMoving={isMoving}>
    <LauncherIcon />
  </DynamicLauncherLogoWrapper>
)

export default memo(DynamicLauncherLogo)
