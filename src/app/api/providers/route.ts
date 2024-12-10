import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { Provider } from '@prisma/client';

interface ErrorResponse {
  error: string;
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
  try {
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

    const providers = await prisma.provider.findMany({
      where: {
        ...(category && { category }),
      },
      include: {
        reviews: true
      }
    });

    if (!Array.isArray(providers)) {
      return NextResponse.json({
        error: 'Invalid database response'
      }, { status: 500 });
    }

    if (providers.length === 0) {
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

    return NextResponse.json(providersWithDistance);

  } catch (error) {
    console.error('Server error:', {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const provider = await prisma.provider.create({
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
  }
}