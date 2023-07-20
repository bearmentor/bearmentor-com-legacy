import type { z } from "zod"

import { prisma } from "~/libs"
import type {
  schemaUserProfileBio,
  schemaUserProfileHeadline,
  schemaUserUpdateProfile,
} from "~/schemas"

export type { User } from "@prisma/client"

export const fields = {
  public: { headline: true, bio: true },
}

export const query = {
  count() {
    return prisma.user.count()
  },
}

export const mutation = {
  async update({ id, headline, bio }: z.infer<typeof schemaUserUpdateProfile>) {
    const userProfile = await prisma.userProfile.update({
      where: { id },
      data: { headline, bio },
    })

    if (!userProfile) {
      return { error: { password: `Profile is failed to change` } }
    }

    return { userProfile, error: null }
  },

  async updateHeadline({
    id,
    headline,
  }: z.infer<typeof schemaUserProfileHeadline>) {
    const userProfile = await prisma.userProfile.update({
      where: { id },
      data: { headline },
    })

    if (!userProfile) {
      return { error: { headline: `Headline is failed to change` } }
    }

    return { userProfile, error: null }
  },

  async updateBio({ id, bio }: z.infer<typeof schemaUserProfileBio>) {
    const userProfile = await prisma.userProfile.update({
      where: { id },
      data: { bio },
    })

    if (!userProfile) return { error: { bio: `Bio is failed to change` } }

    return { userProfile, error: null }
  },
}
