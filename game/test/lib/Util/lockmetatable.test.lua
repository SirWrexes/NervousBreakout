describe("Util", function()
    describe("lockmetatable", function()
        it("creates a new metatable", function()
            local table = {}
            local out = lockmetatable(table)

            assert.is.False(getmetatable(table))
            assert.are.equal(table, out)
            assert.does.error(function()
                setmetatable(table, {})
            end)
        end)

        it("bails on already locked metatable", function()
            local meta = {} ---@type metatable
            local table = {}
            local out

            meta.__metatable = "sauce"
            meta.__index = table
            setmetatable(table, meta)
            out = lockmetatable(table)

            assert.are.equal(meta.__metatable, getmetatable(table))
            assert.are.equal(table, out)
            assert.does.error(function()
                setmetatable(table, { __index = table })
            end)
        end)

        it("locks existing metatable", function()
            local table = {}
            local meta = {} ---@type metatable
            local out

            meta.__index = table
            setmetatable(table, meta)
            out = lockmetatable(table)

            assert.is.False(meta.__metatable)
            assert.are.equal(meta.__metatable, getmetatable(table))
            assert.are.equal(table, out)
            assert.does.error(function()
                setmetatable(table, { __index = table })
            end)
        end)

        it("locks parameter metatables", function()
            local table = {}
            local meta = {} ---@type metatable
            local out

            meta.__index = table
            out = lockmetatable(table, meta)

            assert.are.equal(meta.__metatable, getmetatable(table))
            assert.is.False(meta.__metatable)
            assert.are.equal(table, out)
            assert.does.error(function()
                setmetatable(table, { __index = table })
            end)
        end)
    end)
end)
