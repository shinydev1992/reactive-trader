import { PlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'
import { openBrowserWindow } from './window'

export default class Browser implements PlatformAdapter {
  name = 'browser'
  type = 'browser'

  window = {
    close: () => window.close(),

    open: (config: WindowConfig) => openBrowserWindow(config),

    onClose: (win: Window, handler: () => void) => win.addEventListener('beforeunload', handler),
  }
}
