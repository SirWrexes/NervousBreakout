---Returns both the cosine and sinus of `x` (assumed to be in radians)
---@param x number
---@return number cos
---@return number sin
function math.cossin(x)
    return math.cos(x), math.sin(x)
end

---Return the closest integral value larger, smaller, or equal to `x`
---@param x number
function math.round(x)
    if (x % 1 * 10) < 5 then return math.floor(x) end
    return math.ceil(x)
end

---Check that a given number `x` is in the range defined by bounds `a` and `b` (inclusive).<br>
---Order of the bounds parameters doesn't matter when calling this function.
---@param x number
---@param a number
---@param b number
function math.inrange(x, a, b)
    return x <= math.max(a, b) and x >= math.min(a, b)
end

---Check that a given number `x` is in the range defined by bounds `a` and `b` (exclusive).<br>
---Order of the bounds parameters doesn't matter when calling this function.
---@param x number
---@param a number
---@param b number
function math.inbounds(x, a, b)
    if a == b then return false end
    return x < math.max(a, b) and x > math.min(a, b)
end
