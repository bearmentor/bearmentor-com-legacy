import { useMemo } from "react"
import { useMatches } from "@remix-run/react"

import type { User, UserData } from "~/services/auth.server"

export type RootLoaderData = {
  user: User | undefined
  userData: UserData | undefined
}

export function useMatchesData(
  routeId: string,
): Record<string, unknown> | RootLoaderData {
  const matchingRoutes = useMatches()
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === routeId),
    [matchingRoutes, routeId],
  )
  return route?.data
}

export function useRootLoaderData() {
  const data = useMatchesData("root") as RootLoaderData

  return {
    user: data.user,
    userData: data.userData,
  }
}
