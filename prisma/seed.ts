/* eslint-disable @typescript-eslint/no-unused-vars */
import { log } from "~/utils"

import { prisma } from "~/libs"
import { dataAdminUsers, dataUserRoles, dataUsers, dataUserTags } from "~/data"

async function main() {
  // await seedUserRoles()
  // await seedUserTags()
  await seedUsers()
  await seedUserContents()

  // await getUsers()
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
  console.info("🟢 Seed users...")
  await prisma.user.deleteMany()
  console.info("🟡 Deleted existing users...")

  // Get existing roles
  const roles = await prisma.userRole.findMany()
  const ADMIN = roles.find((role) => role.symbol === "ADMIN")
  const NORMAL = roles.find((role) => role.symbol === "NORMAL")
  if (!ADMIN || !NORMAL) return null

  // Get existing tags
  const tags = await prisma.userTag.findMany()
  const COLLABORATOR = tags.find((tag) => tag.symbol === "COLLABORATOR")
  const MENTOR = tags.find((tag) => tag.symbol === "MENTOR")
  const MENTEE = tags.find((tag) => tag.symbol === "MENTEE")
  const DEVELOPER = tags.find((tag) => tag.symbol === "DEVELOPER")
  const DESIGNER = tags.find((tag) => tag.symbol === "DESIGNER")
  if (!COLLABORATOR || !MENTOR || !MENTEE || !DEVELOPER || !DESIGNER)
    return null

  dataAdminUsers.forEach(async (user) => {
    await prisma.user.create({
      data: {
        ...user,
        roleId: ADMIN.id,
        tags: { connect: { id: COLLABORATOR.id } },
      },
    })
    console.info(`✅ User "${user.username}" created`)
  })
  console.info(`✅ Admin users created`)

  // Setup data users to connect to the tag ids
  const dataUsersWithTags = dataUsers.map((dataUser) => {
    const selectedTags = dataUser.tags?.map((tag) => {
      if (tag === "COLLABORATOR") return { id: COLLABORATOR.id }
      if (tag === "MENTOR") return { id: MENTOR.id }
      if (tag === "MENTEE") return { id: MENTEE.id }
      if (tag === "DEVELOPER") return { id: DEVELOPER.id }
      if (tag === "DESIGNER") return { id: DESIGNER.id }
      return { id: MENTEE.id }
    })
    return { ...dataUser, tags: { connect: selectedTags } }
  })

  // Finally create the users with the tags
  dataUsersWithTags.forEach(async (user) => {
    await prisma.user.create({ data: { ...user, roleId: NORMAL.id } })
    console.info(`✅ User "${user.username}" created`)
  })
}

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

async function getUsers() {
  console.info("🟣 Get users...")
  const users = await prisma.user.findMany({
    select: { username: true, tags: { select: { symbol: true } } },
  })
  log(users)
}

main()
  .then(async () => {
    console.log("🔵 Seeding complete")
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    console.log("🔴 Seeding failed")
    prisma.$disconnect()
    process.exit(1)
  })
