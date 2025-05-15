describe("Util", function()
    describe("colours", function()
        describe("randomRgb", function()
            it(
                "uses the math library", -- Can't really test for using `love.math` but it's virtually the same
                function()
                    local random = spy.on(math, "random")
                    local r, g, b = colours.randomRgb()

                    assert.spy(random).was.called(3)
                    assert.spy(random).was.called_with(0, 255)
                    assert.is.True(math.inrange(r, 0, 255))
                    assert.is.True(math.inrange(g, 0, 255))
                    assert.is.True(math.inrange(b, 0, 255))
                end
            )

            it("uses a custom generator", function()
                local gen = {
                    random = function()
                        return math.random(0, 255)
                    end,
                }
                local random = spy.on(gen, "random")
                local r, g, b = colours.randomRgb(gen.random)

                assert.spy(random).was.called(3)
                assert.is.True(math.inrange(r, 0, 255))
                assert.is.True(math.inrange(g, 0, 255))
                assert.is.True(math.inrange(b, 0, 255))
            end)
        end)
    end)
end)
