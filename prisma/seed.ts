/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs"

import { prisma } from "~/libs"
import { createBroadcastSlug } from "~/helpers"
import { createAvatarImageURL, log } from "~/utils"
import { dataBroadcasts, dataUserRoles, dataUsers, dataUserTags } from "~/data"
// Check README.md for the guide to setup the credentials
import dataUsersCredentials from "~/data/users-credentials.json"

// Enable and disable by commenting in/out the enabled items
const enabledItems = [
  "userRoles",
  "userTags",
  "users",
  "broadcasts",
  "contents",
]

async function main() {
  const seeds: { [key: string]: () => Promise<any> } = {
    userRoles: seedUserRoles,
    userTags: seedUserTags,
    users: seedUsers,
    broadcasts: seedBroadcasts,
    contents: seedContents,
  }

  for (const seedName of enabledItems) {
    const seed = seeds[seedName]
    if (seed) {
      await seed()
    }
  }
}

async function seedUserRoles() {
  console.info("🟢 Seed user roles...")
  await prisma.userRole.deleteMany()
  console.info("🟡 Deleted existing user roles...")

  await prisma.userRole.createMany({
    data: dataUserRoles,
  })
  console.info(`✅ Created user roles`)
}

async function seedUserTags() {
  console.info("🟢 Seed user tags...")
  await prisma.userTag.deleteMany()
  console.info("🟡 Deleted existing user tags...")

  await prisma.userTag.createMany({
    data: dataUserTags,
  })
  console.info(`✅ Created user tags`)
}

async function seedUsers() {
  if (dataUsersCredentials?.length <= 0) {
    console.error(`🔴 Please create app/data/users-credentials.json file`)
    console.error(`🔴 Check README for the guide`)
    return null
  }

  console.info("🟢 Seed users...")
  await prisma.user.deleteMany()
  console.info("🟡 Deleted existing users...")
  await prisma.userAvatarImage.deleteMany()
  console.info("🟡 Deleted existing user avatar images...")
  await prisma.userCoverImage.deleteMany()
  console.info("🟡 Deleted existing user cover images...")

  // Get existing roles for ids
  const roles = await prisma.userRole.findMany()
  const ADMIN = roles.find(role => role.symbol === "ADMIN")
  const NORMAL = roles.find(role => role.symbol === "NORMAL")
  if (!ADMIN || !NORMAL) return null

  // Get existing tags for ids
  const tags = await prisma.userTag.findMany()
  const COLLABORATOR = tags.find(tag => tag.symbol === "COLLABORATOR")
  const MENTOR = tags.find(tag => tag.symbol === "MENTOR")
  const MENTEE = tags.find(tag => tag.symbol === "MENTEE")
  const DEVELOPER = tags.find(tag => tag.symbol === "DEVELOPER")
  const DESIGNER = tags.find(tag => tag.symbol === "DESIGNER")
  const FOUNDER = tags.find(tag => tag.symbol === "FOUNDER")
  const WRITER = tags.find(tag => tag.symbol === "WRITER")
  const ARTIST = tags.find(tag => tag.symbol === "ARTIST")
  const UNKNOWN = tags.find(tag => tag.symbol === "UNKNOWN")
  if (
    !COLLABORATOR ||
    !MENTOR ||
    !MENTEE ||
    !DEVELOPER ||
    !DESIGNER ||
    !FOUNDER ||
    !WRITER ||
    !ARTIST ||
    !UNKNOWN
  )
    return null

  // Setup data users to connect to the tag ids
  const dataUsersWithTags = dataUsers.map(user => {
    const tags = user.tags?.map(tag => {
      if (tag === "COLLABORATOR") return { id: COLLABORATOR.id }
      if (tag === "MENTOR") return { id: MENTOR.id }
      if (tag === "MENTEE") return { id: MENTEE.id }
      if (tag === "DEVELOPER") return { id: DEVELOPER.id }
      if (tag === "DESIGNER") return { id: DESIGNER.id }
      if (tag === "FOUNDER") return { id: FOUNDER.id }
      if (tag === "WRITER") return { id: WRITER.id }
      if (tag === "ARTIST") return { id: ARTIST.id }
      return { id: UNKNOWN.id }
    })

    const isCollaborator = user.tags?.find(tag => tag === "COLLABORATOR")

    return {
      ...user,
      tags: { connect: tags },
      role: { connect: { id: isCollaborator ? ADMIN.id : NORMAL.id } },
      avatars: { create: { url: createAvatarImageURL(user.username) } },
      profiles: user.profiles || {
        create: {
          modeName: `Default ${user.nick || user.name}`,
          headline: `The headline of ${user.nick || user.name}`,
          bio: `The bio of ${user.nick || user.name} for longer description.`,
        },
      },
    }
  })

  // Setup data users to have email and passwords
  const dataUsersWithCredentials = dataUsersWithTags.map(user => {
    const newCred = dataUsersCredentials.find(cred => {
      return cred.username === user.username
    })

    const hash = bcrypt.hashSync(newCred?.password || "", 10)

    const newUser = {
      ...user,
      email: newCred?.email,
      password: { create: { hash } },
    }

    return newUser
  })

  // Upsert (update or insert/create if new) the users with complete fields
  for (const user of dataUsersWithCredentials) {
    const upsertedUser = await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user,
    })

    console.info(`✅ User "${upsertedUser.username}" upserted`)
  }
}

async function seedBroadcasts() {
  console.info("🟢 Seed broadcasts...")
  await prisma.broadcast.deleteMany()
  console.info("🟡 Deleted existing broadcasts...")

  for (const broadcast of dataBroadcasts) {
    const user = await prisma.user.findUnique({
      where: { username: broadcast.username },
    })
    if (!user) return null

    const newBroadcast = {
      userId: user.id,
      slug: createBroadcastSlug(broadcast.title, user.username),
      title: broadcast.title,
      description: broadcast?.description,
      body: broadcast?.body,
    }

    const createdBroadcast = await prisma.broadcast.create({
      data: newBroadcast,
      include: { user: { select: { username: true } } },
    })
    if (!createdBroadcast) return null
    console.info(
      `✅ Broadcast "${createdBroadcast.slug}" by "${createdBroadcast.user.username}" created`,
    )
  }
}

async function seedContents() {
  console.info("🟢 Seed user contents...")
  await prisma.content.deleteMany()
  console.info("🟡 Deleted existing broadcasts...")

  const userAdmin = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!userAdmin) return null

  const contentAdmin = await prisma.content.create({
    data: {
      userId: userAdmin.id,
      slug: "content-by-admin",
      title: "Content by Admin",
      description: "Content description.",
      body: "The body content by admin...",
    },
  })
  if (!contentAdmin) return null
  console.info(`✅ Content by "admin" created`)
}

main()
  .then(async () => {
    console.info("🔵 Seeding complete")
    await prisma.$disconnect()
  })
  .catch(e => {
    console.error(e)
    console.error("🔴 Seeding failed")
    prisma.$disconnect()
    process.exit(1)
  })
