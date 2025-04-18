import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'lead1@example.com' },
    update: {},
    create: {
      email: 'lead1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: Role.LEAD
    }
  })

  await prisma.user.upsert({
    where: { email: 'lead2@example.com' },
    update: {},
    create: {
      email: 'lead2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: Role.LEAD
    }
  })

  await prisma.user.upsert({
    where: { email: 'team1@example.com' },
    update: {},
    create: {
      email: 'team1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: Role.TEAM
    }
  })

  await prisma.user.upsert({
    where: { email: 'team2@example.com' },
    update: {},
    create: {
      email: 'team2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: Role.TEAM
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
