local GameObject = require "src.GameObject"
local Object = require "lib.Object"
local Vector2 = require "lib.Vector2"

local DEFAULT_PADDLE_SIZE = {
    x = 120,
    y = 10,
}

local DEFAULT_ROUNDING_SEGMENTS = {
    x = DEFAULT_PADDLE_SIZE.x * 0.2,
    y = DEFAULT_PADDLE_SIZE.y * 0.2,
}

---@class Paddle
---@overload fun(ctx: Game.Context, state?: Paddle.State): self

---@class Paddle: Game.Object, Paddle.State
local Paddle = GameObject:extend()

---@param ctx Game.Context
---@param state? Paddle.State
function Paddle:init(ctx, state)
    self:initState(state, function()
        ---@class Paddle.State
        local state = {
            ---Angle from centre to mouse
            ---@type number
            angle = 0.0,

            ---Max speed
            ---@type number
            speed = 500.0,

            ---Distance relative to mouse
            ---@type number
            distance = 0.0,

            ---Current speed
            ---@type number
            velocity = 0.0,

            ---Position of the sprite
            position = Vector2(),

            ---Center point of the sprite
            centre = Vector2(),

            ---Size of the sprite
            size = Vector2(DEFAULT_PADDLE_SIZE),

            ---Corner rounding values
            rounding = Vector2(DEFAULT_ROUNDING_SEGMENTS),
        }
        return state
    end)
    self.position.y = ctx.window.size.y - 2 * self.size.y
end

---Used for better readability.<br>
---If ever multiple paddles should interact with each other, this must not be used in the corresponding functions.<br>
---In theory, since update functions are executed sequentially, there should be no race condition.
---However, if asynchronicity or multithreading is ever introduced into the game logic, this pattern has to disappear first.
---@type Paddle.State
local state

---@param ctx Game.Context
function Paddle:update(ctx)
    if ctx.keyboard.space:getState() == "down" then
        -- print(function()
        --     return ("\n"):rep(50) .. "<Space> held -> Paddle stopped"
        -- end)
        return
    elseif ctx.keyboard.space:getState() == "pressed" then
        -- print(function()
        --     return ("\n"):rep(50)
        -- end)
    end

    local xMouse, yMouse = ctx.mouse:getPosition()
    state = self.state

    state.distance = math.abs(xMouse - state.centre.x)
    if state.distance < 5 then
        state.velocity = 0
    elseif state.distance < state.size.x * 2 then
        state.velocity = math.min(state.speed, state.speed * (state.distance / 20))
    end

    state.angle = math.atan2(yMouse - state.centre.y, xMouse - state.centre.x)
    state.position.x = state.position.x + state.velocity * math.cos(state.angle) * ctx.deltaTime
    state.position.x = math.floor(state.position.x)

    if state.position.x < 0 then
        state.position.x = 0
    elseif state.position.x + state.size.x > ctx.window.size.x then
        state.position.x = ctx.window.size.x - state.size.x
    end

    state.centre.x = state.position.x + state.size.x / 2
    state.centre.y = state.position.y + state.size.y / 2
end

---@param ctx Game.Context
function Paddle:draw(ctx)
    state = self.state

    love.graphics.rectangle(
        "fill",
        state.position.x,
        state.position.y,
        state.size.x,
        state.size.y,
        state.rounding.x,
        state.rounding.y
    )
end

return Paddle
