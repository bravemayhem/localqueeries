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

interface ProviderSearchProps {
  onSearch: (filters: {
    location: Location;
    category: string;
    sortBy: string;
  }) => void;
  isLoading?: boolean;
}

const sortOptions = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Number of Reviews' },
];

interface FetchError extends Error {
  name: string;
}

export default function ProviderSearch({ onSearch, isLoading = false }: ProviderSearchProps) {
  const [location, setLocation] = useState<Location>({
    address: '',
    coordinates: { lat: 0, lng: 0 }
  });
  const [category, setCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('distance');
  const [addressInput, setAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setError(query.length > 0 ? 'Please enter at least 3 characters' : null);
      return;
    }

    if (isAddressLoading) {
      return; // Prevent multiple simultaneous requests
    }

    setIsAddressLoading(true);
    setError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      const data = await response.json();

      if (response.status === 400) {
        setError(data.error);
        return;
      }

      if (response.status === 404) {
        setError('No addresses found. Try a different search.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch address suggestions');
      }

      if (Array.isArray(data) && data.length > 0) {
        setAddressSuggestions(data);
        setError(null);
      } else {
        setError('No addresses found. Try a different search.');
      }
    } catch (error: unknown) {
      console.error('Error in address search:', error);
      const fetchError = error as FetchError;
      setError(
        fetchError.name === 'AbortError' 
          ? 'Search took too long. Please try again.' 
          : 'Failed to search address. Please try again.'
      );
    } finally {
      setIsAddressLoading(false);
    }
  }, [isAddressLoading]);

  const debouncedSearchAddress = useMemo(
    () => debounce(searchAddress, 1000),
    [searchAddress]
  );

  const handleAddressSelect = (address: AddressSuggestion) => {
    setLocation({
      address: address.display_name,
      coordinates: {
        lat: parseFloat(address.lat),
        lng: parseFloat(address.lon)
      }
    });
    setAddressInput(address.display_name);
    setAddressSuggestions([]);
    setError(null);
  };

  const handleSearch = () => {
    if (!location.address) {
      setError('Please select a location');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    onSearch({
      location,
      category,
      sortBy
    });
  };

  useEffect(() => {
    return () => {
      debouncedSearchAddress.cancel();
    };
  }, [debouncedSearchAddress]);

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label htmlFor="location" className="block text-text-primary font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={addressInput}
            onChange={(e) => {
              setAddressInput(e.target.value);
              debouncedSearchAddress(e.target.value);
            }}
            placeholder="Enter an address"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main"
            aria-invalid={!!error}
            aria-describedby={error ? "location-error" : undefined}
            suppressHydrationWarning
          />
          {error && (
            <p id="location-error" className="mt-1 text-sm text-red-500">
              {error}
            </p>
          )}
          {addressSuggestions.length > 0 && (
            <ul
              className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto"
              role="listbox"
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
                  aria-selected={false}
                >
                  {address.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-text-primary font-medium mb-2">
            Category
          </label>
          <Select
            id="category"
            value={category}
            onChange={(value) => setCategory(value)}
            options={PROVIDER_CATEGORIES.map(category => ({
              value: category,
              label: category
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            }))}
            placeholder="Select a category"
          />
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-text-primary font-medium mb-2">
            Sort By
          </label>
          <Select
            id="sortBy"
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            options={sortOptions}
            placeholder="Sort by"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
      <Button 
        onClick={handleSearch}
        disabled={isLoading}
        variant="secondary"
        bold
        className="px-4 sm:px-8 py-1.5 sm:py-2 rounded-md font-medium 
          transition-colors text-sm sm:text-base flex items-center 
          justify-center min-w-[120px] sm:min-w-[160px]"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⌛</span> 
            Searching...
          </span>
        ) : (
          'Search Providers'
        )}
</Button>
      </div>
    </div>
  );
}