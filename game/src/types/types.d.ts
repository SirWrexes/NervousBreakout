declare class Vector2 extends Extenstions.Vector2 {}

namespace Vector2 {
  export interface Base {
    x: number
    y: number
  }

  export type Unpacked = [x: number, y: number]
  export type LuaUnpacked = LuaMultiReturn<Vector2.Unpacked>
}
