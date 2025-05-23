/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const */

declare let glsl: (code: TemplateStringsArray, ...vars: unknown[]) => string

glsl = (code: TemplateStringsArray, ...vars: unknown[]) => {
  const len = code.length

  if (len === 1) return code[0]

  let i = 0
  let buff = ''
  do {
    buff += code[i] + tostring(vars[i])
  } while (++i < len - 1)
  buff += code[i]

  return buff
}
