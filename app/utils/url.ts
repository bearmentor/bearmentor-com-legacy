import type { LoaderArgs } from "@remix-run/node"

// Use in server-side
export function getRedirectTo(request: Request) {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirectTo") || undefined
  return redirectTo
}

// Use in action
export function getAllSearchQuery({ request }: Pick<LoaderArgs, "request">) {
  const url = new URL(request.url)
  const q = url.searchParams.get("q") || ""
  return { q }
}
// Use in action
export function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host")
  if (!host) {
    throw new Error("Could not determine domain URL.")
  }
  const protocol = host.includes("localhost") ? "http" : "https"
  return `${protocol}://${host}`
}
