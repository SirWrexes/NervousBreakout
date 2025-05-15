describe("Util", function()
    describe("math", function()
        describe("cossin", function()
            it("is consistent with math.cos() and math.sin()", function()
                local sign = ({
                    [1] = -1,
                    [2] = 1,
                })[math.random(2)]
                local x = math.random() * sign

                assert.same({ math.cos(x), math.sin(x) }, { math.cossin(x) })
            end)
        end)
    end)
end)
