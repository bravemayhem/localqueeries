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
      // Execute the query
      const result = await next(params)
      return result
    } catch (error) {
      // If we get a prepared statement error, try to deallocate and retry
      if (error instanceof Error && 
          error.message.includes('prepared statement')) {
        try {
          // Disconnect to clear any existing prepared statements
          await client.$disconnect()
          // Small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 100))
          // Retry the query
          return await next(params)
        } catch (retryError) {
          throw retryError
        }
      }
      throw error
    }
  })

  return client
}

// Create or reuse the Prisma Client instance
const prisma = global.prisma ?? prismaClientSingleton()

// In development, attach to global object
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma