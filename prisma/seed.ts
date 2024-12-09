import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.provider.deleteMany({})

  // Create test providers
  const providers = await Promise.all([
    prisma.provider.create({
      data: {
        name: "LA Painting Pros",
        email: "paint@example.com",
        category: "painting",
        services: ["interior", "exterior"],
        isAlly: true,
        isVerified: true,
        isLGBTQIA: true,
        city: "Los Angeles",
        state: "CA",
        zipCode: "90039",
        latitude: 34.115382,
        longitude: -118.255775,
        rating: 4.5,
        reviewCount: 0
      }
    }),
    prisma.provider.create({
      data: {
        name: "Rainbow Painters",
        email: "rainbow@example.com",
        category: "painting",
        services: ["interior", "mural"],
        isAlly: true,
        isVerified: true,
        isLGBTQIA: true,
        city: "Los Angeles",
        state: "CA",
        zipCode: "90012",
        latitude: 34.0522,
        longitude: -118.2437,
        rating: 4.8,
        reviewCount: 0
      }
    })
  ])

  console.log('Seeded database with providers:', providers)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })