local inspect = require "lib.inspect"

---@class Util.Colours
local Colours = {}

Colours.hexToRgb = require "lib.Util.Colours.hexToRgb"
Colours.randomRgb = require "lib.Util.Colours.randomRgb"
Colours.rgbToPercentage = require "lib.Util.Colours.rgbToPercentage"

require "lib.lockmt"(Colours)

return Colours
