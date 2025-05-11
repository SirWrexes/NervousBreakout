---@generic T, V
---@param table T[]
---@param initial? V
---@param fn fun(prev: V, next: T): V
---@return V
function table.reduce(table, fn, initial)
    local n = #table
    local r = initial
    local i = 1

    if initial == nil then
        if n == 0 then
            error("Call to `table.reduce` with an empty table and no initial value.", 2)
        end
        r = table[1]
        i = 2
    end
    for i = i, n, 1 do
        r = fn(r, table[i])
    end

    return r
end
