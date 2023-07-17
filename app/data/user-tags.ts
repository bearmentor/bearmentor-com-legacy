import type { UserTag } from "@prisma/client"

export type DataUserTag = Pick<UserTag, "symbol" | "name"> & {
  sequence?: UserTag["sequence"]
  description?: UserTag["description"]
}

export const dataUserTags: DataUserTag[] = [
  {
    symbol: "COLLABORATOR",
    name: "Collaborator",
    sequence: 1,
    description: "Core Bearmentor team members.",
  },
  {
    symbol: "MENTOR",
    name: "Mentor",
    sequence: 2,
    description: "Someone who can mentor people",
  },
  {
    symbol: "MENTEE",
    name: "Mentee",
    sequence: 3,
    description: "Someone who want to be mentored by the mentors",
  },
  { symbol: "RECRUITER", name: "Recruiter" },
  { symbol: "DEVELOPER", name: "Developer" },
  { symbol: "DESIGNER", name: "Designer" },
  { symbol: "MARKETER", name: "Marketer" },
  { symbol: "ARTIST", name: "Artist" },
  { symbol: "FOUNDER", name: "Founder" },
  { symbol: "ORGANIZATION", name: "Organization" },
  { symbol: "COMPANY", name: "Company" },
]
