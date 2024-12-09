// Search-related provider types
import type { Location } from '../location';

export interface ProviderSearchFilters {
  category?: string;
  sortBy?: string;
  location?: Location;
}

export interface ProviderSearchProps {
  onSearch: (params: ProviderSearchParams) => void;
  isLoading?: boolean;
}

export interface ProviderSearchParams {
  location: Location;
  category: string;
  sortBy: string;
}

export interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  error: string | null;
  setError: (error: string | null) => void;
} 