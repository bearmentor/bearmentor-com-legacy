import type { UserTag } from "@prisma/client"

import { prisma } from "~/libs"

export const fields = {
  public: {
    id: true,
    symbol: true,
    name: true,
    description: true,
  },
}

export const query = {
  count() {
    return prisma.userTag.count()
  },

  getAll() {
    return prisma.userTag.findMany({
      select: fields.public,
    })
  },

  getBySymbol({ symbol }: { symbol: UserTag["symbol"] }) {
    return prisma.userTag.findFirst({
      where: { symbol },
    })
  },
}
