import { ActionCreatorsMapObject } from 'redux'
import { action, ActionUnion } from './ActionHelper'
import { RequireAtLeastOne, RequireOnlyOne } from './utilityTypes'
export { action }
export type ActionUnion<A extends ActionCreatorsMapObject> = ActionUnion<A>
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = RequireAtLeastOne<T, Keys>
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = RequireOnlyOne<T, Keys>
