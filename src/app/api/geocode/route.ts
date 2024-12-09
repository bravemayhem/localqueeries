import { NextResponse } from 'next/server';

// Define LA bounds (expanded to ensure coverage)
const LA_BOUNDS = {
  north: 34.337306,
  south: 33.703691,
  east: -118.668175,
  west: -118.155289,
};

interface NominatimResponse {
    place_id: number;  // Changed from string to number
    display_name: string;
    lat: string;
    lon: string;
  }
  
  function isValidNominatimResponse(item: unknown): item is NominatimResponse {
    if (!item || typeof item !== 'object') {
      return false;
    }
    
    const response = item as Record<string, unknown>;
    const isValid = (
      typeof response.place_id === 'number' &&  // Changed from 'string' to 'number'
      typeof response.display_name === 'string' &&
      typeof response.lat === 'string' &&
      typeof response.lon === 'string'
    );
  
    if (!isValid) {
      console.log('Missing required properties:', {
        hasPlaceId: typeof response.place_id === 'number',  // Changed from 'string' to 'number'
        hasDisplayName: typeof response.display_name === 'string',
        hasLat: typeof response.lat === 'string',
        hasLon: typeof response.lon === 'string'
      });
    }
  
    return isValid;
  }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  if (address.length < 3) {
    return NextResponse.json(
      { error: 'Please enter at least 3 characters' },
      { status: 400 }
    );
  }

  try {
    console.log('Fetching address suggestions for:', address);

    const searchQuery = address.toLowerCase().includes('los angeles') 
      ? address 
      : `${address}, Los Angeles, CA`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&` +
      `q=${encodeURIComponent(searchQuery)}` +
      `&countrycodes=us` +
      `&bounded=1` +
      `&limit=5`,
      {
        headers: {
          'User-Agent': 'LocalQueeries/1.0',
          'Accept': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Nominatim API error:', response.statusText);
      return NextResponse.json(
        { error: `Geocoding service failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Nominatim API response:', data);

    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return NextResponse.json(
        { error: 'Invalid response from geocoding service' },
        { status: 500 }
      );
    }

    const validatedData = data
    .filter(isValidNominatimResponse)
    .map(item => ({
        place_id: item.place_id.toString(),  // Convert number to string
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon
    }))
      .filter(item => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        
        const isInBounds = 
          !isNaN(lat) && 
          !isNaN(lon) &&
          lat >= LA_BOUNDS.south &&
          lat <= LA_BOUNDS.north &&
          lon >= LA_BOUNDS.east &&
          lon <= LA_BOUNDS.west;

        if (!isInBounds) {
          console.log('Address filtered out:', {
            coordinates: { lat, lon },
            bounds: LA_BOUNDS
          });
        }

        return isInBounds;
      });

    if (validatedData.length === 0) {
      return NextResponse.json(
        { error: 'No addresses found in Los Angeles area. Try a different search.' },
        { status: 404 }
      );
    }

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address suggestions' },
      { status: 500 }
    );
  }
}