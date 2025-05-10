---Basic no-op. Prevents injecting stuff into the table.
local __newindex = function() end

---Any non-nil value will do. This just makes it more explicit.
local __metatable = "locked"

return function(table)
    return setmetatable(table, {
        __index = table,
        __newindex = __newindex,
        __metatable = __metatable,
    })
end
