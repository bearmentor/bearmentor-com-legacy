import { json, type LoaderArgs } from "@remix-run/node"

import { prisma } from "~/libs"

export const loader = async ({ request }: LoaderArgs) => {
  const users = await prisma.user.findMany({
    select: { username: true },
    orderBy: { createdAt: "asc" },
  })
  return json({ users })
}
