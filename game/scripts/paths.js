const { join, resolve, dirname } = require('path')

const root = resolve(dirname(__dirname))
const path = (...segments) => resolve(join(root, ...segments))

module.exports = {
  root,
  path
}
