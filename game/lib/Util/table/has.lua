---@class Util.table.has
local has = {}

---@class tablelib
---@field has Util.table.has

---@class Util.table.has
---@overload fun(value: any, table: any[], cmp?: fun(value, any): boolean): boolean

---Check that all elements of a table match a given value.<br>
---Will use `==` for equality unless a comparison function is provided.
---@generic T
---@param value T
---@param table any[]
---@param cmp? fun(value: T, element: any): boolean
---@return boolean
function has.all(value, table, cmp)
    if type(cmp) ~= "function" then
        function cmp(v, e)
            return v == e
        end
    end

    for _, element in ipairs(table) do
        if not cmp(value, element) then return false end
    end

    return true
end

---Check that at least one element of a table matches a given value.<br>
---Will use `==` for equality unless a comparison function is provided.
---@generic T
---@param value T
---@param table any[]
---@param cmp? fun(value: T, element: any): boolean
---@return boolean
function has.some(value, table, cmp)
    if type(cmp) ~= "function" then
        function cmp(v, e)
            return v == e
        end
    end

    for _, element in ipairs(table) do
        if cmp(value, element) then return true end
    end

    return false
end

---Check that no element of a table matches a given value.<br>
---Will use `==` for equality unless a comparison function is provided.
---@generic T
---@param value T
---@param table any[]
---@param cmp? fun(value: T, element: any): boolean
---@return boolean
function has.none(value, table, cmp)
    return not has.some(value, table, cmp)
end

setmetatable(has, {
    __index = has,
    __call = has.some,
})

table.has = has
