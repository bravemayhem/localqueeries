import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

type ProviderResponse = {
  id: string;
  name: string;
  category: string;
  isVerified: boolean;
  isAlly: boolean;
  isLGBTQIA: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
}

export async function GET(request: Request): Promise<NextResponse<ProviderResponse[] | { error: string, details?: string }>> {
  try {
    await prisma.$connect()
    
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('latitude');
    const lonStr = searchParams.get('longitude');
    const category = searchParams.get('category');
    
    if (!latStr || !lonStr) {
      return NextResponse.json({ 
        error: 'Latitude and longitude are required' 
      }, { status: 400 });
    }

    const userLat = parseFloat(latStr);
    const userLon = parseFloat(lonStr);
    
    const providers = await prisma.provider.findMany({
      where: {
        ...(category && { category })
      }
    });

    const providersWithDistance = providers.map(provider => {
      let distance: number | null = null;
      
      if (provider.latitude && provider.longitude) {
        const R = 3959; // Earth's radius in miles
        const dLat = (provider.latitude - userLat) * Math.PI / 180;
        const dLon = (provider.longitude - userLon) * Math.PI / 180;
        
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(provider.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
      }

      return {
        id: provider.id,
        name: provider.name,
        category: provider.category,
        isVerified: provider.isVerified,
        isAlly: provider.isAlly,
        isLGBTQIA: provider.isLGBTQIA,
        rating: provider.rating ?? 0,
        reviewCount: provider.reviewCount,
        imageUrl: provider.imageUrl,
        latitude: provider.latitude,
        longitude: provider.longitude,
        distance
      };
    }).sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    return NextResponse.json(providersWithDistance, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect()
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