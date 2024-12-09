import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Middleware to handle prepared statements
prisma.$use(async (params, next) => {
  try {
    return await next(params)
  } catch (error: any) {
    if (error?.message?.includes('prepared statement')) {
      await prisma.$executeRawUnsafe('DEALLOCATE ALL')
      return next(params)
    }
    throw error
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma