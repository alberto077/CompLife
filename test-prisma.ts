import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Checking for demo user...");
  let user = await prisma.user.findUnique({ where: { email: "demo@aura.com" } })
  if (!user) {
    console.log("Creating demo user...");
    user = await prisma.user.create({
      data: {
        name: "Player One (Demo)",
        email: "demo@aura.com",
        level: 4,
        totalXP: 570,
      }
    })
    console.log("Created:", user);
  } else {
    console.log("Found:", user);
  }
}
main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
