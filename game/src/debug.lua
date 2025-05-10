DEBUG = false

if os.getenv "LOCAL_LUA_DEBUGGER_VSCODE" == "1" then
    for _, v in ipairs(arg) do
        if v == "-debug" then
            DEBUG = true
            break
        end
    end

    if DEBUG then
        local lldebugger = require "lldebugger"

        function love.errorhandler(msg)
            error(msg, 2)
        end

        lldebugger.start()
    end
end
