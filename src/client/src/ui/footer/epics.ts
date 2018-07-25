import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { FOOTER_ACTION_TYPES, FooterActions } from './actions'

const { openLink } = FooterActions
type OpenLinkAction = ReturnType<typeof openLink>

export const linkEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, OpenLinkAction>(FOOTER_ACTION_TYPES.OPEN_LINK),
    tap(link => window.open(link.payload, '_blank')),
    ignoreElements()
  )
