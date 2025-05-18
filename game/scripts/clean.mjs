import { rm as _rm, mkdir } from 'fs/promises'
import { path } from './paths.mjs'

const rm = async (...segments) => {
  const target = path(...segments)
  return _rm(target, { recursive: true, force: true }).then(() => {
    console.log(`Removed ${target}`)
    return target
  })
}

rm('lua')
rm('..', 'builds').then(path => mkdir(path))
