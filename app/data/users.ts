import type { User, UserProfile } from "@prisma/client"

export type DataUser = Pick<User, "name" | "username" | "nick"> & {
  profiles: { create: DataUserProfile | DataUserProfile[] }
}

export type DataUserProfile = Pick<
  UserProfile,
  "headline" | "bio" | "modeName" | "sequence"
> & {
  isPrimary?: UserProfile["isPrimary"]
}

export const dataUsers: DataUser[] = [
  {
    name: "M Haidar Hanif",
    username: "haidar",
    nick: "Haidar",
    profiles: {
      create: [
        {
          headline: "Software Engineering Mentor",
          bio: "Helping you to learn and build something for good on the web.",
          modeName: "Mentor",
          isPrimary: true,
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
    profiles: {
      create: {
        headline: "Software Engineer",
        bio: "Frontend at Ninja Van",
        modeName: "Engineer",
        isPrimary: true,
        sequence: 1,
      },
    },
  },
  {
    name: "Naufaldi Rafif",
    username: "faldi",
    nick: "Faldi",
    profiles: {
      create: {
        headline: "Frontend Web Developer",
        bio: "Ningen (人間) in Tech",
        modeName: "Developer",
        isPrimary: true,
        sequence: 1,
      },
    },
  },
  {
    name: "Kenneth Mahakim",
    username: "kenneth",
    nick: "Kenneth",
    profiles: {
      create: {
        headline: "UI and UX Designer",
        bio: "Bridging interface and experience",
        modeName: "Designer",
        isPrimary: true,
        sequence: 1,
      },
    },
  },
  {
    name: "Ahmad Marzuki",
    username: "amadzuki",
    nick: "Marzuki",
    profiles: {
      create: {
        headline: "Frontend Engineer",
        bio: "Implementing UI",
        modeName: "Engineer",
        isPrimary: true,
        sequence: 1,
      },
    },
  },
  {
    name: "Krishna Rowter",
    username: "krowter",
    nick: "Krishna",
    profiles: {
      create: {
        headline: "Frontend Engineer at Vidio.com",
        bio: "Building Websites",
        modeName: "Engineer",
        isPrimary: true,
        sequence: 1,
      },
    },
  },
  {
    name: "Rizky Zhang",
    username: "rizkyzhang",
    nick: "Rizky",
    profiles: {
      create: {
        headline: "Sofware Engineer at Ubersnap",
        bio: "I have worked in complex applications such as e-commerce and event management service",
        modeName: "Engineer",
        isPrimary: true,
        sequence: 1,
      },
    },
  },
  {
    name: "Ali Reza Yahya",
    username: "alileza",
    nick: "Ali",
    profiles: {
      create: {
        headline: "Sofware Engineer at SadaPay",
        bio: "Working as a Senior Software Engineer (Infrastructure)",
        modeName: "Engineer",
        isPrimary: true,
        sequence: 1,
      },
    },
  },
]
