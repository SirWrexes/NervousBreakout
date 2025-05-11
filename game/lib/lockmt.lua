---Basic no-op. Prevents injecting stuff into the table.
local __newindex = function() end

---Any non-nil value will do. This just makes it more explicit.
local __metatable = "locked"

---@generic Table: table
---@param table Table
---@param mt?   metatable
---@diagnostic disable-next-line: lowercase-global
function lockmetatable(table, mt)
    mt = mt or {}

    mt.__index = mt.__index or table
    mt.__metatable = mt.__metatable or __metatable
    mt.__newindex = mt.__newindex or __newindex

    return setmetatable(table, mt)
end

return lockmetatable
