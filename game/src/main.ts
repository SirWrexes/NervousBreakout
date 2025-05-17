love.load = () => {}

love.update = () => {}

love.draw = () => {
  const [width, height] = love.graphics.getDimensions()
  love.graphics.print('Hello world!', width / 2 - 45, height / 2)
}
