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
  const R = 3959;
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
  const prismaInstance = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    // Add this at the start of the try block
    console.log('Database URL:', process.env.DATABASE_URL?.slice(0, 20) + '...');
    const testConnection = await prismaInstance.$queryRaw`SELECT 1 as test`;
    console.log('Database connection test:', testConnection);
    
    
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const category = searchParams.get('category');
    
    console.log('Received request params:', {
      latitude,
      longitude,
      category,
      allParams: Object.fromEntries(searchParams.entries())
    });

    if (!latitude || !longitude) {
      return NextResponse.json({
        error: 'Latitude and longitude are required'
      }, { status: 400 });
    }

    const providers = await prismaInstance.provider.findMany({
      where: {
        ...(category && { category }),
      },
      include: {
        reviews: true
      }
    });

    console.log('Database query results:', {
      providersFound: providers?.length ?? 0,
      providers: providers?.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category
      }))
    });

    // Ensure we have providers before proceeding
    if (!Array.isArray(providers) || providers.length === 0) {
      return NextResponse.json({
        error: `No providers found for category: ${category}`
      }, { status: 404 });
    }

    const providersWithDistance = providers.map(provider => ({
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

    // Ensure we're not sending null
    return NextResponse.json(providersWithDistance || []);

  } catch (error) {
    console.error('Server error:', {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });

  } finally {
    await prismaInstance.$disconnect().catch(error => {
      console.error('Error disconnecting from database:', error);
    });
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
        isVerified: false,
        isLGBTQIA: data.isLGBTQIA || false,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        rating: 0,
        reviewCount: 0
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
    await prismaInstance.$executeRawUnsafe('DEALLOCATE ALL');
    await prismaInstance.$disconnect();
  }
}