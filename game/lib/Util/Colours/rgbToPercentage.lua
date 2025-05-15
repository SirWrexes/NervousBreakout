---@param ... integer Colour values between 0 and 255. A non integer or out of range value will produce undefined behaviour.
function colours.rgbToPercentage(...)
    ---@type number[]
    local colours = { ... }

    for i, value in ipairs(colours) do
        colours[i] = value * 100 / 255 / 100
    end

    return unpack(colours)
end
