"use client"; 
import React, { useState } from 'react';
import Select from '@/app/ui/components/Select';

interface SearchFilters {
  location: string;
  category: string;
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
              { value: 'painting', label: 'Painting' },
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'carpentry', label: 'Carpentry' },
              // Add more options
            ]}
            placeholder="Select category"
          />
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