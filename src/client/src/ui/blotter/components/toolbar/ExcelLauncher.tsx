import React, { FC } from 'react'
import { usePlatform } from 'rt-components'
import { styled } from 'rt-theme'
import ExcelIcon from './assets/ExcelIcon'

const ExcelButton = styled('button')`
  opacity: 0.59;
  height: 100%;
  .svg-fill {
    fill: ${({ theme }) => theme.core.textColor};
  }
  .svg-stroke {
    stroke: ${({ theme }) => theme.core.textColor};
  }

  margin: 5px;

  .svg-size {
    transform: scale(0.7)
  }
`

const ExcelLauncher: FC = () => {
  const platform = usePlatform()
  return platform.hasFeature('excel') ? (
    <ExcelButton onClick={() => platform.excel.open()}>
      <ExcelIcon />
    </ExcelButton>
  ) : null
}

export default ExcelLauncher
