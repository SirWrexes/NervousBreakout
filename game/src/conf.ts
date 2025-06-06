import 'extensions'
import 'types'

declare const arg: string[]

if (arg.includes('--dev')) {
  // @ts-expect-error assigning to variable declared const
  __DPart = Symbol('__DPart')
  // @ts-expect-error assigning to variable declared const
  __DEBUG = {} as never
  __DEBUG[__DPart] = __DEBUG
}

love.conf = t => {
  t.identity = undefined
  t.appendidentity = false
  t.version = '11.5'
  t.console = false
  t.accelerometerjoystick = true
  t.externalstorage = false
  t.gammacorrect = false

  t.audio.mic = false
  t.audio.mixwithsystem = true

  t.window.title = 'Nervous Breakout'
  t.window.icon = undefined
  t.window.width = 600
  t.window.height = 600
  t.window.borderless = false
  t.window.resizable = false
  t.window.minwidth = 1
  t.window.minheight = 1
  t.window.fullscreen = false
  t.window.fullscreentype = 'desktop'
  t.window.vsync = 1
  t.window.msaa = 0
  t.window.depth = undefined
  t.window.stencil = undefined
  t.window.display = 1
  t.window.highdpi = false
  t.window.usedpiscale = true
  t.window.x = undefined
  t.window.y = undefined

  t.modules.audio = true
  t.modules.data = true
  t.modules.event = true
  t.modules.font = true
  t.modules.graphics = true
  t.modules.image = true
  t.modules.joystick = true
  t.modules.keyboard = true
  t.modules.math = true
  t.modules.mouse = true
  t.modules.physics = true
  t.modules.sound = true
  t.modules.system = true
  t.modules.thread = true
  t.modules.timer = true
  t.modules.touch = true
  t.modules.video = true
  t.modules.window = true
}
