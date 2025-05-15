---@class Util.colours
colours = {}

require "lib.Util.colours.hexToRgb"
require "lib.Util.colours.randomRgb"
require "lib.Util.colours.rgbToPercentage"

lockmetatable(colours, { __newindex = noop })
