// API response types

import { ProviderProfile } from '../provider/profile';

// Base API Response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// API Error type
export type ApiError = {
  message: string;
  code?: string;
  status?: number;
}

// Specific Response types
export type GeocodingResponse = ApiResponse<{
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}[]>;

export type ProviderSearchResponse = ApiResponse<{
  providers: ProviderProfile[];
  total: number;
  page: number;
  limit: number;
}>;