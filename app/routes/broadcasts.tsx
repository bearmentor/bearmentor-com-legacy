import type { ActionArgs } from "@remix-run/node"
import { Outlet } from "@remix-run/react"

import { authenticator } from "~/services"

export default function RouteComponent() {
  return <Outlet />
}

export const action = async ({ request }: ActionArgs) => {
  await authenticator.isAuthenticated(request)
  return null
}
