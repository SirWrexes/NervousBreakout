__DEBUG = false
__DEV = false

if os.getenv "LOCAL_LUA_DEBUGGER_VSCODE" == "1" then
    for _, v in ipairs(arg) do
        if v == "-debug" then
            __DEBUG = true
        elseif v == "-dev" then
            __DEV = true
        end
    end

    if __DEBUG then
        local lldebugger = require "lldebugger"

        function love.errorhandler(msg)
            error(msg, 2)
        end

        lldebugger.start()
    end
end
