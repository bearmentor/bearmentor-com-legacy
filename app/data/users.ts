import type { User, UserProfile } from "@prisma/client"

import type { DataUserTagSymbol } from "~/data"

export type DataUser = Pick<User, "name" | "username"> & {
  nick?: User["nick"]
  tags?: DataUserTagSymbol[]
} & {
  profiles?: { create: DataUserProfile | DataUserProfile[] }
}

export type DataUserProfile = Pick<
  UserProfile,
  "headline" | "bio" | "modeName"
> & {
  isPrimary?: UserProfile["isPrimary"]
  sequence?: UserProfile["sequence"]
}

export const dataAdminUsers: DataUser[] = [
  {
    name: "Administrator",
    username: "admin",
    nick: "Admin",
    profiles: {
      create: { headline: "The Ruler", bio: "I'm Admin.", modeName: "Admin" },
    },
  },
  {
    name: "Bearmentor",
    username: "bearmentor",
    nick: "Bear",
    profiles: {
      create: { headline: "The Bear", bio: "I'm the Bear.", modeName: "Bear" },
    },
  },
]

export const dataUsers: DataUser[] = [
  {
    name: "M Haidar Hanif",
    username: "haidar",
    nick: "Haidar",
    tags: ["COLLABORATOR", "FOUNDER", "MENTOR", "DEVELOPER", "DESIGNER"],
    profiles: {
      create: [
        {
          headline: "Software Engineering Mentor",
          bio: "Helping you to learn and build something for good on the web.",
          modeName: "Mentor",
        },
        {
          headline: "Full Stack Web Developer",
          bio: "Building web applications to solve your problems.",
          modeName: "Developer",
          sequence: 2,
          isPrimary: false,
        },
      ],
    },
  },
  {
    name: "Maya Asmara",
    username: "maya",
    nick: "maya",
    tags: ["COLLABORATOR", "WRITER"],
    profiles: {
      create: {
        headline: "Writer and Speaker",
        bio: "Writing for public speaking.",
        modeName: "Writer",
      },
    },
  },
  {
    name: "Latifah Dhia I",
    username: "ifa",
    nick: "ifa",
    tags: ["COLLABORATOR", "ARTIST", "MENTEE"],
    profiles: {
      create: {
        headline: "Graphic Artist",
        bio: "Drawing for illustration.",
        modeName: "Artist",
      },
    },
  },
  {
    name: "Thoriq Nur Faizal",
    username: "thoriq",
    nick: "Thoriq",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: [
        {
          headline: "Software Engineering Mentor",
          bio: "Mentoring future engineers.",
          modeName: "Mentor",
        },
        {
          headline: "Full Stack Web Developer",
          bio: "Developing web applications.",
          modeName: "Developer",
          sequence: 2,
          isPrimary: false,
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
    name: "Bagus Juang Wiantoro",
    username: "bagusjuang",
    nick: "Bagus/Juang",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: [
        {
          headline: "Software Engineering Teacher",
          bio: "Teaching future engineers.",
          modeName: "Mentor",
        },
        {
          headline: "Software Engineer",
          bio: "Engineering applications.",
          modeName: "Engineer",
          sequence: 2,
          isPrimary: false,
        },
      ],
    },
  },
  {
    name: "Jonathan Nicolas",
    username: "jo",
    nick: "jo",
    tags: ["MENTEE", "DEVELOPER", "ARTIST"],
    profiles: {
      create: [
        {
          headline: "Web Developer",
          bio: "Developing web applications.",
          modeName: "Developer",
        },
        {
          headline: "Contemporary Artist",
          bio: "Making some artworks.",
          modeName: "Artist",
          sequence: 2,
          isPrimary: false,
        },
      ],
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
  {
    name: "Arsyad Ramadhan",
    username: "arsyad",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Aunuun Jeffry Mahbuubi",
    username: "jeffry",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Bernhard Hustomo",
    username: "berry.sg",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Calvin Wong",
    username: "calvinwong",
    tags: ["FOUNDER"],
  },
  {
    name: "Dzaki Fadhlurrohman",
    username: "dzaki",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ega Radiegtya",
    username: "radiegtya",
    tags: ["FOUNDER"],
  },
  {
    name: "Ego Maragustaf",
    username: "ego",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Eric Pradana",
    username: "eric",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ersan Karimi",
    username: "ersan",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Fikri Alwan Ramadhan",
    username: "fikri",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Guntur Kurniawan Heryanto",
    username: "guntur",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Kresna Galuh",
    username: "kresnagaluh",
    tags: ["FOUNDER", "DEVELOPER"],
  },
  {
    name: "Ahmad Oriza",
    username: "ahmadoriza",
    tags: ["FOUNDER", "DEVELOPER", "MENTOR"],
  },
  {
    name: "Hadyan Palupi",
    username: "hadyanpalupi",
    tags: ["MARKETER"],
  },
  {
    name: "Irsan Sebastian",
    username: "sanoncode",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ismal Zikri Damani",
    username: "ismalzikri",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "M Faris Gibran",
    username: "mfarisgibran",
    tags: ["MENTEE", "MARKETER"],
  },
  {
    name: "M Suryadi Triputra",
    username: "suryadi",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Maruf Hasan",
    username: "maruf",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Muhammad Farkhan Syafii",
    username: "farkhan",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Reymond Julio",
    username: "reymond",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Reza Radityo",
    username: "radityo",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Rofiq Ahmad Mubarok",
    username: "rofiq",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Dandi Rizky Eko Saputro",
    username: "dandi",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Yosua Halim",
    username: "yosua",
    tags: ["DEVELOPER"],
  },
]
