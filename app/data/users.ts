import type { User, UserProfile } from "@prisma/client"

export type DataUser = Pick<User, "name" | "username"> & {
  profiles: {
    create: Pick<
      UserProfile,
      "headline" | "bio" | "modeName" | "sequence" | "isPrimary"
    >
  }
}

export const dataUsers: DataUser[] = [
  {
    name: "M Haidar Hanif",
    username: "haidar",
    profiles: {
      create: {
        headline: "Full Stack Web Developer",
        bio: "Helping you to learn and build something for good on the web.",
        modeName: "Educator",
        sequence: 1,
        isPrimary: true,
      },
    },
  },
  {
    name: "Zain Fathoni",
    username: "zain",
    profiles: {
      create: {
        headline: "Software Engineer",
        bio: "Frontend at Ninja Van",
        modeName: "Engineer",
        sequence: 1,
        isPrimary: true,
      },
    },
  },
  {
    name: "Naufaldi Rafif",
    username: "faldi",
    profiles: {
      create: {
        headline: "Frontend Web Developer",
        bio: "Ningen (人間) in Tech",
        modeName: "Developer",
        sequence: 1,
        isPrimary: true,
      },
    },
  },
  {
    name: "Kenneth Mahakim",
    username: "kenneth",
    profiles: {
      create: {
        headline: "UI and UX Designer",
        bio: "Bridging interface and experience",
        modeName: "Designer",
        sequence: 1,
        isPrimary: true,
      },
    },
  },
  {
    name: "Ahmad Marzuki",
    username: "amadzuki",
    profiles: {
      create: {
        headline: "Frontend Engineer",
        bio: "Implementing UI",
        modeName: "Engineer",
        sequence: 1,
        isPrimary: true,
      },
    },
  },
]
