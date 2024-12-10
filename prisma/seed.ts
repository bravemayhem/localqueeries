import { PrismaClient, Prisma, Provider } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.provider.deleteMany({})

  // Define the provider data with proper typing
  const providerData: (Omit<Provider, 'id' | 'createdAt' | 'updatedAt'> & {
    reviews?: { create: never[] }
  })[] = [
    {
      name: "LA Painting Pros",
      email: "paint@example.com",
      phone: null,
      imageUrl: null,
      businessName: null,
      category: "painting",
      services: ["interior", "exterior"],
      isAlly: true,
      isVerified: true,
      isLGBTQIA: true,
      streetAddress: "123 Main Street",
      unit: "Suite 100",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90039",
      latitude: 34.115382,
      longitude: -118.255775,
      rating: 4.5,
      reviewCount: 0,
      reviews: {
        create: []
      }
    },
    {
      name: "Rainbow Painters",
      email: "rainbow@example.com",
      phone: null,
      imageUrl: null,
      businessName: null,
      category: "painting",
      services: ["interior", "mural"],
      isAlly: true,
      isVerified: true,
      isLGBTQIA: true,
      streetAddress: "456 Spring Street",
      unit: null,
      city: "Los Angeles",
      state: "CA",
      zipCode: "90012",
      latitude: 34.0522,
      longitude: -118.2437,
      rating: 4.8,
      reviewCount: 0,
      reviews: {
        create: []
      }
    }
  ] satisfies Prisma.ProviderCreateInput[]

  // Create test providers
  const providers = await Promise.all(
    providerData.map(data => 
      prisma.provider.create({
        data
      })
    )
  )

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