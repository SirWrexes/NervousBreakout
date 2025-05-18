import { join, resolve, dirname } from 'path'

export const root = resolve(dirname(import.meta.dirname))
export const path = (...segments) => resolve(join(root, ...segments))

export default {
  root,
  path
}
