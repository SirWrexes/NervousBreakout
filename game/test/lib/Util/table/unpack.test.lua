describe("Util", function()
    describe("table", function()
        describe("pack", function()
            it("works", function()
                local packed = { 1, 2, 3 }
                local a, b, c = table.unpack(packed)

                assert.are.equal(1, a)
                assert.are.equal(2, b)
                assert.are.equal(2, c)
            end)
        end)
    end)
end)
