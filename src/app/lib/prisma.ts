import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

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

  // Add middleware to handle prepared statements cleanup
  client.$use(async (params, next) => {
    try {
      return await next(params)
    } catch (error) {
      // Type guard for Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError && 
          error.message.includes('prepared statement')) {
        try {
          // Try to execute the query again after a brief delay
          await new Promise(resolve => setTimeout(resolve, 100))
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

const prisma = global.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Add cleanup handler
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma