local Object = require "lib.Object"
local Vector2 = require "lib.Vector2"

local DEFAULTS = {}

DEFAULTS.radius = 3
DEFAULTS.colour = { colours.hexToRgb "#f08000" }
DEFAULTS.shader = [[
    extern vec4 colour;

    vec4 effect(vec4 basecolour, Image texture, vec2 texpos, vec2 pixpos) {
        return colour;
    }
]]

---@class Ball: ExtendableObject
local Ball = Object:extend()

---@param ctx Game.Context
---@param state? Ball.State
function Ball:init(ctx, state)
    local paddle = ctx.entities.paddle

    self.state = state
        ---@class Ball.State
        or {
            active = true,
            angle = 0.0, ---Angle  to mouse
            speed = 500, ---Max speed
            velocity = 0.0, ---Current speed
            position = Vector2 {
                x = paddle.state.centre.x,
                y = paddle.state.position.y,
            },
            centre = nil, ---@type Vector2
            radius = DEFAULTS.radius, ---@type number
            diameter = DEFAULTS.radius * 2,
            shader = love.graphics.newShader(DEFAULTS.shader),
            thrown = false,
        }

    self.state.centre = self.state.position
end

---@param ctx Game.Context
function Ball:destroy(ctx)
    ---TODO: Hurt the player or something

    self.state.active = false
end

---@param ctx Game.Context
function Ball:updateStandby(ctx)
    self.state.position.x = ctx.entities.paddle.state.centre.x
    self.state.position.y = ctx.entities.paddle.state.position.y - self.state.diameter

    local x, y = ctx.mouse:getPosition()
    self.state.angle = math.atan2(self.state.centre.y - y, self.state.centre.x - x)
end

---Check if the object has collided with window bounds
---@param ctx Game.Context
---@return boolean left
---@return boolean right
---@return boolean up
---@return boolean down
---@return boolean horizontal
---@return boolean vertical
---@return boolean any
function Ball:checkWindowCollision(ctx)
    local l = self.state.centre.x - self.state.radius <= ctx.window.size.x
    local r = self.state.centre.x + self.state.radius >= ctx.window.size.x
    local u = self.state.centre.y - self.state.radius <= ctx.window.size.y
    local d = self.state.centre.y + self.state.radius >= ctx.window.size.y
    local h = l or r
    local v = u or d
    local a = h or v
    return l, r, u, d, h, v, a
end

---@param ctx Game.Context
function Ball:updateThrown(ctx)
    local cos, sin = math.cossin(self.state.angle)

    local l, r, u, d, h, v, a = self:checkWindowCollision(ctx)
    if a then
        ---Ball is lost
        if d then self:destroy(ctx) end
        if h then
            self.state.position.x = l and 0 or ctx.window.size.x - self.state.diameter
            cos = cos * -1
        end
        if v then
            self.state.position.y = u and 0 or ctx.window.size.y - self.state.diameter
            sin = sin * -1
        end
    end
end

---@param ctx Game.Context
function Ball:update(ctx)
    if ctx.mouse:getState(1) == "pressed" then self.state.thrown = true end

    if not self.state.thrown then
        self:updateStandby(ctx)
    else
        self:updateThrown(ctx)
    end
end

---@param ctx Game.Context
function Ball:draw(ctx)
    love.graphics.circle("fill", self.state.position.x, self.state.position.y, self.state.diameter)

    if not self.state.thrown then
        -- maybe use particles
        love.graphics.line(
            self.state.centre.x,
            self.state.centre.y,
            ctx.mouse.position.x,
            ctx.mouse.position.y
        )
    end
end

return Ball
