local Context = require "src.Context"
local Paddle = require "src.Paddle"

local ctx

function love.load()
    ctx = Context()
    ctx:update(0)
    ctx.entities.paddle = Paddle(ctx)
end

function love.update(deltaTime)
    ctx:update(deltaTime)
    ctx.entities.paddle:update(ctx)
end

function love.draw()
    ctx.entities.paddle:draw(ctx)
end
