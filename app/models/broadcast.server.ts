import type { Broadcast } from "@prisma/client"
import type { z } from "zod"

import { prisma } from "~/libs"
import { createBroadcastSlug } from "~/helpers"
import type {
  schemaBroadcastDelete,
  schemaBroadcastQuick,
  schemaBroadcastUpdate,
} from "~/schemas"

export const fields = {
  public: {
    id: true,
  },
}

export const query = {
  count() {
    return prisma.broadcast.count()
  },

  getAll() {
    return prisma.broadcast.findMany({
      select: fields.public,
    })
  },

  getById({ id }: Pick<Broadcast, "id">) {
    return prisma.broadcast.findFirst({
      where: { id },
    })
  },
}

export const mutation = {
  createQuick({ ...value }: z.infer<typeof schemaBroadcastQuick>) {
    return prisma.broadcast.create({
      data: { ...value, slug: createBroadcastSlug(value.title) },
      include: { user: { select: { username: true } } },
    })
  },

  async deleteById({ id }: z.infer<typeof schemaBroadcastDelete>) {
    return await prisma.broadcast.delete({
      where: { id },
      include: { user: { select: { username: true } } },
    })
  },

  updateById({ id, ...value }: z.infer<typeof schemaBroadcastUpdate>) {
    const broadcast = {
      userId: value.userId,
      title: value.title,
      description: value.description,
      body: value.body,
    }

    return prisma.broadcast.update({
      where: { id },
      data: { ...broadcast, slug: createBroadcastSlug(value.title) },
      include: { user: { select: { username: true } } },
    })
  },
}
