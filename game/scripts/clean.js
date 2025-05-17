const { rm: _rm, mkdir } = require('fs/promises')
const { path } = require('./paths')

const rm = async (...segments) => {
  const target = path(...segments)
  return _rm(target, { recursive: true, force: true }).then(() => {
    console.log(`Removed ${target}`)
    return target
  })
}

rm('lua')
rm('..', 'builds').then(path => mkdir(path))
