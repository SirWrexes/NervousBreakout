local random = (love and love.math or math).random

---Generate a random Red, Green, and Blue value for a colour
---@param generator? fun(): integer Defaults to calling `love.math.random(0,255)`<br>A function that generates a value for red, green, blue.
---@return integer red
---@return integer green
---@return integer blue
return function(generator)
    local rgb = {}

    if type(generator) ~= "function" then
        for i = 1, 3, 1 do
            rgb[i] = random(0, 255)
        end
    else
        for i = 1, 3, 1 do
            rgb[i] = generator()
        end
    end

    return rgb[1], rgb[2], rgb[3]
end
