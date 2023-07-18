import { useMemo } from "react"
import { useMatches } from "@remix-run/react"

import type { UserData, UserSession } from "~/services/auth.server"

export type RootLoaderData = {
  nodeEnv: string
  userSession: UserSession | undefined
  userData: UserData | undefined
}

export function useMatchesData(
  routeId: string,
): Record<string, unknown> | RootLoaderData {
  const matchingRoutes = useMatches()
  const route = useMemo(
    () => matchingRoutes.find(route => route.id === routeId),
    [matchingRoutes, routeId],
  )
  return route?.data
}

export function useRootLoaderData() {
  const data = useMatchesData("root") as RootLoaderData

  return {
    nodeEnv: data.nodeEnv,
    userSession: data.userSession,
    userData: data.userData,
  }
}
