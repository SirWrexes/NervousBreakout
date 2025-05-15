table.unpack = table.unpack or unpack
table.pack = table.pack or function(...)
    return { ... }
end

require "lib.Util.table.has"
require "lib.Util.table.reduce"
