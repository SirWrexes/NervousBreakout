describe("Util", function()
    describe("math", function()
        describe("inbounds", function()
            local low = 1
            local high = 10

            it("works with a < b", function()
                assert.is.True(math.inbounds(5, low, high))
                assert.is.False(math.inbounds(low, low, high))
                assert.is.False(math.inbounds(high, low, high))
            end)

            it("works with a > b", function()
                assert.is.True(math.inbounds(5, high, low))
                assert.is.False(math.inbounds(low, high, low))
                assert.is.False(math.inbounds(high, high, low))
            end)

            it("works with a == b", function()
                local high = low
                assert.is.False(math.inbounds(low, low, high))
                assert.is.False(math.inbounds(high, low, high))
            end)
        end)
    end)
end)
