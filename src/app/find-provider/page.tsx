import React from 'react';
import Image from 'next/image';
import ProviderSearch from '@/app/components/providers/ProviderSearch';
import ProviderCard from '@/app/components/providers/ProviderCard';

// Mock data - replace with actual data fetching
const mockProviders = [
    {
      id: '1',
      rank: 1,
      name: "Eric's Carpentry",
      rating: 4.8,
      reviewCount: 24,
      distance: '2.30 miles',
      isAlly: true,
      imageUrl: '/images/carpentry.jpg'
    },
    {
      id: '2',
      rank: 2,
      name: "Sarah's Plumbing",
      rating: 4.9,
      reviewCount: 18,
      distance: '3.10 miles',
      imageUrl: '/images/carpentry.jpg',
      isVerified: true
    },
  ];


  export default function FindProvider() {
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
            <ProviderSearch />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              {mockProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  {...provider}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }