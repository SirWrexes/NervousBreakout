__DEBUG = os.getenv "LOCAL_LUA_DEBUGGER_VSCODE" == "1"
    and table.reduce(arg, function(prev, next)
        return prev or next == "-debug"
    end, false)

__DEV = table.reduce(arg, function(prev, next)
    return prev or next == "-dev"
end, false)

if __DEBUG then
    function love.errorhandler(msg)
        error(msg, 2)
    end
    require("lldebugger").start()
end
