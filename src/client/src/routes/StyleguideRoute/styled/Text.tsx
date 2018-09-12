import { filter, get } from 'lodash'

import { css, styled, Styled } from 'rt-theme'

export interface TextProps {
  lineHeight?: 1 | 1.25 | 1.5 | 2 | 2.5 | 3 | 4 | 5
  fontSize?: 0.625 | 0.75 | 0.875 | 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 2.5 | 3 | any
  fontStyle?: 'italic'
  fontWeight?: number | 'bold'
  fontFamily?: 'lato' | 'montserrat'
  textAlign?: 'initial' | 'left' | 'center' | 'right'
  opacity?: 0 | 0.25 | 0.5 | 0.75 | 1
}

type CSS = ReturnType<typeof css>

export const textProps = {
  lineHeight: ({ lineHeight }) => css({ lineHeight: `${lineHeight}rem` }),
  fontSize: ({ fontSize }) => css({ fontSize: `${fontSize}rem` }),
  fontWeight: ({ fontWeight }) => css({ fontWeight }),
  fontStyle: ({ fontStyle }) => css({ fontStyle }),
  fontFamily: ({ fontFamily }) => css({ fontFamily }),
  textAlign: ({ textAlign }) => css({ textAlign }),
  textTransform: ({ textTransform }) => css({ textTransform }),
  color: ({ color, theme }) =>
    css({ color: (color === true && theme.textColor) || get(theme, color) || get(theme.spectrum, color) }),
  opacity: ({ opacity }) => css({ opacity })
}

export function mapTextProps(props): any[] {
  return filter(textProps, (fn: (object) => CSS, key) => props[key] && props[key] != null && fn(props))
}

export const Text: Styled<TextProps> = styled.span`
  max-width: 60em;

  ${mapTextProps as (object) => CSS[]};
`

export default Text
