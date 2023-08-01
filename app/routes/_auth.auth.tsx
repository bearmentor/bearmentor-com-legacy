import type { LoaderArgs } from "@remix-run/node"

import { authenticator } from "~/services/auth.server"

export const loader = async ({ request }: LoaderArgs) => {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}
