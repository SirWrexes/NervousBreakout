---@diagnostic disable: duplicate-set-field

local Vector2 = require "lib.Vector2"
local inspect = require "lib.inspect"

---@class Vector3.Partial
---@field x number?
---@field y number?
---@field z number?

---@class Vector3
---@overload fun(): self Default constructor

---@class Vector3
---@overload fun(value: Vector3.Partial): self Parameterised constructor

---@class Vector3
---@overload fun(value: self): self Copy constructor

---@class Vector3: Vector2
local Vector3 = Vector2:extend()

function Vector3:__tostring()
    return string.format("(%.2f, %.2f, %.2f)", self.x, self.y, self.z)
end

---@param value unknown
---@param checkNils? boolean Default: `true`
---@return self? value Input `value` cast as [`Vector3`](lua://Vector3) when `isVector3 == true`
function Vector3.validate(value, checkNils)
    if checkNils == nil then checkNils = true end
    if type(value) ~= "table" then return end
    if (value.x or checkNils) and type(value.x) ~= "number" then return end
    if (value.y or checkNils) and type(value.y) ~= "number" then return end
    if (value.z or checkNils) and type(value.z) ~= "number" then return end
    return value
end

local function INIT_ERROR(v)
    return "Invalid Vector3 value: "
        .. inspect(v, {
            depth = 1,
            indent = " ",
            newline = " ",
        })
end

---@private
---@param x number
---@param y number
---@param z number
function Vector3:init(x, y, z)
    if y == nil and z == nil and type(x) == "table" then
        local init = assert(Vector3.validate(x, false), INIT_ERROR(x))
        self.x = init.x or 0
        self.y = init.y or 0
        self.z = init.z or 0
    else
        self.x = x and x or 0
        self.y = y and y or 0
        self.z = z and z or 0
        assert(self:validate(), INIT_ERROR(self:toTable()))
    end
end

---@param value Vector3.Partial
function Vector3:set(value) end

---@param value Vector3
function Vector3:set(value) end

---@param x number
---@param y number
---@param z number
function Vector3:set(x, y, z)
    self:init(x, y, z)
end

function Vector3:toTable()
    return { x = self.x, y = self.y, z = self.z }
end

---@return number x
---@return number y
---@return number z
function Vector3:unpack()
    return self.x, self.y, self.z
end

return Vector3
