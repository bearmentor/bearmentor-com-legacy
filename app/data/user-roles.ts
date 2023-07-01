import type { UserRole } from "@prisma/client"

export type DataUserRole = Pick<
  UserRole,
  "sequence" | "symbol" | "name" | "description"
>

export const dataUserRoles: DataUserRole[] = [
  {
    sequence: 1,
    symbol: "ADMIN",
    name: "Administrator",
    description: "Can manage the entire system and data.",
  },
  {
    sequence: 2,
    symbol: "MANAGER",
    name: "Manager",
    description: "Can manage systems and data.",
  },
  {
    sequence: 3,
    symbol: "EDITOR",
    name: "Editor",
    description: "Can manage some data.",
  },
  {
    sequence: 4,
    symbol: "SUPPORTER",
    name: "Supporter",
    description: "Can give support to the community.",
  },
  {
    sequence: 5,
    symbol: "NORMAL",
    name: "Normal",
    description: "Can only do normal stuff.",
  },
]
