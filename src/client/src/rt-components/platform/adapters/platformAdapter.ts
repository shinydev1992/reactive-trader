import { AppConfig, WindowConfig, InteropServices } from './types'
import { Observable } from 'rxjs'

export interface PlatformAdapter {
  name: string
  type: string
  interopServices: InteropServices

  window: {
    open: (config: WindowConfig, onClose?: () => void) => Promise<Window | null>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
  }

  app?: {
    exit?: () => void
    open?: (id: string, config: AppConfig) => Promise<string>
  }

  interop?: {
    subscribe$: (topic: string) => Observable<any>
    publish: (topic: string, message: any) => void
  }

  notification?: {
    notify: (message: object) => void
  }
}
