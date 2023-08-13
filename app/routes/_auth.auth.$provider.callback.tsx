import { redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"

import { authenticator } from "~/services"
import type { AuthStrategy } from "~/services"

export const loader = ({ request, params }: LoaderArgs) => {
  // If the provider is unspecified, redirect to the sign in page
  if (!params.provider) return redirect("/signin")

  const provider = params.provider as AuthStrategy

  return authenticator.authenticate(provider, request, {
    successRedirect: "/dashboard",
    failureRedirect: "/signin",
  })
}
