import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.DIRECT_URL  
          : process.env.DATABASE_URL 
      }
    }
  })

// Cleanup function
async function cleanupPrismaConnection() {
  if (prisma) {
    try {
      await prisma.$executeRaw`DEALLOCATE ALL`
    } catch (e) {
      console.log('Cleanup error:', e)
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', cleanupPrismaConnection)
  globalForPrisma.prisma = prisma
}

export default prisma