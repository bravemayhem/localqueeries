import React from 'react';
import Image from 'next/image';

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
              and respect for the LGBTQIA+ community. This thorough process guarantees that you
              receive services from professionals who are not only skilled but also sensitive to your
              needs.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary-light w-full">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search filters */}
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location filter */}
              <div>
                <label className="block text-text-primary font-medium mb-2">Location</label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300">
                  <option value="" disabled selected>Select location</option>
                </select>
              </div>
              
              {/* Category filter */}
              <div>
                <label className="block text-text-primary font-medium mb-2">Category</label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300">
                  <option value="" disabled selected>Select category</option>
                </select>
              </div>
              
              {/* Sort filter */}
              <div>
                <label className="block text-text-primary font-medium mb-2">Sort</label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300">
                  <option value="" disabled selected>Sort by</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Provider list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {/* Provider cards will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}