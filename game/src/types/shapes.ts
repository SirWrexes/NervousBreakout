import type { Vector2 } from 'types/Vector'

export interface Rectangle {
  origin: Vector2
  centre: Vector2
  width: number
  height: number
}

export interface Circle {
  origin: Vector2
  centre: Vector2
  radius: number
}
