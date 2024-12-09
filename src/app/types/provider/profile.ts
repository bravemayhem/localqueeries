// Provider profile types

import { Location } from '../location';

export interface ProviderProfile {
  id: string;
  name: string;
  description?: string;
  category: string;
  location: Location;
  rating?: number;
  reviewCount?: number;
}

export interface ProviderService {
  id: string;
  name: string;
  description: string;
  price?: number;
  duration?: number;
} 