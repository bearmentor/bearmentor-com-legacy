import type { User } from "@prisma/client"

import { prisma } from "~/libs"

export const modelUser = {
  getForSession({ id }: Pick<User, "id">) {
    return prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        nick: true,
        avatars: { select: { url: true } },
        tags: { select: { id: true, symbol: true, name: true } },
        profiles: { select: { headline: true, links: true } },
      },
    })
  },
}
