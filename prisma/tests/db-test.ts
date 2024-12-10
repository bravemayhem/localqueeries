import prisma from '@/app/lib/prisma'

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to database')
    
    // Test query
    const count = await prisma.provider.count()
    console.log(`Database has ${count} providers`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export default testConnection