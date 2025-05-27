

import type { Action } from '../types/actions'

export function isAction(action: unknown): action is Action
export function isAction<Type extends string>(
  action: unknown,
  type: Type
): action is Action<Type>

export function isAction<Type extends string = string>(
  action: unknown,
  type?: Type
): action is Action<Type> {
  return (
    is('table', action)
    && 'type' in action
    && is('string', action.type)
    && (!type || action.type === type)
  )
}
