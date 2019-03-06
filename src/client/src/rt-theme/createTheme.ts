import { darken } from 'polished'
import { mapValues } from 'lodash'
import template from './template'
import { keyframes } from 'styled-components'

import colors, { AccentPaletteMap, Color, CorePalette, CorePaletteMap } from './colors'

export interface BaseTheme {
  white: Color
  black: Color
  transparent: Color

  primary: CorePalette
  secondary: CorePalette
  accents: AccentPaletteMap
  colors: typeof colors

  motion: Motion & {
    fast: Motion
    normal: Motion
    slow: Motion
  }

  shell: ColorPair

  overlay: ColorPair

  button: TouchableStyleSet

  // Known extensible properties
  backgroundColor?: Color
  textColor?: Color
  // shadowColor?: Color

  // TODO (8/14/18) remove after theme migration
  [key: string]: any
}

export type ExtensibleThemeValue = Color | null
export type GeneratedTheme = ReturnType<typeof generateTheme>
export type Theme = BaseTheme & GeneratedTheme

export interface Touchable {
  backgroundColor: Color
  textColor: Color

  active: ColorPair
  disabled: ColorPair
}
export type TouchableStyle = 'primary' | 'secondary' | 'good' | 'aware' | 'bad'
export type TouchableStyleSet = { [style in TouchableStyle]: Touchable }

export interface Motion {
  duration: number
  easing: string
}

export interface ColorPair {
  backgroundColor: string
  textColor?: string
}

export type ThemeModifier = (original: GeneratedTheme) => GeneratedTheme

const generateTheme = ({ primary, secondary, core }: CorePaletteMap, accents: AccentPaletteMap) => ({
  template,
  core,
  white: colors.static.white,
  black: colors.static.black,
  transparent: colors.static.transparent,

  backgroundColor: null as ExtensibleThemeValue,
  textColor: null as ExtensibleThemeValue,
  // shadowColor: null as ExtensibleThemeValue,

  primary,
  secondary,
  accents,
  colors,

  motion: {
    duration: 16 * 16,
    easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',

    fast: {
      duration: 16 * 16,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    },

    normal: {
      duration: 16 * 16,
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    },

    slow: {
      duration: 16 * 16,
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    },
  },

  overlay: {
    backgroundColor: darken(0.1, primary[1]),
    textColor: secondary[2],
  },

  tile: {
    inputColor: secondary['4'],
  },

  flash: keyframes`
    0% {
      background-color: ${primary.base};
    }
    50% {
      background-color: ${accents.primary.darker};
    }
    100% {
      background-color: ${primary.base};
    }
  `,

  button: {
    mute: {
      backgroundColor: primary.base,
      textColor: secondary.base,

      active: {
        backgroundColor: primary[4],
      },
      disabled: {
        backgroundColor: primary[3],
      },
    },

    primary: {
      backgroundColor: accents.primary.base,
      textColor: colors.light.primary.base,

      active: {
        backgroundColor: accents.primary.darker,
      },
      disabled: {
        backgroundColor: accents.primary.lighter,
      },
    },

    secondary: {
      backgroundColor: secondary.base,
      textColor: primary.base,

      active: {
        backgroundColor: secondary[3],
      },
      disabled: {
        backgroundColor: secondary[4],
      },
    },

    ...mapValues(accents, ({ base, darker, lighter }) => ({
      backgroundColor: base,
      textColor: colors.light.primary.base,

      active: {
        backgroundColor: darker,
      },
      disabled: {
        backgroundColor: lighter,
      },
    })),
  },
})

export const createTheme = (
  { primary, secondary, core }: CorePaletteMap,
  accents: AccentPaletteMap,
  modifier: ThemeModifier = theme => ({ ...theme }),
) => modifier(generateTheme({ primary, secondary, core }, accents))

export default createTheme
