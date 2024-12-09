import { Location } from '../location';

export interface GeocodingRequest {
  address: string;
}

export interface ProviderSearchRequest {
  location: Location;
  category: string;
  sortBy: string;
  page?: number;
  limit?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}