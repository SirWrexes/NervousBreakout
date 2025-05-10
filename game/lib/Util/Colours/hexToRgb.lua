local DIGIT = "%x"
local HEX6 = DIGIT:rep(6)
local HEX3 = DIGIT:rep(3)
local HEX2 = DIGIT:rep(2)

---@param hex string Colour in hexadecimal format
---@return integer red
---@return integer green
---@return integer blue
return function(hex)
    local type = type(hex)
    assert(type == "string", ("Invalid value. Expected string, got %s."):format(type))

    local red
    local green
    local blue
    hex = hex:gsub("^#", "")

    if hex:match(HEX6) then
        goto STRING_IS_HEX6
    elseif hex:match(HEX3) then
        red = hex:sub(1, 1):rep(2)
        green = hex:sub(2, 2):rep(2)
        blue = hex:sub(3, 3):rep(2)
        hex = ("%s%s%s"):format(red, green, blue)
    elseif hex:match(HEX2) then
        hex = hex:rep(3)
    else
        error(([[Invalid hex colour string: "%s".]]):format(hex))
    end

    ::STRING_IS_HEX6::
    red = tonumber(hex:sub(1, 2), 16)
    green = tonumber(hex:sub(3, 4), 16)
    blue = tonumber(hex:sub(5, 6), 16)

    return red, green, blue
end
