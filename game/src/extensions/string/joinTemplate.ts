// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  joinTemplate(
    this: void,
    template: TemplateStringsArray,
    ...vars: unknown[]
  ): string
}

string.joinTemplate = (template, ...vars) => {
  const len = template.length

  if (len === 1) return template[0]

  let i = 0
  let buff = ''
  do {
    buff += template[i] + tostring(vars[i])
  } while (++i < len - 1)
  buff += template[i]

  return buff
}
