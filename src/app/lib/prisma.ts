import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  // Add middleware for connection management
  client.$use(async (params, next) => {
    try {
      const result = await next(params)
      return result
    } catch (error) {
      if (error instanceof Error && 
          error.message.includes('prepared statement')) {
        // Force a new connection
        await client.$disconnect()
        // Create a new connection
        await new Promise(resolve => setTimeout(resolve, 100))
        // Retry the query with the new connection
        return await next(params)
      }
      throw error
    } finally {
      // Always disconnect after query completion
      await client.$disconnect()
    }
  })

  return client
}

const prisma = global.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma