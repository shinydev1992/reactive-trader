import React from 'react'

import { Input } from 'rt-styleguide'
import { styled } from 'rt-theme'
import { keyframes } from 'styled-components'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-column-gap: 2rem;
  grid-row-gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
`

const HoveredInput = styled(Input)`
  & input {
    border-bottom: ${({ theme }) =>
      `1px solid ${theme.name === 'light' ? '#beccdc' : theme.colors.light.secondary[4]}`};
  }
`

const blink = keyframes`
  0%, 50% {
    opacity: .7;
  }
  51%, 100% {
    opacity: 0;
  }
`

const ActiveInput = styled(Input)`
  & input {
    border-bottom: ${({ theme }) => `1px solid ${theme.accents.dominant.darker}`};
  }
  & input:hover {
    border-bottom: ${({ theme }) => `1px solid ${theme.accents.dominant.base}`};
  }
  & label::before {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => theme.accents.dominant.base};
    width: 1px;
    animation: ${blink} 1s infinite;
    height: 12px;
    left: 48px;
    top: 5px;
  }
`
const ActiveNumberInput = styled(ActiveInput)`
  & label::before {
    left: unset;
    right: 3px;
  }
`

const FormGrid = () => {
  return (
    <Grid>
      <div>Figures</div>
      <Input type="number" placeholder="Prompt" label="" />
      <HoveredInput type="number" placeholder="Value" label="" />
      <ActiveNumberInput type="number" placeholder="Prompt" value="10" label="" />
      <Input type="number" placeholder="Prompt" value="10" disabled label="" />

      <div>Text</div>
      <Input type="text" placeholder="Text" label="" />
      <HoveredInput type="text" placeholder="Text" status="info" label="" />
      <ActiveNumberInput type="text" placeholder="Prompt" status="info" value="Text" label="" />
      <Input type="text" placeholder="Text" label="" disabled />
    </Grid>
  )
}

export default FormGrid
