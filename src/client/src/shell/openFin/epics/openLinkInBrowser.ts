import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { FOOTER_ACTION_TYPES, FooterActions } from '../../../ui/footer'

const { openLink } = FooterActions
type OpenLinkAction = ReturnType<typeof openLink>

export const openLinkWithOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, OpenLinkAction>(FOOTER_ACTION_TYPES.OPEN_LINK),
    tap(link => openFin.openLink(link.payload)),
    ignoreElements()
  )
