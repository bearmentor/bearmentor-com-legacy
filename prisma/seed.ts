import { dataUserRoles } from "~/data"

import { prisma } from "~/libs/db.server"

async function main() {
  await seedUserRoles()
  await seedUsers()
  await seedUserContents()
}

async function seedUserRoles() {
  console.info("Seed user roles...")
  await prisma.userRole.deleteMany()

  await prisma.userRole.createMany({
    data: dataUserRoles,
  })
}

async function seedUsers() {
  console.info("Seed users...")
  await prisma.user.deleteMany()

  const roleAdmin = await prisma.userRole.findFirst({
    where: { symbol: "ADMIN" },
  })
  if (!roleAdmin) return null

  await prisma.user.create({
    data: {
      roleId: roleAdmin.id,
      name: "Administrator",
      username: "admin",
      email: "admin@admin.com",
      profiles: {
        create: {
          headline: "The Ruler",
          bio: "I'm just doing my job.",
          primary: true,
          sequence: 1,
          mode: "Default",
        },
      },
    },
  })
}

async function seedUserContents() {
  console.info("Seed user contents...")
  await prisma.content.deleteMany()

  const userAdmin = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!userAdmin) return null

  await prisma.content.create({
    data: {
      userId: userAdmin.id,
      slug: "content-by-admin",
      title: "Content by Admin",
      description: "Content description.",
      body: "The body content by admin...",
    },
  })
}

main()
  .then(async () => {
    console.log("Seeding complete")
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    console.log("Seeding failed")
    prisma.$disconnect()
    process.exit(1)
  })
