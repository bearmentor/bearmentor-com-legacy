import bcrypt from "bcryptjs"
import type { z } from "zod"

import { prisma } from "~/libs"
import type { schemaUserUpdatePassword } from "~/schemas"

export type { User } from "@prisma/client"

export const query = {
  count() {
    return prisma.userPassword.count()
  },
}

export const mutation = {
  async update({
    id,
    password,
    currentPassword,
  }: z.infer<typeof schemaUserUpdatePassword>) {
    const userPassword = await prisma.userPassword.findUnique({
      where: { userId: id },
    })

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      userPassword?.hash ?? "",
    )
    if (!isCurrentPasswordCorrect) {
      return {
        error: {
          currentPassword: "Current password is incorrect, check again",
        },
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.update({
      where: { id },
      data: { password: { update: { hash: hashedPassword } } },
    })
    if (!user) return { error: { password: `Password is failed to change` } }

    return { user, error: null }
  },
}
