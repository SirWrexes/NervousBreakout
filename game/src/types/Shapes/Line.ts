export class Line {
  origin: Vector2
  target: Vector2
  vector: Vector2

  constructor(xyOrigin: number, xyTarget: number)
  constructor(
    xOrigin: number,
    yOrigin: number,
    xTraget: number,
    yTarget: number
  )
  constructor(ox: number, oy: number, tx?: number, ty?: number) {
    if (tx === undefined || ty === undefined) {
      tx = oy
      ty = oy
      oy = tx
    }
    this.origin = new Vector2(ox, oy)
    this.target = new Vector2(tx, ty)
    this.vector = new Vector2(ox - tx, oy - ty)
  }
}
