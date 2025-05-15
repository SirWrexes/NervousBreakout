---@diagnostic disable: duplicate-set-field

local Object = require "lib.Object"
local inspect = require "lib.inspect"

---@class Vector2.Partial
---@field x number?
---@field y number?

---@class Vector2
---@overload fun(): self Default constructor

---@class Vector2
---@overload fun(value: Vector2.Partial): self Parameterised constructor

---@class Vector2
---@overload fun(value: self): self Copy constructor

---@class Vector2: ExtendableObject
local Vector2 = Object:extend()

function Vector2:__tostring()
    return string.format("(%.2f, %.2f)", self.x, self.y)
end

---@param value unknown
---@param checkNils? boolean Default: `true`
---@return self? value Input `value` cast as [`Vector2`](lua://Vector2) when `isVector2 == true`
function Vector2.validate(value, checkNils)
    if checkNils == nil then checkNils = true end
    if type(value) ~= "table" then return end
    if (value.x or checkNils) and type(value.x) ~= "number" then return end
    if (value.y or checkNils) and type(value.y) ~= "number" then return end
    return value
end

local function INIT_ERROR(v)
    return "Invalid Vector2 value: "
        .. inspect(v, {
            depth = 1,
            indent = " ",
            newline = " ",
        })
end

---@private
---@param x number
---@param y number
function Vector2:init(x, y)
    if y == nil and type(x) == "table" then
        local init = assert(Vector2.validate(x, false), INIT_ERROR(x))
        self.x = init.x or 0
        self.y = init.y or 0
    else
        self.x = x and x or 0
        self.y = y and y or 0
        assert(self:validate(), INIT_ERROR(self:toTable()))
    end
end

---@param value Vector2.Partial
function Vector2:set(value) end

---@param value Vector2
function Vector2:set(value) end

---@param x number
---@param y number
function Vector2:set(x, y)
    self:init(x, y)
    return self
end

---Apply a function to the vector so that `V -> { fn(x), f(y) }`
---@param fn fun(n: number): number
function Vector2:apply(fn)
    self.x = fn(self.x)
    self.y = fn(self.y)
    return self
end

function Vector2:toTable()
    return { x = self.x, y = self.y }
end

---@return number x
---@return number y
function Vector2:unpack()
    return self.x, self.y
end

return Vector2
