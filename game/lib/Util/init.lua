---When calliing `getmetatable`, the `__metatable` will be returned.
---Setting it to `false` is convenient as it will behave as if no metatable
---has been returned in case of simple tests such as `if not mt then return end`
local __metatable = false

---@generic Table: table
---@param table Table
---@param mt?   metatable
---@diagnostic disable-next-line: lowercase-global
function lockmetatable(table, mt)
    local old = getmetatable(table)
    local type = type(old)

    if type == "table" and old.__metatable == nil then old.__metatable = __metatable end
    if old ~= nil then return table end

    mt = mt or old or {}
    mt.__index = mt.__index or table
    mt.__metatable = mt.__metatable or __metatable

    return setmetatable(table, mt)
end

require "lib.Util.table"
require "lib.Util.math"
require "lib.Util.colours"
