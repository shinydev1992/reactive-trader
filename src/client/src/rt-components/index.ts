import {
  platform,
  PlatformAdapter,
  externalWindowDefault,
  PlatformProvider,
  PlatformName,
  WindowConfig,
  openFinNotifications,
  setupGlobalOpenfinNotifications,
  usePlatform,
} from './platform'

export {
  platform,
  usePlatform,
  externalWindowDefault,
  PlatformProvider,
  openFinNotifications,
  setupGlobalOpenfinNotifications,
}
export type PlatformAdapter = PlatformAdapter
export type PlatformName = PlatformName
export type WindowConfig = WindowConfig
export { TearOff } from './tear-off'
export {
  OpenFinChrome,
  OpenFinControls,
  OpenFinHeader,
  OPENFIN_CHROME_HEADER_HEIGHT,
} from './open-fin'
export { Flex, flexStyle } from './flex'
export { PopoutIcon, ExpandIcon, LogoIcon } from './icons'
export { default as Modal } from './modal'
export { default as AdaptiveLoader } from './adaptive-loader'
export { default as Loadable } from './loadable'
export { default as Resizer } from './resizer'
export { Timer } from './timer'
export { RouteWrapper, RouteStyle } from './route-wrapper'
export { default as Popup } from './popup'
export { excelAdapter, InteropTopics, Browser, OpenFin, Finsemble } from './platform'
