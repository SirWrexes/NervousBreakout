local Vector2 = require "lib.Vector2"
local object = require "lib.Object"

---@class Game.Context
---@overload fun(dt: number): self

---@class Game.Context : ExtendableObject
local Context = object:extend()

function Context:init()
    ---@class GameEntities
    ---@field paddle Paddle
    ---@field balls  Ball[]
    ---@field bricks Brick[]
    self.entities = {}

    self.mouse = {
        position = Vector2(),
    }

    self.window = {
        size = Vector2(love.graphics.getDimensions()),
    }

    self.deltaTime = 0
end

---@param deltaTime number
function Context:update(deltaTime)
    self.mouse.position:set(love.mouse.getPosition())
    self.deltaTime = deltaTime
end

return Context
