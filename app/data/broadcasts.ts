import type { Broadcast, User } from "@prisma/client"

export type DataBroadcast = Pick<Broadcast, "title" | "description"> & {
  username: User["username"]
  body?: Broadcast["body"]
}

export const dataBroadcasts: DataBroadcast[] = [
  {
    username: "haidar",
    title: "Welcome to broadcasts!",
    description: "How to find a mentor or mentee for you",
    body: `With Broadcast, we can send an announcement or info about something we need or offer some help with mentorship.

I'm also opening up some mentorship help for web development. Especially in full stack (frontend and backend) web application development with JavaScript, TypeScript, Node.js, and more. Just see my profile.

Enjoy, and let me know if there's something.`,
  },
  {
    username: "maya",
    title: "Public Speaking Community",
    description: "Looking for public speaking communities",
    body: "If anybody is interested and have been joining public speaking communities, please let me know. Thank you",
  },
  {
    username: "faldi",
    title: "The Frontend Mentorship",
    description: "The mentorship of for frontend developers",
    body: "The story of my frontend developer mentorship experience is quite long...",
  },
  {
    username: "zain",
    title: "Mentorship Journey",
    description: "The mentorship journey so far",
    body: "The story of my mentorship journey is quite long...",
  },
  {
    username: "mutia",
    title: "Next.js and NestJS",
    description:
      "Need mentor to help with full stack web application features development",
    body: `Hello, anyone here who are opening a private coding help?

The tech stack is around TypeScript, Next.js, NestJS, and PostgreSQL.`,
  },
]
