describe("Util", function()
    describe("colours", function()
        describe("hexToRgb", function()
            it("must work with hex6", function()
                local actual = { colours.hexToRgb "#123456" }
                local excpected = { 18, 52, 86, 255 }

                assert.are.same(excpected, actual)
            end)

            it("must work with hex8", function()
                local actual = { colours.hexToRgb "#DeadBeef" }
                local excpected = { 222, 173, 190, 239 }

                assert.are.same(actual, excpected)
            end)

            it("should work with hex3", function()
                local actual = { colours.hexToRgb "#420" }
                local excpected = { 68, 34, 0, 255 }

                assert.are.same(actual, excpected)
            end)

            it("should work with hex2", function()
                local actual = { colours.hexToRgb "#23" }
                local excpected = { 35, 35, 35, 255 }

                assert.are.same(actual, excpected)
            end)

            it("should work without leading #", function()
                local actual = { colours.hexToRgb "DeadBeef" }
                local excpected = { 222, 173, 190, 239 }

                assert.are.same(actual, excpected)
            end)

            local function callWith(data)
                return function()
                    return colours.hexToRgb(data)
                end
            end

            it("must fail when not getting a string", function()
                local data = nil
                assert.does.error(
                    callWith(data),
                    ("Invalid value. Expected string, got %s."):format(type(data))
                )
            end)

            it("must fail when not getting hex", function()
                local data = "#sucepute"
                assert.does.error(
                    callWith(data),
                    ("Invalid hexadecimal sequence: `%s`."):format(data)
                )
            end)

            it("should fail when length invalid", function()
                local data = "#a"
                assert.does.error(
                    callWith(data),
                    ("Hexadeximal colour string should be 2, 3, 6 or 8 characters long\nGot %d (`%s`)."):format(
                        #data - 1,
                        data
                    )
                )
            end)
        end)
    end)
end)
