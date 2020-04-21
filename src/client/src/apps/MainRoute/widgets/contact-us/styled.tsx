import { styled } from '../../../../rt-theme'
import { Popup } from 'rt-components'

const buttonHeight = '2rem'

export const ContactUsPopup = styled(Popup)`
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  bottom: calc(${buttonHeight} + 0.25rem);
  right: 0;
  border-radius: 0.5rem;
`

export const ContactUsContent = styled.div`
  font-size: 0.75rem;
  padding: 0.5rem;

  div,
  a {
    margin-bottom: 1rem;
  }

  span,
  a {
    display: block;
  }

  .header {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`

export const LogoWrapper = styled.div`
  padding: 1rem 0.5rem 0 0.5rem;
`

export const Link = styled.a`
  color: ${({ theme }) => theme.accents.primary.lighter};
`
