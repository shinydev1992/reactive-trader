import { AccentName } from 'rt-theme'
import { FunctionComponent } from 'react'
import React from 'react'
import styled from 'styled-components/macro'
import { SnapshotActiveStatus } from 'rt-types'

const buttonHeight = '2rem'

export const HrBar = styled.hr`
  height: 1px;
  color: #282d39;
  background-color: #282d39;
  margin-bottom: 10px;
  margin-top: 5px;
  border: none;
`

export const CloseButton = styled.div<{ accent?: AccentName }>`
  color: ${props => props.theme.button.secondary.backgroundColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme, accent = 'primary' }) => theme.button[accent].backgroundColor};
  }
`

export const Button = styled.div`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 15rem;
  user-select: none;
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  padding: 0 0.7rem;
  height: 1.6rem;
  font-size: 0.65rem;
  font-weight: 350;
`

const StatusCircleCore: FunctionComponent<{ className?: string }> = ({ className }) => {
  return (
    <div
      style={{ width: '0.65rem', height: '0.65rem', display: 'inline-block', marginTop: '-2px' }}
    >
      <svg className={className} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" />
      </svg>
    </div>
  )
}

export const StatusCircle = styled(StatusCircleCore)<{ status?: SnapshotActiveStatus }>`
  circle {
    fill: ${({ theme, status }) =>
      status === SnapshotActiveStatus.ACTIVE
        ? theme.accents.positive.base
        : theme.accents.primary.base};
  }
`

export const Root = styled.div`
  position: relative;
  float: right;
  backface-visibility: hidden;
  min-height: ${buttonHeight};
  max-height: ${buttonHeight};

  font-size: 0.75rem;

  color: ${props => props.theme.textColor};
`

const Label = styled.div`
  min-width: 5rem;
  text-transform: capitalize;
  font-size: 0.75rem;
  line-height: 1rem;
  display: inline-block;
`

export const SnapshotReset = styled(Label)`
  display: none;
  margin-left: 0.5rem;
`

export const SnapshotName = styled(Label)<{ isActive?: boolean }>`
  &:hover {
    ${({ isActive }) => `
      ${SnapshotReset} {
        display: ${isActive ? 'inline-block' : 'none'}
      }
    `}
  }
`

export const SnapshotRoot = styled.div<{ isActive?: boolean }>`
  min-height: 2rem;
  max-height: 2rem;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: start;
  cursor: pointer;

  color: ${props => props.theme.textColor};

  ${({ theme }) => `
    &:hover {
      ${StatusCircle} {
        circle {
          fill: ${theme.accents.primary.base};
        }
      }
    }
  `}
`

export const SnapshotList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  grid-auto-flow: dense;
  padding: 0 0.75rem;

  ${SnapshotName} {
    padding-left: 1rem;
    padding-top: 0.1rem;
  }
`

export const TextInputLabel = styled.label`
  color: ${props => props.theme.textColor};
  display: block;
`
export const SnapshotListTitle = styled.label`
  color: ${props => props.theme.textColor};
  display: block;
  margin-bottom: 0.5rem;
`
export const TextInput = styled.input.attrs(props => ({
  type: 'text',
}))`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  border: none;
  color: ${props => props.theme.textColor};
  display: block;
  font-size: 1.1em;
  margin: 0 0 1em;
  padding: 0.25rem 0.75rem;
  width: 100%;
`

export const ErrorAlert = styled.div`
  background-color: ${props => props.theme.accents.negative.base};
  color: ${props => props.theme.textColor};
  padding: 0.25rem 0.75rem;
  margin: 0.25rem 0;
`

export const FormControl = styled.div`
  padding: 0.1rem 0.5rem;
  width: 100%;

  > ${TextInputLabel} {
    margin-bottom: 0.5rem;
  }
`
