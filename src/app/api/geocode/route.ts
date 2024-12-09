import { NextResponse } from 'next/server';

// Define LA bounds (approximate bounding box for Los Angeles area)
const LA_BOUNDS = {
  north: 34.3373061,
  south: 33.7036917,
  east: -118.1552891,
  west: -118.6681759,
};

// Define the Nominatim response type
interface NominatimResponse {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  [key: string]: unknown; // Add index signature to allow additional properties
}

// Type guard function to validate the response
function isValidNominatimResponse(item: unknown): item is NominatimResponse {
  return (
    typeof item === 'object' &&
    item !== null &&
    'place_id' in item &&
    'display_name' in item &&
    'lat' in item &&
    'lon' in item &&
    typeof (item as NominatimResponse).place_id === 'string' &&
    typeof (item as NominatimResponse).display_name === 'string' &&
    typeof (item as NominatimResponse).lat === 'string' &&
    typeof (item as NominatimResponse).lon === 'string'
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    console.log('Fetching address suggestions for:', address);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&` +
      `q=${encodeURIComponent(address)}` +
      `&countrycodes=us` +
      `&viewbox=${LA_BOUNDS.west},${LA_BOUNDS.north},${LA_BOUNDS.east},${LA_BOUNDS.south}` +
      `&bounded=1`,
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
      throw new Error(`Geocoding service failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Nominatim API response:', data);

    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response from geocoding service');
    }

    // Type-check each item in the array
    const validatedData = data.map(item => {
      if (!isValidNominatimResponse(item)) {
        throw new Error('Invalid response item format');
      }
      return item;
    });

    const suggestions = validatedData
      .filter(item => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        return (
          lat >= LA_BOUNDS.south &&
          lat <= LA_BOUNDS.north &&
          lon >= LA_BOUNDS.west &&
          lon <= LA_BOUNDS.east
        );
      })
      .map(item => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }));

    console.log('Filtered suggestions:', suggestions);

    if (suggestions.length === 0) {
      return NextResponse.json(
        { error: 'No addresses found in Los Angeles area' },
        { status: 404 }
      );
    }

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch address suggestions',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}