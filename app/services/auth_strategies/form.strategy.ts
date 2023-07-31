// https://github.com/sergiodxa/remix-auth-form
import { AuthorizationError } from "remix-auth"
import { FormStrategy } from "remix-auth-form"

import type { UserSession } from "~/services/auth.server"
import { prisma } from "~/libs"

export const formStrategy = new FormStrategy<UserSession>(
  async ({ form, context }) => {
    const email = String(form.get("email"))
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user?.id) {
      throw new AuthorizationError("User email is not found")
    }
    return { id: user.id }
  },
)
