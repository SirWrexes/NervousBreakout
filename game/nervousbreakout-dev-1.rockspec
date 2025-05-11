---@diagnostic disable: lowercase-global

package = "NervousBreakout"
version = "dev-1"
source = {
    url = "git+ssh://git@github.com/SirWrexes/NervousBreakout.git",
}
description = {
    homepage = "*** please enter a project homepage ***",
    license = "*** please specify a license ***",
}
dependencies = {
    "lua ~> 5.1",
}
build = {
    type = "builtin",
    modules = {
        Ball = "src\\Ball.lua",
        Context = "src\\Context.lua",
        HardwareInput = "src\\HardwareInput.lua",
        Paddle = "src\\Paddle.lua",
        debug = "src\\debug.lua",
    },
}
