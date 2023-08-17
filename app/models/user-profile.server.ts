import type { z } from "zod"

import { prisma } from "~/libs"
import type {
  schemaUserProfileBio,
  schemaUserProfileHeadline,
  schemaUserProfileLinks,
  schemaUserProfileModeName,
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
  async updateModeName({
    id,
    modeName,
  }: z.infer<typeof schemaUserProfileModeName>) {
    const userProfile = await prisma.userProfile.update({
      where: { id },
      data: { modeName },
    })
    if (!userProfile) {
      return { error: { modeName: `Mode name is failed to change` } }
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

  async updateLinks({ id, links }: z.infer<typeof schemaUserProfileLinks>) {
    const userProfile = await prisma.userProfile.update({
      where: { id },
      data: { links },
    })
    if (!userProfile) return { error: { links: `Links are failed to change` } }
    return { userProfile, error: null }
  },
}
