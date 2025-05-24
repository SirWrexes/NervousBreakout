import { Entities, Mouse, Window } from 'context'
import type { RGBA } from 'love.math'
import { Rectangle, Circle } from 'types/Shapes'

const RADIUS = 5
const SPEED = 200

const yPadding = () => 10
const xPadding = () => 10
const process = (item: unknown) =>
  is('number', item) ? math.roundn(item, 2) : item

let green: RGBA
const [rGreen, gGreen, bGreen] = (green = '#00ff00'.toRGB())
const sGreen = love.graphics.newShader(glsl`
  vec4 effect(vec4 colour, Image tex, vec2 texpos, vec2 scrpos) {
    return vec4(${rGreen}, ${gGreen}, ${bGreen}, 1.0);
  }
  `)

let orange: RGBA
const [rFox, gFox, bFox] = (orange = '#f08000'.toRGB())
const sFox = love.graphics.newShader(glsl`
  vec4 effect(vec4 colour, Image tex, vec2 texpos, vec2 scrpos) {
    return vec4(${rFox}, ${gFox}, ${bFox}, 1.0);
  }
`)

let nearest: Vector2

export class Ball extends Circle {
  private out = false
  private angle = 0
  private speed = SPEED
  private thrown = false
  private velocity = new Vector2(SPEED)
  private next = new Vector2()
  private nearest = new Vector2()

  constructor() {
    super(RADIUS, Entities.paddle.centre.clone())
    this.origin.y -= Entities.paddle.height / 2 + this.radius
  }

  resolveCollision(rect: Rectangle) {
    nearest = this.nearest
      .copy(this.next)
      .max(rect.origin.x + rect.width, rect.origin.y + rect.height)
      .min(rect.origin.x, rect.origin.y)

    const from = { up: false, down: false, left: false, right: false }
    const ray = this.nearest.clone().subtract(this.next)
    let overlap = this.radius - ray.magnitude

    if (overlap === -Infinity) overlap = 0
    if (overlap > 0) {
      from.up = this.origin.y > rect.origin.y
      from.down = this.origin.y < rect.origin.y + rect.height
      from.left = this.origin.x < rect.origin.x
      from.right = this.origin.x > rect.origin.x + rect.width
    }

    return $multi(ray.normalise(), overlap, from)
  }

  updateThrown(dt: number) {
    const [cos, sin] = math.cossin(this.angle)
    this.next.x = this.origin.x + this.velocity.x * cos * dt
    this.next.y = this.origin.y + this.velocity.y * sin * dt

    const targets: Rectangle[] = [
      new Rectangle(
        Window.width,
        Window.height,
        new Vector2(0, -Window.height)
      ),
      new Rectangle(Window.width, Window.height, new Vector2(-Window.width, 0)),
      new Rectangle(Window.width, Window.height, new Vector2(Window.width, 0)),
      new Rectangle(Window.width, Window.height, new Vector2(0, Window.height)),
      // @ts-expect-error aaaaaaaaaaaaaaaaaaa
      bfr,
      Entities.paddle,
    ]
    for (const target of targets) {
      const [normal, overlap] = this.resolveCollision(target)
      if (overlap > 0) {
        this.velocity.transform((x, y) =>
          $multi(normal.x !== 0 ? x * -1 : x, normal.y !== 0 ? y * -1 : y)
        )
        print(inspect({ normal, overlap }))
        this.next.add(normal.scale(overlap))
      }
    }

    this.origin.copy(this.next)
    this.next.x = this.origin.x + this.velocity.x * cos * dt * 10
    this.next.y = this.origin.y + this.velocity.y * sin * dt * 10
  }

  updateStandby() {
    love.graphics.print('bah oui connard')
    // TODO: onPaddleMove
    this.origin.set(
      Entities.paddle.centre.x,
      Entities.paddle.centre.y - this.diameter
    )
    // TODO: onMouseMove
    this.angle = this.centre.angle(Mouse.position)
  }

  update(dt: number) {
    if (this.out) {
      if (!Mouse.is('RELEASED', 1)) return
      this.thrown = false
      this.out = false
      this.velocity.set(this.speed)
    }
    if (!this.thrown && Mouse.is('RELEASED', 1)) this.thrown = true
    if (this.thrown) this.updateThrown(dt)
    else this.updateStandby()
  }

  draw() {
    if (this.thrown) {
      love.graphics.setShader(sGreen)
      love.graphics.line(this.origin.x, this.origin.y, nearest.x, nearest.y)
      love.graphics.setShader()
      love.graphics.print(
        [green, 'nearest point'],
        nearest.x + 2,
        nearest.y + 2
      )

      love.graphics.setShader(sFox)
      love.graphics.line(this.origin.x, this.origin.y, this.next.x, this.next.y)
      love.graphics.setShader()
      love.graphics.print(
        [orange, 'next position'],
        this.next.x + 2,
        this.next.y + 2
      )
    }

    love.graphics.print(inspect(this, { process }), xPadding(), yPadding())
    love.graphics.circle('line', this.origin.x, this.origin.y, this.radius)
  }
}
