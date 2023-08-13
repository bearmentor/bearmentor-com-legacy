import type { ActionArgs, LoaderArgs } from "@remix-run/node"

import { authenticator } from "~/services"
import { getRedirectTo } from "~/utils"

export const loader = async ({ request }: LoaderArgs) => {
  const redirectTo = getRedirectTo(request)
  await authenticator.logout(request, { redirectTo: redirectTo || "/signin" })
}

export const action = async ({ request }: ActionArgs) => {
  const redirectTo = getRedirectTo(request)
  await authenticator.logout(request, { redirectTo: redirectTo || "/signin" })
}
