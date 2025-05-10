--
-- Project: lua-object
-- objects for Lua
-- Edited by Sir Wrexes
-- Original source: https://github.com/nusov/lua-object/blob/master/src/lua-object/object.lua
--
-- Copyright 2015 Alexander Nusov. Licensed under the MIT License.
-- See @license text at http://www.opensource.org/licenses/mit-license.php
--
--

local inspect = require "lib.inspect"

---@class ExtendableObject
---@field private __index      self
---@field private __instanceof self
---@field private __call       fun(...) : self
local Object = {}

---@private
function Object:__makeinstance()
    local base = { __instanceof = self }
    local instance = setmetatable(base, self)

    self.__index = self
    self.__call = function(self, ...)
        return self:new(...)
    end

    return instance
end

function Object:init(...) end

function Object:new(...)
    local o = self:__makeinstance()
    o:init(...)
    return o
end

function Object:extend(...)
    local cls = self:__makeinstance()
    cls.init = function() end

    for _, f in pairs { ... } do
        f(cls, self)
    end

    return cls
end

---@protected
---@param var unknown
function Object.couldBeObject(var)
    return var ~= nil and type(var) == "table"
end

---@param instance unknown
---@param class ExtendableObject
function Object.isTypeof(instance, class)
    return Object.couldBeObject(instance) and (instance.__instanceof == class)
end

---@param instance unknown
---@param class ExtendableObject
function Object.isInstanceof(instance, class)
    return Object.couldBeObject(instance)
        and (instance.__instanceof == class or Object.isInstanceof(instance.__instanceof, class))
end

Object.inspect = inspect

return Object
