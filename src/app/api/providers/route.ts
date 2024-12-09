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

interface ErrorResponse {
  error: string;
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
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const category = searchParams.get('category');
  const sortBy = searchParams.get('sortBy') || 'distance';

  // Use provided coordinates
  const searchCoordinates = {
    lat: latitude ? parseFloat(latitude) : 34.0522, // Default to LA if not provided
    lng: longitude ? parseFloat(longitude) : -118.2437
  };

  console.log('Search coordinates:', searchCoordinates); // Debug log

  try {
    const providers = await prisma.provider.findMany({
      where: {
        ...(category && { category }),
        // Optional: Add location-based filtering if needed
        city: {
          in: ['Los Angeles', 'West Hollywood', 'Santa Monica']
        }
      },
      include: {
        reviews: true
      }
    });

    console.log('Found providers:', providers.length); // Debug log

    const providersWithDistance: ProviderWithDistance[] = providers.map((provider) => {
      const distance = provider.latitude && provider.longitude ? 
        calculateDistance(
          searchCoordinates.lat,
          searchCoordinates.lng,
          provider.latitude,
          provider.longitude
        ) : null;

      console.log('Provider distance calculation:', {
        provider: provider.name,
        providerCoords: { lat: provider.latitude, lng: provider.longitude },
        searchCoords: searchCoordinates,
        distance
      }); // Debug log

      return {
        ...provider,
        distance
      };
    });

    // Sort providers based on criteria
    if (sortBy === 'distance') {
      providersWithDistance.sort((a, b) => 
        (a.distance || Infinity) - (b.distance || Infinity)
      );
    } else if (sortBy === 'rating') {
      providersWithDistance.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      providersWithDistance.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    console.log('Returning providers with distances:', 
      providersWithDistance.map(p => ({
        name: p.name,
        distance: p.distance
      }))
    ); // Debug log

    return NextResponse.json(providersWithDistance);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
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
  }
}