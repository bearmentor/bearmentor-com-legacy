import type { User, UserProfile } from "@prisma/client"

import type { DataUserTagSymbol } from "~/data"

export type DataUser = Pick<User, "name" | "username" | "nick"> & {
  tags?: DataUserTagSymbol[]
} & {
  profiles: { create: DataUserProfile | DataUserProfile[] }
}

export type DataUserProfile = Pick<
  UserProfile,
  "headline" | "bio" | "modeName"
> & {
  isPrimary?: UserProfile["isPrimary"]
  sequence?: UserProfile["sequence"]
}

export const dataUsers: DataUser[] = [
  {
    name: "M Haidar Hanif",
    username: "haidar",
    nick: "Haidar",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: [
        {
          headline: "Software Engineering Mentor",
          bio: "Helping you to learn and build something for good on the web.",
          modeName: "Mentor",

          sequence: 1,
        },
        {
          headline: "Full Stack Web Developer",
          bio: "Building web applications to solve your problems.",
          modeName: "Developer",
          sequence: 2,
        },
      ],
    },
  },
  {
    name: "Zain Fathoni",
    username: "zain",
    nick: "Zain",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Software Engineer",
        bio: "Frontend at Ninja Van",
        modeName: "Engineer",

        sequence: 1,
      },
    },
  },
  {
    name: "Naufaldi Rafif",
    username: "faldi",
    nick: "Faldi",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Frontend Web Developer",
        bio: "Ningen (人間) in Tech",
        modeName: "Developer",
      },
    },
  },
  {
    name: "Kenneth Mahakim",
    username: "kenneth",
    nick: "Kenneth",
    tags: ["COLLABORATOR", "MENTOR", "DESIGNER"],
    profiles: {
      create: {
        headline: "UI and UX Designer",
        bio: "Bridging interface and experience",
        modeName: "Designer",
      },
    },
  },
  {
    name: "Ahmad Marzuki",
    username: "amadzuki",
    nick: "Marzuki",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Frontend Engineer",
        bio: "Implementing UI",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Krishna Rowter",
    username: "krowter",
    nick: "Krishna",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Frontend Engineer at Vidio.com",
        bio: "Building Websites",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Rizky Zhang",
    username: "rizkyzhang",
    nick: "Rizky",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Sofware Engineer at Ubersnap",
        bio: "I have worked in complex applications such as e-commerce and event management service",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Ali Reza Yahya",
    username: "alileza",
    nick: "Ali",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Sofware Engineer at SadaPay",
        bio: "Working as a Senior Software Engineer (Infrastructure)",
        modeName: "Engineer",
      },
    },
  },
]
