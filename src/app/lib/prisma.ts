import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  // Add the extension directly to the client
  prisma.$extends({
    query: {
      async $allOperations({ query, args }) {
        try {
          return await query(args)
        } finally {
          await prisma.$executeRaw`DEALLOCATE ALL`
        }
      },
    },
  })

  return prisma
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma