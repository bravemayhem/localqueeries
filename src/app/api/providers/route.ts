import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface ErrorResponse {
  error: string;
}

interface Provider {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  businessName: string | null;
  category: string;
  services: string[];
  isAlly: boolean;
  isVerified: boolean;
  isLGBTQIA: boolean;
  address: string | null;
  city: string;
  state: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

interface Review {
  id: string;
  createdAt: Date;
  rating: number;
  comment: string | null;
  providerId: string;
  userId: string;
}

interface ProviderWithDistance extends Provider {
  distance: number | null;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(request: Request): Promise<NextResponse<ProviderWithDistance[] | ErrorResponse>> {
  // Create a new PrismaClient instance for each request
  const prismaInstance = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const category = searchParams.get('category');
    
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    console.log('Attempting database query with params:', {
      category,
      latitude,
      longitude
    });

    const providers = await prismaInstance.provider.findMany({
      where: {
        ...(category && { category }),
      },
      include: {
        reviews: true
      }
    });

    console.log('Query successful, found providers:', providers.length);

    if (!providers || providers.length === 0) {
      return NextResponse.json(
        { error: 'No providers found' },
        { status: 404 }
      );
    }

    const providersWithDistance = providers.map((provider) => ({
      ...provider,
      distance: provider.latitude && provider.longitude
        ? calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            provider.latitude,
            provider.longitude
          )
        : null
    }));

    if (searchParams.get('sortBy') === 'distance') {
      providersWithDistance.sort((a, b) => 
        (a.distance || Infinity) - (b.distance || Infinity)
      );
    }

    return NextResponse.json(providersWithDistance);

  } catch (error: unknown) {
    console.error('Error in GET /api/providers:', {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  } finally {
    // Clean up prepared statements and disconnect
    await prismaInstance.$executeRawUnsafe('DEALLOCATE ALL')
    await prismaInstance.$disconnect()
  }
}

export async function POST(request: Request) {
  const prismaInstance = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    const data = await request.json();
    const provider = await prismaInstance.provider.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        imageUrl: data.imageUrl,
        businessName: data.businessName,
        category: data.category,
        services: data.services,
        isAlly: data.isAlly || false,
        isVerified: false, // Default to false for new providers
        isLGBTQIA: data.isLGBTQIA || false,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        rating: 0, // Default rating for new providers
        reviewCount: 0 // Default review count for new providers
      }
    });
    return NextResponse.json(provider);
  } catch (error) {
    console.error('Error creating provider:', error);
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    );
  } finally {
    await prismaInstance.$executeRawUnsafe('DEALLOCATE ALL')
    await prismaInstance.$disconnect()
  }
}≈