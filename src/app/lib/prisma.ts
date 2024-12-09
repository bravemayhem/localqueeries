import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export function createPrismaClient() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasourceUrl: process.env.DATABASE_URL,
  })

  prisma.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        try {
          const result = await query(args)
          return result
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('prepared statement')) {
            await prisma.$executeRawUnsafe('DEALLOCATE ALL').catch(() => {})
            return query(args)
          }
          throw error
        }
      },
    },
  })

  return prisma
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma