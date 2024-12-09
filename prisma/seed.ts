// seed.ts should be used to populate the database with mock data for development purposes
// This file is not used in production
// getRandomCategory is used to randomly select a category from the PROVIDER_CATEGORIES array

import { PrismaClient } from '@prisma/client';
import { PROVIDER_CATEGORIES } from '../src/app/constants/categories';

const prisma = new PrismaClient();

const getRandomCategory = () => {
    return PROVIDER_CATEGORIES[Math.floor(Math.random() * PROVIDER_CATEGORIES.length)];
  };

const mockProviders = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(323) 555-0123',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Sarah\'s Plumbing Solutions',
    category: PROVIDER_CATEGORIES[1], // Changed from 'plumbing' to use the constant
    services: ['Leak Repair', 'Pipe Installation', 'Water Heater Service'],
    isAlly: true,
    isVerified: true,
    isLGBTQIA: false,
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90012',
    latitude: 34.0522,
    longitude: -118.2437,
    rating: 4.8,
    reviewCount: 24
  },
  {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    phone: '(323) 555-0124',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Rainbow Electric',
    category: getRandomCategory(),
    services: ['Wiring', 'Lighting Installation', 'Electric Panel Upgrades'],
    isAlly: false,
    isVerified: true,
    isLGBTQIA: true,
    address: '456 Oak St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90014',
    latitude: 34.0407,
    longitude: -118.2468,
    rating: 5.0,
    reviewCount: 18
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    phone: '(323) 555-0125',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Bright Strokes Painting',
    category: 'painting',
    services: ['Interior Painting', 'Exterior Painting', 'Color Consultation', 'Cabinet Refinishing'],
    isAlly: true,
    isVerified: true,
    isLGBTQIA: false,
    address: '789 Maple Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90015',
    latitude: 34.0561,
    longitude: -118.2643,
    rating: 4.9,
    reviewCount: 32
  },
  {
    name: 'Sam Chen',
    email: 'sam@example.com',
    phone: '(323) 555-0126',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Voltage Masters Electric',
    category: 'electrical',
    services: ['Electrical Repairs', 'Panel Upgrades', 'Smart Home Installation', 'LED Lighting'],
    isAlly: true,
    isVerified: true,
    isLGBTQIA: true,
    address: '321 Cedar St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90017',
    latitude: 34.0488,
    longitude: -118.2518,
    rating: 4.7,
    reviewCount: 45
  },
  {
    name: 'Jamie Taylor',
    email: 'jamie@example.com',
    phone: '(323) 555-0127',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Paws & Pride Dog Walking',
    category: 'dog walking',
    services: ['Dog Walking', 'Pet Sitting', 'Puppy Care', 'Group Walks'],
    isAlly: false,
    isVerified: true,
    isLGBTQIA: true,
    address: '567 Birch Ln',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90019',
    latitude: 34.0723,
    longitude: -118.2827,
    rating: 5.0,
    reviewCount: 28
  },
  {
    name: 'Pat Johnson',
    email: 'pat@example.com',
    phone: '(323) 555-0128',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Rainbow Painters Collective',
    category: 'painting',
    services: ['Mural Painting', 'Decorative Finishes', 'Residential Painting', 'Commercial Painting'],
    isAlly: false,
    isVerified: true,
    isLGBTQIA: true,
    address: '890 Willow St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90026',
    latitude: 34.0762,
    longitude: -118.2546,
    rating: 4.8,
    reviewCount: 37
  },
  {
    name: 'Alex Kim',
    email: 'alexk@example.com',
    phone: '(323) 555-0129',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Spark Electric Solutions',
    category: 'electrical',
    services: ['Emergency Repairs', 'EV Charger Installation', 'Security Lighting', 'Surge Protection'],
    isAlly: true,
    isVerified: false,
    isLGBTQIA: false,
    address: '432 Palm Dr',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90028',
    latitude: 34.0928,
    longitude: -118.3287,
    rating: 4.6,
    reviewCount: 15
  },
  {
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    phone: '(323) 555-0130',
    imageUrl: '/images/womanworking.jpg',
    businessName: 'Tail Tales Dog Services',
    category: 'dog walking',
    services: ['Dog Walking', 'Training Basics', 'Pet Transportation', 'Dog Park Visits'],
    isAlly: true,
    isVerified: true,
    isLGBTQIA: true,
    address: '123 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90024',
    latitude: 34.0635,
    longitude: -118.4455,
    rating: 4.9,
    reviewCount: 41
  }
];

const mockUsers = [
  {
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    password: 'hashed_password_123', // In production, use proper password hashing
    phone: '(323) 555-0189',
    address: '789 Pine St, Los Angeles, CA 90015',
    preferences: {},
    isAdmin: false
  },
  {
    name: 'Admin User',
    email: 'admin@localqueeries.com',
    password: 'admin_password_123', // In production, use proper password hashing
    phone: '(323) 555-0190',
    address: '321 Admin St, Los Angeles, CA 90017',
    preferences: {},
    isAdmin: true
  }
];

const mockReviews = [
  {
    rating: 5,
    comment: "Excellent service! Very professional and respectful.",
    providerId: '', // We'll set this after creating providers
    userId: '' // We'll set this after creating users
  },
  {
    rating: 4,
    comment: "Great work, would recommend!",
    providerId: '',
    userId: ''
  }
];

async function main() {
  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();

  // Create providers
  const providers = await Promise.all(
    mockProviders.map(provider => 
      prisma.provider.create({ data: provider })
    )
  );

  // Create users
  const users = await Promise.all(
    mockUsers.map(user =>
      prisma.user.create({ data: user })
    )
  );

  // Create reviews with valid provider and user IDs
  await Promise.all(
    mockReviews.map((review, index) =>
      prisma.review.create({
        data: {
          ...review,
          providerId: providers[index % providers.length].id,
          userId: users[index % users.length].id
        }
      })
    )
  );

  console.log('Database has been seeded! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });