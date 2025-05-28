export const glsl = (code: TemplateStringsArray, ...vars: unknown[]) =>
  string.joinTemplate(code, ...vars)
