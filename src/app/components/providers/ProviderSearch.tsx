"use client";

import React, { useState } from 'react';
import Select from '@/app/ui/components/Select';
import Button from '@/app/ui/components/Button';
import { PROVIDER_CATEGORIES } from '@/app/constants/categories';
import LocationSearch from './LocationSearch';
import { Location } from '@/app/types/location';
import { ProviderSearchProps } from '@/app/types/provider';

const sortOptions = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Number of Reviews' },
];

export default function ProviderSearch({ onSearch, isLoading = false }: ProviderSearchProps) {
  const [location, setLocation] = useState<Location>({
    address: '',
    coordinates: { lat: 0, lng: 0 }
  });
  const [category, setCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('distance');
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LocationSearch 
          onLocationSelect={setLocation}
          error={error}
          setError={setError}
        />

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