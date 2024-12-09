"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Select from '@/app/ui/components/Select';
import Button from '@/app/ui/components/Button';
import { PROVIDER_CATEGORIES } from '@/app/constants/categories';
import { debounce } from 'lodash';

interface AddressSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SearchFilters {
  location: Location;
  category: string;
  customCategory?: string;
  sortBy: string;
}

interface ProviderSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export default function ProviderSearch({ onSearch, isLoading = false }: ProviderSearchProps) {
  // State management
  const [filters, setFilters] = useState<SearchFilters>({
    location: {
      address: '',
      coordinates: {
        lat: 34.0522, // LA default
        lng: -118.2437
      }
    },
    category: '',
    sortBy: 'distance'
  });
  
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address search function
  const searchAddress = useCallback(async (query: string) => {
    if (!query) {
      setAddressSuggestions([]);
      setError(null);
      return;
    }
  
    if (query.length < 3) {
      setError('Please enter at least 3 characters');
      return;
    }
  
    setIsAddressLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(query)}`
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        // Handle the specific case of addresses outside LA
        if (response.status === 400 && data.error) {
          setError(data.error);
          setAddressSuggestions([]);
          return;
        }
        throw new Error('Failed to fetch address suggestions');
      }
  
      setAddressSuggestions(data);
      if (data.length === 0) {
        setError('No addresses found. Please try a different search.');
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to search address. Please try again.'
      );
      setAddressSuggestions([]);
    } finally {
      setIsAddressLoading(false);
    }
  }, []);

  // Create memoized debounced function
  const debouncedSearchAddress = useMemo(
    () => debounce((query: string) => {
      searchAddress(query);
    }, 300),
    [searchAddress]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchAddress.cancel();
    };
  }, [debouncedSearchAddress]);

  // Handle address selection
  const handleAddressSelect = (address: AddressSuggestion) => {
    setFilters(prev => ({
      ...prev,
      location: {
        address: address.display_name,
        coordinates: {
          lat: parseFloat(address.lat),
          lng: parseFloat(address.lon)
        }
      }
    }));
    setAddressSuggestions([]);
    setError(null);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters) => (value: string) => {
    if (key === 'location') return; // Location is handled separately
    setFilters(prev => ({ ...prev, [key]: value }));
    setError(null); // Clear any previous errors
  };

  // Handle search submission
  const handleSearch = () => {
    // Validate required fields
    if (!filters.location.address) {
      setError('Please enter an address');
      return;
    }

    if (!filters.category) {
      setError('Please select a category');
      return;
    }

    if (filters.category === 'other' && !filters.customCategory) {
      setError('Please specify the service type');
      return;
    }

    setError(null);
    onSearch(filters);
  };

  // Format category options
  const categoryOptions = [
    ...PROVIDER_CATEGORIES.map(category => ({
      value: category,
      label: category.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    })),
    { value: 'other', label: 'Other (Please Specify)' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'reviews', label: 'Review Count' },
  ];

  return (
    <div className="py-6" role="search" aria-label="Provider search">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location Search */}
        <div className="relative">
          <label 
            htmlFor="location-search"
            className="block text-text-primary font-medium mb-2"
          >
            Location
          </label>
          <input
            id="location-search"
            type="text"
            value={filters.location.address}
            onChange={(e) => {
              setFilters(prev => ({
                ...prev,
                location: { ...prev.location, address: e.target.value }
              }));
              debouncedSearchAddress(e.target.value);
            }}
            placeholder="Enter your address"
            className={`w-full px-4 py-2 rounded-md border ${
              error ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary-main`}
            aria-invalid={!!error}
            aria-describedby={error ? "location-error" : undefined}
          />
          
          {/* Loading State */}
          {isAddressLoading && (
            <div 
              className="absolute mt-1 text-sm text-gray-500"
              role="status"
              aria-label="Loading address suggestions"
            >
              Loading...
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div 
              id="location-error"
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {error}
            </div>
          )}
          
          {/* Address Suggestions */}
          {addressSuggestions.length > 0 && (
            <ul 
              className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
              role="listbox"
              aria-label="Address suggestions"
            >
              {addressSuggestions.map((address) => (
                <li
                  key={address.place_id}
                  onClick={() => handleAddressSelect(address)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleAddressSelect(address);
                    }
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  role="option"
                  tabIndex={0}
                  aria-selected="false"
                >
                  {address.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label 
            htmlFor="category-select"
            className="block text-text-primary font-medium mb-2"
          >
            Category
          </label>
          <Select
            value={filters.category}
            onChange={handleFilterChange('category')}
            options={categoryOptions}
            placeholder="Select category"
          />
          {filters.category === 'other' && (
            <input
              type="text"
              className="mt-2 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main"
              placeholder="Please specify service type"
              value={filters.customCategory || ''}
              onChange={(e) => handleFilterChange('customCategory')(e.target.value)}
              aria-label="Custom category specification"
            />
          )}
        </div>

        {/* Sort Selection */}
        <div>
          <label 
            htmlFor="sort-select"
            className="block text-text-primary font-medium mb-2"
          >
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onChange={handleFilterChange('sortBy')}
            options={sortOptions}
            placeholder="Sort by"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleSearch} 
          variant="secondary" 
          bold
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search Providers'}
        </Button>
      </div>
    </div>
  );
}