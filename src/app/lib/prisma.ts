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
      await prisma.$executeRaw`DEALLOCATE ALL`
      await prisma.$disconnect()
    } catch (e) {
      console.error('Prisma cleanup error:', e)
    }
  }
}

// Handle cleanup for both environments
process.on('SIGTERM', cleanupPrismaConnection)
process.on('beforeExit', cleanupPrismaConnection)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma