import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],  // Added more logging
    datasources: {
      db: {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.DATABASE_URL  // Changed from DIRECT_URL
          : process.env.DATABASE_URL
      }
    }
  })

// Cleanup function for both dev and prod
async function cleanupPrismaConnection() {
  if (prisma) {
    try {
      await prisma.$executeRaw`DEALLOCATE ALL`
      await prisma.$disconnect()
    } catch (e) {
      console.error('Prisma cleanup error:', e)
    }
  }
}

// Handle cleanup for both environments
if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', cleanupPrismaConnection)
} else {
  process.on('beforeExit', cleanupPrismaConnection)
  globalForPrisma.prisma = prisma
}

export default prisma