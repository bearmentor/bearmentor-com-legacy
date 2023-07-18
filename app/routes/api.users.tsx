import { json, type LoaderArgs } from "@remix-run/node"

import { prisma } from "~/libs"

export const loader = async ({ request }: LoaderArgs) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      role: { select: { symbol: true } },
      profiles: { select: { headline: true, links: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  return json({ users })
}
