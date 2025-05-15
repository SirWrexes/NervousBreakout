---Generate a random Red, Green, and Blue value for a colour
---@param generator? fun(): integer A function that returns a number between 0 and 255
---@return integer red
---@return integer green
---@return integer blue
---@nodiscard
function colours.randomRgb(generator)
    local r, g, b

    if generator then
        r = generator()
        g = generator()
        b = generator()
    else
        r = math.random(0, 255)
        g = math.random(0, 255)
        b = math.random(0, 255)
    end

    return r, g, b
end
