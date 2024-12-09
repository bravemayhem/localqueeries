import React, { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { AddressSuggestion, LocationError } from '@/app/types/location';
import { LocationSearchProps } from '@/app/types/provider';

export default function LocationSearch({ onLocationSelect, error, setError }: LocationSearchProps) {
  const [addressInput, setAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // ... rest of the component

  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setError(query.length > 0 ? 'Please enter at least 3 characters' : null);
      return;
    }

    if (isAddressLoading) return;

    setIsAddressLoading(true);
    setError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

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
      const fetchError = error as LocationError;
      setError(
        fetchError.name === 'AbortError' 
          ? 'Search took too long. Please try again.' 
          : 'Failed to search address. Please try again.'
      );
    } finally {
      setIsAddressLoading(false);
    }
  }, [isAddressLoading, setError]);

  const debouncedSearchAddress = useMemo(
    () => debounce(searchAddress, 1000),
    [searchAddress]
  );

  const handleAddressSelect = (address: AddressSuggestion) => {
    onLocationSelect({
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

  return (
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
  );
} 