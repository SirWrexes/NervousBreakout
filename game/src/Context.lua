local Vector2 = require "lib.Vector2"
local object = require "lib.Object"

local HardwareInput = require "src.HardwareInput"

---@class Game.Context
---@overload fun(dt: number): self

---@class Game.Context : ExtendableObject
local Context = object:extend()

function Context:init()
    ---@class GameEntities
    self.entities = {
        ---@type Paddle
        paddle = nil,

        ---@type Ball[]
        balls = {},

        ---@type Brick[]
        bricks = {},
    }

    self.mouse = HardwareInput.Mouse(2)
    self.keyboard = {
        q = HardwareInput.Keyboard "q",
        space = HardwareInput.Keyboard "space",
    }

    self.window = {
        size = Vector2(love.graphics.getDimensions()),
    }

    self.deltaTime = 0
end

---@param deltaTime number
function Context:update(deltaTime)
    self.mouse:update()
    for _, key in pairs(self.keyboard) do
        key:update()
    end
    self.deltaTime = deltaTime
end

return Context
