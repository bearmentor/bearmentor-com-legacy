import type { UserTag } from "@prisma/client"

export type DataUserTag = Pick<UserTag, "name" | "symbol"> & {
  // symbol: DataUserTagSymbol
  sequence?: UserTag["sequence"]
  description?: UserTag["description"]
}

export type DataUserTagSymbol =
  | "ARTIST"
  | "COLLABORATOR"
  | "COMPANY"
  | "DESIGNER"
  | "DEVELOPER"
  | "FOUNDER"
  | "MARKETER"
  | "MENTEE"
  | "MENTOR"
  | "ORGANIZATION"
  | "RECRUITER"
  | "WRITER"

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
  { symbol: "DEVELOPER", name: "Developer" },
  { symbol: "DESIGNER", name: "Designer" },
  { symbol: "WRITER", name: "Writer" },
  { symbol: "MARKETER", name: "Marketer" },
  { symbol: "RECRUITER", name: "Recruiter" },
  { symbol: "ARTIST", name: "Artist" },
  { symbol: "FOUNDER", name: "Founder" },
  { symbol: "ORGANIZATION", name: "Organization" },
  { symbol: "COMPANY", name: "Company" },
  { symbol: "UNKNOWN", name: "Unknown" },
]
