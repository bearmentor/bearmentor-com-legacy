export function checkAuthInvite(request: Request) {
  const url = new URL(request.url)
  const by = url.searchParams.get("inviteBy") || undefined
  const code = url.searchParams.get("inviteCode") || undefined

  return { by, code }
}
