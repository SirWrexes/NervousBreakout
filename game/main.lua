local Ball = require "src.Ball"
local Context = require "src.Context"
local Paddle = require "src.Paddle"

---@type Game.Context
local ctx

local canAddBall = false

function love.load()
    ctx = Context()
    ctx.entities.paddle = Paddle(ctx)
    ctx.entities.balls[1] = Ball(ctx)
end

function love.update(deltaTime)
    ctx:update(deltaTime)
    if ctx.keyboard.q:getState() == "down" then love.event.quit(0) end

    ctx.entities.paddle:update(ctx)
    canAddBall = table.reduce(ctx.entities.balls, function(canAddBall, ball)
        if not ball.state.active then return canAddBall end
        ball:update(ctx)
        return canAddBall and ball.state.thrown
    end, true)

    if canAddBall and ctx.mouse:getState(2) == "pressed" then
        for _, ball in ipairs(ctx.entities.balls) do
            if not ball.state.active then
                ball:init(ctx)
                goto BALL_ADDED
            end
        end
        ctx.entities.balls[#ctx.entities.balls+1] = Ball(ctx)
        ::BALL_ADDED::
    end
end

function love.draw()
    ctx.entities.paddle:draw(ctx)
    for _, ball in ipairs(ctx.entities.balls) do
        if ball.state.active then ball:draw(ctx) end
    end
end
