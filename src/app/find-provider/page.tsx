"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ProviderSearch from '@/app/components/providers/ProviderSearch';
import ProviderCard from '@/app/components/providers/ProviderCard';
import { Location } from '@/app/types/location';
import { toast } from 'react-hot-toast';

interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: number | null;
  isAlly: boolean;
  isVerified: boolean;
  isLGBTQIA: boolean;
  imageUrl: string;
}

interface SearchFilters {
  location: Location;
  category: string;
  customCategory?: string;
  sortBy: string;
}

export default function FindProvider() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        category: filters.category,
        location: filters.location.address,
        latitude: filters.location.coordinates.lat.toString(),
        longitude: filters.location.coordinates.lng.toString(),
        sortBy: filters.sortBy,
      });

      console.log('Sending request with params:', params.toString());
      
      const response = await fetch(`/api/providers?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from server');
      }

      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', {
        name: error instanceof Error ? error.name : 'Unknown error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(error instanceof Error ? error.message : 'Failed to fetch providers');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDistance = (distance: number | null): string => {
    if (distance === null) return 'Distance unavailable';
    return `${distance.toFixed(1)} miles`;
  };

  return (
    <div>
      <div className="relative h-[400px] sm:h-[350px] w-full">
        <div className="absolute inset-0">
          <Image 
            src="/images/manworking.jpg"
            alt="LGBTQIA+ friendly home services"
            fill
            className="object-cover w-full"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="bg-white/90 p-4 sm:p-6 md:p-8 rounded-lg max-w-xl">
            <span className="text-sm font-medium text-primary-main">Trusted</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 mb-2 sm:mb-3">
              Select a Queer Friendly Provider
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              We meticulously vet each service provider to ensure they uphold our standards of safety
              and respect for the LGBTQIA+ community.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary-light w-full">
        <div className="max-w-7xl mx-auto px-4">
          <ProviderSearch onSearch={handleSearch} />
          
          {error && (
            <div className="text-red-600 text-center py-4">{error}</div>
          )}
          
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  {...provider}
                  distance={formatDistance(provider.distance)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}