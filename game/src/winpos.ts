import { is } from 'extensions/is'

const FILE = '__WINDOW_POSITION'

export const save = () =>
  love.filesystem.write(FILE, `return  ${inspect(love.window.getPosition())}`)

const validate = (
  winpos: unknown
): winpos is [x: number, y: number, display: number] =>
  is('array', winpos)
  && is('number', winpos[0])
  && is('number', winpos[1])
  && is('number', winpos[2])

export const load = () => {
  const [chunk, e] = love.filesystem.load(FILE)
  if (!chunk) return warning(e)

  const pos = chunk()
  if (!validate(pos)) return warning('Could not retrieve window position data')

  love.window.setPosition(pos[0], pos[1], pos[2])
}
