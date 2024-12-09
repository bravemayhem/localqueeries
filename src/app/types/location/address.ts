// Imports Coordinates and defines Location types

// Imports Coordinates and defines Location types
import type { Coordinates } from './coordinates.ts';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;
}

export interface DetailedLocation extends Location {
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;  // Optional for compatibility with database
  longitude?: number;// Optional for compatibility with database
}

export interface AddressSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export interface LocationError extends Error {
  name: string;
} 