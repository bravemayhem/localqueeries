import type { Location } from '../location';
import type { ProviderProfile } from '../provider';

export interface SearchService {
  findProviders(location: Location, category: string, options?: SearchOptions): Promise<ProviderProfile[]>;
}

export interface SearchOptions {
  radius?: number;
  sortBy?: string;
  limit?: number;
  page?: number;
} 