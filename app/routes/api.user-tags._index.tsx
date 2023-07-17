import { json, type LoaderArgs } from "@remix-run/node"

import { prisma } from "~/libs"

export const loader = async ({ request }: LoaderArgs) => {
  const userTags = await prisma.userTag.findMany({
    include: { users: { select: { username: true } } },
  })

  return json({ userTags })
}
