export function checkAuthInvite(request: Request) {
  const url = new URL(request.url)
  const by = url.searchParams.get("by") || undefined
  const code = url.searchParams.get("code") || undefined
  return { by, code }
}
