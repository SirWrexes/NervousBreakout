/** @noSelfInfile */

import combineReducers from 'relux/combineReducers'
import { createStore } from 'relux/createStore'
import type { Action } from 'relux/types/actions'
import type { Merge, Simplify } from 'type-fest'

type PayloadAction<P, T extends string = string> = Merge<
  Action<T>,
  { payload: P }
>

type CounterAction =
  | Action<'increment'>
  | Action<'decrement'>
  | PayloadAction<number, 'add'>

type PrependType<A extends Action, P extends string> = Simplify<{
  [key in keyof A]: key extends 'type' ? `${P}/${A[key]}` : A[key]
}>

type RCounterAction = PrependType<CounterAction, 'right'>
type LCounterAction = PrependType<CounterAction, 'left'>

const reducer = combineReducers({
  left: (state: number, action: LCounterAction) => {
    switch (action.type) {
      case 'left/increment':
        return (state ?? 0) + 1
      case 'left/decrement':
        return (state ?? 0) - 1
      case 'left/add':
        return (state ?? 0) + action.payload
      default:
        return state ?? 0
    }
  },

  right: (state: number, action: RCounterAction) => {
    switch (action.type) {
      case 'right/increment':
        return (state ?? 0) + 1
      case 'right/decrement':
        return (state ?? 0) - 1
      case 'right/add':
        return (state ?? 0) + action.payload
      default:
        return state ?? 0
    }
  },

  delta: (state: number, action: PayloadAction<number, 'delta'>) => {
    switch (action.type) {
      case 'delta':
        return (state ?? 0) + action.payload
      default:
        return state ?? 0
    }
  },
})

const state = {} as RootState
print(inspect({ reducer, test: reducer(state, { type: 'left/increment' }) }))

const { getState, dispatch } = createStore(reducer)

export type RootState = ReturnType<typeof getState>

export { getState, dispatch }
