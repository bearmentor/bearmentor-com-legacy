import { redirect } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"

import { authenticator } from "~/services/auth.server"
import type { AuthStrategy } from "~/services/auth.server"
import { getRedirectTo } from "~/utils"

export const loader = () => redirect("/login")

/**
 * To trigger Auth Action, it must be from a Form submission
 */
export const action = async ({ request, params }: ActionArgs) => {
  const provider = params.provider as AuthStrategy
  if (!provider) return redirect("/login")

  return authenticator.authenticate(provider, request, {
    successRedirect: getRedirectTo(request) || "/dashboard",
    failureRedirect: "/login",
  })
}