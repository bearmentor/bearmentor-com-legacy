import { dataUserRoles, dataUsers } from "~/data"

import { prisma } from "~/libs"

async function main() {
  await seedUserRoles()
  await seedUsers()
  await seedUserContents()
}

async function seedUserRoles() {
  console.info("🟢 Seed user roles...")
  await prisma.userRole.deleteMany()

  await prisma.userRole.createMany({
    data: dataUserRoles,
  })
}

async function seedUsers() {
  console.info("🟢 Seed users...")
  await prisma.user.deleteMany()

  const roleAdmin = await prisma.userRole.findFirst({
    where: { symbol: "ADMIN" },
  })
  if (!roleAdmin) return null

  const userAdmin = await prisma.user.create({
    data: {
      roleId: roleAdmin.id,
      name: "Administrator",
      username: "admin",
      profiles: {
        create: {
          headline: "The Ruler",
          bio: "I'm just doing my job.",
          modeName: "Admin",
          sequence: 1,
          isPrimary: true,
        },
      },
    },
  })
  if (!userAdmin) return null
  console.info(`✅ User "admin" created`)

  dataUsers.forEach(async (dataUser) => {
    await prisma.user.create({
      data: dataUser,
    })
    console.info(`✅ User "${dataUser.username}" created`)
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
