export function stringify(code: any) {
  return JSON.stringify(code, null, 2)
}

export function jsonParse(text: string) {
  return JSON.parse(text)
}
