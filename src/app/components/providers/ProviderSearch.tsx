"use client"; 
import React, { useState } from 'react';
import Select from '@/app/ui/components/Select';
import { PROVIDER_CATEGORIES } from '@/app/constants/categories';


interface SearchFilters {
  location: string;
  category: string;
  customCategory?: string;
  sortBy: string;
}

export default function ProviderSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    category: '',
    sortBy: 'distance'
  });

  const handleFilterChange = (key: keyof SearchFilters) => (value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-text-primary font-medium mb-2">
            Location
          </label>
          <Select
            value={filters.location}
            onChange={handleFilterChange('location')}
            options={[
              { value: 'los-angeles', label: 'Los Angeles, CA' },
              // Add more options
            ]}
            placeholder="Select location"
          />
        </div>
        
        <div>
          <label className="block text-text-primary font-medium mb-2">
            Category
          </label>
          <Select
            value={filters.category}
            onChange={handleFilterChange('category')}
            options={[
              ...PROVIDER_CATEGORIES.map(category => ({
                value: category,
                label: category.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
              })),
              { value: 'other', label: 'Other (Please Specify)' }
            ]}
            placeholder="Select category"
          />
          {filters.category === 'other' && (
            <input
              type="text"
              className="mt-2 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main"
              placeholder="Please specify service type"
              value={filters.customCategory || ''}
              onChange={(e) => handleFilterChange('customCategory')(e.target.value)}
            />
          )}
        </div>
        
        <div>
          <label className="block text-text-primary font-medium mb-2">
            Sort
          </label>
          <Select
            value={filters.sortBy}
            onChange={handleFilterChange('sortBy')}
            options={[
              { value: 'distance', label: 'Distance' },
              { value: 'rating', label: 'Rating' },
              { value: 'reviews', label: 'Review Count' },
            ]}
            placeholder="Sort by"
          />
        </div>
      </div>
    </div>
  );
}