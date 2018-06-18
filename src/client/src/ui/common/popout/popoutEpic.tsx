import * as React from 'react'
import { Provider } from 'react-redux'
import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as TILE_ACTIONS, SpotTileActions } from '../../spotTile/actions'
import { ACTION_TYPES as REGIONS_ACTIONS, RegionActions } from '../regions'
import { getPopoutService } from './index'

declare const window: any

const { popoutClosed, popoutOpened } = RegionActions

const generateView = container => {
  const childComponent = React.isValidElement(container) ? container : React.createElement(container)
  return React.createElement(Provider, { store: window.store }, childComponent)
}

const popoutWindowEpic: ApplicationEpic = (action$, store: any, { openFin }) => {
  return action$.pipe(
    ofType(REGIONS_ACTIONS.REGION_OPEN_WINDOW),
    map((action: any) => {
      const popoutService = getPopoutService(openFin)
      const { id, container, settings } = action.payload
      const popoutView = generateView(container)
      popoutService.openPopout(
        {
          id,
          url: '/#/popout',
          title: settings.title,
          onClosing: () => {
            store.dispatch(popoutClosed(action.payload))
          },
          windowOptions: {
            width: settings.width,
            height: settings.height,
            minWidth: 100,
            minHeight: settings.minHeight,
            resizable: settings.resizable,
            scrollable: settings.resizable,
            dockable: settings.dockable
          }
        },
        popoutView
      )
      return popoutOpened(action.payload)
    })
  )
}

type UndockAction = ReturnType<typeof SpotTileActions.undockTile>

const undockTile: ApplicationEpic = (action$, store, { openFin }) => {
  return action$.pipe(
    ofType<Action, UndockAction>(TILE_ACTIONS.UNDOCK_TILE),
    map(action => {
      const popoutService = getPopoutService(openFin)
      popoutService.undockPopout(action.payload)
      return action
    }),
    map(SpotTileActions.tileUndocked)
  )
}

export const popoutEpic = combineEpics(popoutWindowEpic, undockTile)
