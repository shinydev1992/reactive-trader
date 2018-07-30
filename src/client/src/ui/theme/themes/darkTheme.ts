import {
  brandPrimary,
  brandSecondary,
  darkBackgroundExtra,
  darkBackgroundPrimary,
  darkBackgroundSecondary,
  darkBackgroundTertiary,
  darkTextMeta,
  darkTextPrimary,
  darkTextSecondary,
  darkTextTertiary
} from './baseColors'
import theme, { Theme } from './baseTheme'
import { darken, lighten } from './colorUtils'
import palette from './palette'

const getDarkPrimary = (color: string) => ({
  '0': darken(color, 30),
  '1': darken(color, 40),
  '2': color,
  '3': darken(color, 10)
})
const getDarkSecondary = (color: string) => ({
  '0': lighten(color, 100),
  '1': lighten(color, 95),
  '2': lighten(color, 90),
  '3': darken(color, 80)
})

const darkPalette = {
  ...palette,
  backgroundPrimary: darkBackgroundPrimary,
  backgroundSecondary: darkBackgroundSecondary,
  backgroundTertiary: darkBackgroundTertiary,
  backgroundExtra: darkBackgroundExtra,
  textPrimary: darkTextPrimary,
  textSecondary: darkTextSecondary,
  textTertiary: darkTextTertiary,
  textMeta: darkTextMeta,
  primary: getDarkPrimary(brandPrimary),
  secondary: getDarkSecondary(brandSecondary)
}

const darkTheme: Theme = {
  ...theme,
  palette: darkPalette
}

export default darkTheme
