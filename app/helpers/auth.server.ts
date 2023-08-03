export function checkAuthInvite(request: Request) {
  const url = new URL(request.url)

  const by = url.searchParams.get("by") || undefined
  const code = url.searchParams.get("code") || undefined
  const isAvailable = Boolean(by) || Boolean(code)

  return { by, code, isAvailable }
}
