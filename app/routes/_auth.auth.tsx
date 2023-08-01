import type { LoaderArgs } from "@remix-run/node"

import { authenticator } from "~/services"

export const loader = async ({ request }: LoaderArgs) => {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}
