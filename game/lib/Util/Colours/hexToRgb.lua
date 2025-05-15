---@param hex string Colour in hexadecimal format
---@return integer red
---@return integer green
---@return integer blue
---@return integer alpha
---@nodiscard
function colours.hexToRgb(hex)
    local type = type(hex)
    if type ~= "string" then error(("Invalid value. Expected string, got %s."):format(type)) end

    local _hex = hex
    hex = hex:gsub("^#", ""):match "^%x+$"
    if not hex then error(("Invalid hexadecimal sequence: `%s`."):format(tostring(_hex))) end

    local red
    local green
    local blue
    local alpha

    local len = #hex
    if len == 8 or len == 6 then
        goto SEQUENCE_IS_COMPLETE
    elseif len == 3 then
        red = hex:sub(1, 1):rep(2)
        green = hex:sub(2, 2):rep(2)
        blue = hex:sub(3, 3):rep(2)
        hex = ("%s%s%s"):format(red, green, blue)
    elseif len == 2 then
        hex = hex:rep(3)
    else
        error(
            ("Hexadeximal colour string should be 2, 3, 6 or 8 characters long\nGot %d (`%s`)."):format(
                len,
                _hex
            )
        )
    end

    ::SEQUENCE_IS_COMPLETE::
    if len < 8 then hex = hex .. "ff" end
    red = tonumber(hex:sub(1, 2), 16)
    green = tonumber(hex:sub(3, 4), 16)
    blue = tonumber(hex:sub(5, 6), 16)
    alpha = tonumber(hex:sub(7, 8), 16)

    return red, green, blue, alpha
end
