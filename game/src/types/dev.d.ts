import type { PartialDeep } from 'type-fest'
import type { Nullable } from './util'

declare global {
  declare interface DebugInfo {}

  declare const __DEV: boolean
  declare const __DEBUG: Nullable<
    DebugInfo & { [__DPart]: PartialDeep<DebugInfo> }
  >
  declare const __DPart: unique symbol
}
