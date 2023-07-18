import { json, redirect } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import bcrypt from "bcryptjs"

import { authenticator } from "~/services/auth.server"
import type { AuthStrategy } from "~/services/auth.server"
import { prisma } from "~/libs"

export const loader = () => redirect("/login")

export const action = async ({ request, params }: ActionArgs) => {
  // If the provider is not specified, redirect to the login page
  if (!params.provider) return redirect("/login")

  const provider = params.provider as AuthStrategy

  if (provider === "form") {
    const clonedRequest = request.clone()
    const formData = await clonedRequest.formData()

    const email = String(formData.get("email"))
    const password = String(formData.get("password"))

    const user = await prisma.user.findUnique({
      where: { email },
      include: { password: true },
    })

    if (!user) return json({ user: null })

    if (!user.password) return json({ user: null })

    const isPasswordCorrect = await bcrypt.compare(password, user.password.hash)

    if (!isPasswordCorrect) return json({ user: null })

    return authenticator.authenticate("form", request, {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    })
  }

  return authenticator.authenticate(provider, request, {
    successRedirect: "/dashboard",
  })
}
