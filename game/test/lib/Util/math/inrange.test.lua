describe("Util", function()
    describe("math", function()
        describe("inrange", function()
            local mul = 10
            local div = 2

            it("works with a < b", function()
                local low = 1
                local high = low * mul

                assert.is.True(math.inrange(low, low, high))
                assert.is.True(math.inrange(high, low, high))
                assert.is.True(math.inrange(high / div, low, high))
                assert.is.False(math.inrange(high * mul, low, high))
            end)

            it("works with a > b", function()
                local low = 1
                local high = low * mul

                assert.is.True(math.inrange(high, high, low))
                assert.is.True(math.inrange(low, high, low))
                assert.is.True(math.inrange(low, high, low))
                assert.is.False(math.inrange(high * mul, high, low))
            end)

            it("works with a == b", function()
                local low = 10
                local high = low

                assert.is.True(math.inrange(low, low, high))
                assert.is.True(math.inrange(high, low, high))
                assert.is.False(math.inrange(high * mul, low, high))
            end)
        end)
    end)
end)
