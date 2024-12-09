import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

// Cleanup function for both dev and prod
async function cleanupPrismaConnection() {
  if (prisma) {
    try {
      // Clean up any existing prepared statements
      await prisma.$executeRawUnsafe('DEALLOCATE ALL')
      await prisma.$disconnect()
    } catch (e) {
      console.error('Prisma cleanup error:', e)
    }
  }
}

// Handle cleanup for both environments
if (process.env.NODE_ENV === 'production') {
  // In production, clean up on SIGTERM
  process.on('SIGTERM', cleanupPrismaConnection)
  // Also clean up on unhandled errors
  process.on('unhandledRejection', cleanupPrismaConnection)
} else {
  // In development, clean up on exit
  process.on('beforeExit', cleanupPrismaConnection)
  globalForPrisma.prisma = prisma
}

export default prisma