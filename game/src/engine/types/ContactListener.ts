import type { World } from 'love.physics'

type setCallbacks = World['setCallbacks']

export type BeginContact = Parameters<setCallbacks>[0]
export type EndContact = Parameters<setCallbacks>[1]
export type PreSolve = Parameters<setCallbacks>[2]
export type PostSolve = Parameters<setCallbacks>[3]

export interface ContactListener {
  beginContact?: BeginContact
  endContact?: EndContact
  preSolve?: PreSolve
  postSolve?: PostSolve
}
