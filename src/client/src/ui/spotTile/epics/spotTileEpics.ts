import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { of } from 'rxjs'
import { delay, map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as REFERENCE_ACTION_TYPES, ReferenceActions } from '../../../operations/referenceData'
import { ExecuteTradeResponse } from '../../../types'
import { ACTION_TYPES, SpotTileActions } from '../actions'
import ExecutionService from './executionService'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000

const { executeTrade, tradeExecuted } = SpotTileActions
type ExecutionAction = ReturnType<typeof executeTrade>

export type ExecutedTradeAction = ReturnType<typeof tradeExecuted>

const executeTradeEpic: ApplicationEpic = (action$, state$, { loadBalancedServiceStub, openFin }) => {
  const executionService = new ExecutionService(loadBalancedServiceStub, openFin.checkLimit.bind(openFin))

  return action$.pipe(
    ofType<Action, ExecutionAction>(ACTION_TYPES.EXECUTE_TRADE),
    mergeMap((request: ExecutionAction) =>
      executionService
        .executeTrade(request.payload)
        .pipe(map((result: ExecuteTradeResponse) => tradeExecuted(result, request.meta)))
    )
  )
}

type ReferenceDataAction = ReturnType<typeof ReferenceActions.createReferenceServiceAction>

const addSpotTileEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, ReferenceDataAction>(REFERENCE_ACTION_TYPES.REFERENCE_SERVICE),
    mergeMap(refData => {
      const symbols = Object.keys(refData.payload).map(symbol => SpotTileActions.showSpotTile(symbol))
      return of(...symbols)
    })
  )

export const onTradeExecuted: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(ACTION_TYPES.TRADE_EXECUTED),
    delay(DISMISS_NOTIFICATION_AFTER_X_IN_MS),
    map((action: ExecutedTradeAction) => action.payload.request.CurrencyPair),
    map(SpotTileActions.dismissNotification)
  )

export const spotTileEpic = combineEpics(executeTradeEpic, onTradeExecuted, addSpotTileEpic)
