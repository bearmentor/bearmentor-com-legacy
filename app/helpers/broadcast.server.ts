import type { Broadcast, User } from "@prisma/client"

import { createSlug } from "~/utils"

export function createBroadcastSlug(
  title: Broadcast["title"],
  username: User["username"],
) {
  const slug: string = createSlug(title)
  return `${slug}-${username}`
}
