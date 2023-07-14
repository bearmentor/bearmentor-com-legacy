import type { UserTag } from "@prisma/client"

export type DataUserTag = Pick<
  UserTag,
  "sequence" | "symbol" | "name" | "description"
>

export const dataUserTags: DataUserTag[] = [
  {
    sequence: 1,
    symbol: "COLLABORATOR",
    name: "Collaborator",
    description: "Core Bearmentor team members.",
  },
  {
    sequence: 2,
    symbol: "MENTOR",
    name: "Mentor",
    description: "Someone who can mentor people",
  },
  {
    sequence: 3,
    symbol: "MENTEE",
    name: "Mentee",
    description: "Someone who want to be mentored by the mentors",
  },
]
