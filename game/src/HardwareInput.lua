local Object = require "lib.Object"
local Vector2 = require "lib.Vector2"

---@class Game.HardwareInput
---@overload fun(): self

---@class Game.HardwareInput: ExtendableObject
local HardwareInput = Object:extend()

---@alias Game.HardwareInput.State
---| "up"       The input isn not currently interacted with
---| "down"     The input is being held down
---| "pressed"  The input has been pressed and then released

---@alias Game.HardwareInput.State.Next.Entry { [true | false]: Game.HardwareInput.State }
---@alias Game.HardwareInput.State.Next {[Game.HardwareInput.State]: Game.HardwareInput.State.Next.Entry}

function HardwareInput:init()
    ---@type Game.HardwareInput.State.Next
    local next = {
        ["up"] = {
            [true] = "down",
            [false] = "up",
        },
        ["down"] = {
            [true] = "down",
            [false] = "pressed",
        },
        ["pressed"] = {
            [true] = "down",
            [false] = "up",
        },
    }

    if love.keyboard then
        ---@class Game.HardwareInput.Keyboard
        ---@overload fun(key: love.KeyConstant): self

        ---@class Game.HardwareInput.Keyboard: Game.HardwareInput
        local Keyboard = self:extend()

        ---@param key love.KeyConstant
        function Keyboard:init(key)
            ---@private
            ---@type love.KeyConstant
            self.key = key

            ---@private
            ---@type Game.HardwareInput.State
            self.state = "up"
        end

        function Keyboard:update()
            self.state = next[self.state][love.keyboard.isDown(self.key)]
        end

        function Keyboard:getState()
            return self.state
        end

        self.Keyboard = Keyboard
    end

    if love.mouse then
        ---@class Game.HardwareInput.Mouse
        ---@overload fun(buttons: integer): self Instantiate a Mouse input with n buttons

        ---@class Game.HardwareInput.Mouse: Game.HardwareInput
        local Mouse = self:extend()

        ---@param buttons? integer How many buttons the mouse has.<br>Default: `2`
        function Mouse:init(buttons)
            self.position = Vector2(love.mouse.getPosition())

            ---@private

            self.buttons = buttons

            ---@private
            ---@type Game.HardwareInput.State[]
            self.button = {}
            for i = 1, buttons, 1 do
                self.button[i] = "up"
            end
        end

        function Mouse:getPosition()
            return self.position.x, self.position.y
        end

        ---@param index integer Index of the button to check.<br>- `1` => left<br>- `2` => right<br>- `3` => wheel<br>- ...
        function Mouse:getState(index)
            if index < 1 or index > self.buttons then
                error(
                    ("Mouse button index should be between 1 and `self.buttons` (%d)."):format(
                        self.buttons
                    ),
                    2
                )
            end
            return self.buttons[index]
        end

        function Mouse:update()
            self.position:set(love.mouse.getPosition())
            for i = 1, self.buttons, 1 do
                self.button[i] = next[self.button[i]][love.mouse.isDown(i)]
            end
        end

        self.Mouse = Mouse
    end
end

return HardwareInput()
