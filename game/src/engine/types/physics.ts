import type { Body, Fixture, Shape } from 'love.physics'

export interface Physic {
  body: Body
  shape: Shape
  fixture: Fixture
}
