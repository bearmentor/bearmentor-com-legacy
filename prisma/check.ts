import { prisma } from "~/libs"
import { log } from "~/utils"

async function main() {
  await getUsers()
}

async function getUsers() {
  console.info("🟢 Get users...")
  const users = await prisma.user.findMany({
    select: {
      name: true,
      username: true,
      email: true,
      avatars: { select: { url: true } },
    },
    orderBy: { createdAt: "asc" },
  })
  log(users)
}

main()
  .then(async () => {
    console.info("🔵 Checking complete")
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    console.error("🔴 Checking failed")
    prisma.$disconnect()
    process.exit(1)
  })
