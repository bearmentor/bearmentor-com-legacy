import { Prisma, type Broadcast } from "@prisma/client"
import type { z } from "zod"

import { prisma } from "~/libs"
import { createSlug } from "~/utils"
import type { schemaBroadcastDelete, schemaBroadcastQuick } from "~/schemas"

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
  createQuick(value: z.infer<typeof schemaBroadcastQuick>) {
    return prisma.broadcast.create({
      data: { ...value, slug: createSlug(value.title) },
    })
  },

  async deleteById({ id }: z.infer<typeof schemaBroadcastDelete>) {
    try {
      const broadcast = await prisma.broadcast.delete({
        where: { id },
      })
      return { broadcast, error: null }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return { error: { broadcast: `Broadcast ${id} does not exist` } }
      }
      return { error: { broadcast: `Broadcast ${id} to delete` } }
    }
  },
}
