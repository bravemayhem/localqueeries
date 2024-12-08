import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

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
  userLat: number,
  userLng: number,
  providerLat: number,
  providerLng: number
): number {
  const R = 3959;
  const dLat = (providerLat - userLat) * Math.PI / 180;
  const dLon = (providerLng - userLng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(providerLat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const userLat = parseFloat(searchParams.get('lat') || '0');
  const userLng = parseFloat(searchParams.get('lng') || '0');
  const sortBy = searchParams.get('sortBy') || 'distance';

  try {
    const providers = await prisma.provider.findMany({
      where: {
        ...(category && { category }),
        ...(location && { 
          OR: [
            { city: { contains: location, mode: 'insensitive' } },
            { state: { contains: location, mode: 'insensitive' } },
            { zipCode: { contains: location } }
          ]
        })
      },
      include: {
        reviews: true
      }
    });

    const providersWithDistance = providers.map((provider) => ({
        ...provider,
        distance: userLat && userLng ? 
          calculateDistance(
            userLat,
            userLng,
            provider.latitude ?? 0,
            provider.longitude ?? 0
          ) : null
      }));

    if (sortBy === 'distance' && userLat && userLng) {
      providersWithDistance.sort((a: ProviderWithDistance, b: ProviderWithDistance) => 
        (a.distance || 0) - (b.distance || 0)
      );
    }

    return NextResponse.json(providersWithDistance);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}