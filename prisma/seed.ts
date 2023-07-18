/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs"

import { createAvatarImageURL, prisma } from "~/libs"
import { log } from "~/utils"
import { dataUserRoles, dataUsers, dataUserTags } from "~/data"
// Firstly check ~/data/README.md
import dataUsersCredentials from "~/data/users-credentials.json"

/**
 * Main
 */
async function main() {
  await seedUserRoles()
  await seedUserTags()
  await seedUsers()
  await seedUserContents()
}

/**
 * User Roles
 */
async function seedUserRoles() {
  console.info("🟢 Seed user roles...")
  await prisma.userRole.deleteMany()
  console.info("🟡 Deleted existing user roles...")

  await prisma.userRole.createMany({
    data: dataUserRoles,
  })
  console.info(`✅ Created user roles`)
}

/**
 * User Tags
 */
async function seedUserTags() {
  console.info("🟢 Seed user tags...")
  await prisma.userTag.deleteMany()
  console.info("🟡 Deleted existing user tags...")

  await prisma.userTag.createMany({
    data: dataUserTags,
  })
  console.info(`✅ Created user tags`)
}

/**
 * Users
 */
async function seedUsers() {
  console.info("🟢 Seed users...")
  await prisma.user.deleteMany()
  console.info("🟡 Deleted existing users...")
  await prisma.userAvatarImage.deleteMany()
  console.info("🟡 Deleted existing user avatar images...")
  await prisma.userCoverImage.deleteMany()
  console.info("🟡 Deleted existing user cover images...")

  // Get existing roles
  const roles = await prisma.userRole.findMany()
  const ADMIN = roles.find(role => role.symbol === "ADMIN")
  const NORMAL = roles.find(role => role.symbol === "NORMAL")
  if (!ADMIN || !NORMAL) return null

  // Get existing tags
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
    }
  })

  // Setup data users to have email and passwords
  const dataUsersWithCredentials = dataUsersWithTags.map(user => {
    const newCred = dataUsersCredentials.find(
      cred => cred.username === user.username,
    )

    const hash = bcrypt.hashSync(newCred?.password || "", 10)

    const newUser = {
      ...user,
      email: newCred?.email,
      password: { create: { hash } },
    }

    return newUser
  })

  // Upsert (update or insert/create if new) the users with complete fields
  dataUsersWithCredentials.forEach(async user => {
    await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user,
    })

    console.info(`✅ User "${user.username}" created`)
  })
}

/**
 * User Contents
 */
async function seedUserContents() {
  console.info("🟢 Seed user contents...")
  await prisma.content.deleteMany()

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

/**
 * Run
 */
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
