import { useSearchParams } from "@remix-run/react"

export function useRedirectTo() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || undefined

  return { searchParams, redirectTo }
}
