import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

// Create or reuse the Prisma Client instance
const prisma = global.prisma ?? prismaClientSingleton()

// In development, attach to global object
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Handle shutdown gracefully
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma