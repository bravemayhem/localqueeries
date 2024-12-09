import { NextResponse } from 'next/server';

// LA boundaries (approximate)
const LA_BOUNDS = {
    north: 34.3373,  // North LA county
    south: 33.7037,  // South LA county
    east: -117.6462, // East LA county
    west: -118.6682  // West LA county
  };

interface NominatimResponse {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    // Using Nominatim OpenStreetMap API for geocoding
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(address)}` +
        `&countrycodes=us` +
        `&viewbox=${LA_BOUNDS.west},${LA_BOUNDS.north},${LA_BOUNDS.east},${LA_BOUNDS.south}` +
        `&bounded=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding service failed');
    }

    const data = await response.json() as NominatimResponse[];
    
    // Transform the data to match your AddressSuggestion interface
    const suggestions = data.filter(item => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        return (
          lat >= LA_BOUNDS.south &&
          lat <= LA_BOUNDS.north &&
          lon >= LA_BOUNDS.west &&
          lon <= LA_BOUNDS.east
        );
      }).map(item => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }));
  
      if (suggestions.length === 0) {
        return NextResponse.json(
          { error: 'Sorry - Local Queeries only exists in Los Angeles at the moment' },
          { status: 400 }
        );
      }

    // Add these headers here, just before returning
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=3600',
      'User-Agent': 'LocalQueeries/1.0'
    };

    return NextResponse.json(suggestions, { headers });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address suggestions' },
      { status: 500 }
    );
  }
}