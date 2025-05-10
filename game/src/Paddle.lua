local Object = require "lib.Object"
local Util = require "lib.Util"
local Vector2 = require "lib.Vector2"

local DEFAULT_PADDLE_SIZE = {
    x = 120,
    y = 10,
}

local DEFAULT_ROUNDING_SEGMENTS = {
    x = DEFAULT_PADDLE_SIZE.x * 0.2,
    y = DEFAULT_PADDLE_SIZE.y * 0.2,
}

---@class Paddle: ExtendableObject
local Paddle = Object:extend()

---@param ctx Game.Context
---@param state? Paddle.State
function Paddle:init(ctx, state)
    self.state = state
        ---@class Paddle.State
        or {
            ---Angle  to mouse
            angle = 0.0,

            ---Max speed
            speed = 500,

            ---Current speed
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

    self.state.position.y = ctx.window.size.y - 2 * self.state.size.y
end

---Used for better readability.<br>
---If ever multiple paddles should interact with each other, this must not be used in the corresponding functions.<br>
---In theory, since update functions are executed sequentially, there should be no race condition.
---However, if asynchronicity or multithreading is ever introduced into the game logic, this pattern has to disappear first.
---@type Paddle.State
local state

local DEBUG = {}
DEBUG.colour = {}
DEBUG.colour.hex = "#ccc"
DEBUG.colour.rgb = { Util.Colours.hexToRgb(DEBUG.colour.hex) }
DEBUG.colour.per = { Util.Colours.rgbToPercentage(unpack(DEBUG.colour.rgb)) }
DEBUG.colour.alpha = 0.3
DEBUG.colour.vec4 = { unpack(DEBUG.colour.per) }
DEBUG.colour.vec4[#DEBUG.colour.vec4 + 1] = DEBUG.colour.alpha
DEBUG.shader = love.graphics.newShader [[
        extern vec4 colour;

        vec4 effect(vec4 _colour, Image texture, vec2 texture_pos, vec2 pixel_pos) {
            return colour;
        }
    ]]
DEBUG.shader:send("colour", DEBUG.colour.vec4)
DEBUG.data = {
    Angle = 0.0,
    Distance = 0.0,
    Velocity = 0.0,
}

---@param ctx Game.Context
function Paddle:update(ctx)
    state = self.state

    state.distance = math.abs(ctx.mouse.position.x - state.centre.x)
    if state.distance < 5 then
        state.velocity = 0
    elseif state.distance < state.size.x * 2 then
        state.velocity = math.min(state.speed, state.speed * (state.distance / 20))
    end

    state.angle = math.atan2(ctx.mouse.position.y - state.centre.y, ctx.mouse.position.x - state.centre.x)
    state.position.x = state.position.x + state.velocity * math.cos(state.angle) * ctx.deltaTime

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

    if __DEV and false then
        DEBUG.data.Angle = state.angle
        DEBUG.data.Distance = state.distance
        DEBUG.data.Velocity = state.velocity
        love.graphics.print({
            DEBUG.colour.vec4,
            inspect(DEBUG.data),
        }, state.position.x, state.position.y - 69)

        love.graphics.setShader(DEBUG.shader)
        love.graphics.line(state.centre.x, state.centre.y, ctx.mouse.position.x, state.centre.y)
        love.graphics.line(state.centre.x, state.centre.y, ctx.mouse.position.x, ctx.mouse.position.y)
        love.graphics.setShader()
    end

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
