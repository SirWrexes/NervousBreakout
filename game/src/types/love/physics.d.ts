declare module 'love.physics' {
  interface Body {
    getWorldPoints<XY extends number[] = number[]>(
      ...xys: XY
    ): LuaMultiReturn<XY>
  }
}
