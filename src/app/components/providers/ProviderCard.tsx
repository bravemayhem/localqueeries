"use client";

import React from 'react';
import Image from 'next/image';
import Button from '@/app/ui/components/Button';

interface ProviderCardProps {
  id: string;
  rank?: number;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  isAlly?: boolean;
  isVerified?: boolean;
  isLGBTQIA?: boolean;
  imageUrl: string;
}

export default function ProviderCard({
  rank,
  name,
  rating,
  reviewCount,
  distance,
  isAlly,
  isVerified,
  isLGBTQIA,
  imageUrl
}: ProviderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
      <div className="relative w-full md:w-48 h-48 bg-gray-100 rounded-lg">
        {rank && (
          <div className="absolute top-2 left-2 bg-primary-main text-white px-2 py-1 rounded-md">
            #{rank}
          </div>
        )}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{name}</h3>
              {isVerified && (
                <span className="text-[#0081FB] text-lg">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">{rating}</span>
              <span className="text-gray-500">{reviewCount} Reviews</span>
            </div>
            <div className="flex gap-2 mt-1">
              {isAlly && (
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-0.5 rounded-full">
                  Ally
                </span>
              )}
              {isLGBTQIA && (
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-0.5 rounded-full">
                  LGBTQIA+
                </span>
              )}
            </div>
          </div>
          <span className="text-gray-500 text-sm">Dist: {distance}</span>
        </div>
        
        <Button
          bold 
          variant="secondary"
          className="mt-4"
        >
          Submit Your Queery
        </Button>
      </div>
    </div>
  );
}