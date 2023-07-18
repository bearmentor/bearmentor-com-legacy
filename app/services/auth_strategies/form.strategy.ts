// Refer to https://github.com/sergiodxa/remix-auth-form for more information
import { AuthorizationError } from "remix-auth"
import { FormStrategy } from "remix-auth-form"

import type { UserSession } from "~/services/auth.server"
import { prisma } from "~/libs"

export const formStrategy = new FormStrategy<UserSession>(
  async ({ form, context }) => {
    const email = String(form.get("email"))
    const user = (await prisma.user.findFirst({
      where: { email },
    })) as UserSession

    if (!user.id) {
      throw new AuthorizationError("User email is not found")
    }

    /**
     * The type of this user must match the type you pass to the Authenticator
     * the strategy will automatically inherit the type if you instantiate
     * directly inside the `use` method.
     */
    return { id: user.id }
  },
)
