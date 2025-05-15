---@diagnostic disable: invisible

local Object = require "lib.Object"

---@class Game.Object: ExtendableObject
---@field private STATE_KEY string
local GameObject = Object:extend(
    ---@param self Game.Object
    ---@param super ExtendableObject
    function(self, super)
        self.STATE_KEY = "__state"

        local oldmeta = getmetatable(self)
        local newmeta = {}

        for key, _ in pairs(oldmeta) do
            newmeta[key] = oldmeta[key]
        end

        function newmeta.__index(t, k)
            print("from " .. inspect(t))
            print("try get: " .. k)
            local v = rawget(t, k)

            if v == nil then
                print(("  |- Not in class definition, looked in [%s]"):format(self.STATE_KEY))
                t = rawget(t, self.STATE_KEY) or {}
                print(("  |  `- %s"):format(inspect(t)))
                v = t[k]
            end
            if v == nil then
                print "  |- Not in class definition, looked in superclass"
                v = super[k]
            end

            print("   `-> got " .. tostring(v) .. "\n")
            return v
        end

        setmetatable(self, newmeta)
    end
)

---@alias GameObject.StateInitialiser
---| table
---| fun(): table

---@param state? GameObject.StateInitialiser
---@param fallback? GameObject.StateInitialiser
function GameObject:initState(state, fallback)
    state = state or fallback
    state = type(state) == "function" and state() or state or {}
    print(("Initialised `GameObject` with state %s"):format(inspect(state)))
    self[self.STATE_KEY] = state
end

return GameObject
