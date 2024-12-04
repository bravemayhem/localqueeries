import React from 'react';

export default function FindProvider() {
  return (
    <div className="container-padding section-padding">
      <div className="mb-12">
        <span className="text-sm font-medium text-primary-main">Trusted</span>
        <h1 className="text-3xl font-bold mt-2 mb-4">
          Select a Queer Friendly Provider
        </h1>
        <p className="text-text-secondary max-w-2xl">
          We meticulously vet each service provider to ensure they uphold our standards of safety
          and respect for the LGBTQIA+ community. This thorough process guarantees that you
          receive services from professionals who are not only skilled but also sensitive to your
          needs.
        </p>
      </div>
      
      {/* Search filters */}
      <div className="bg-primary-light p-6 rounded-lg mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provider cards will go here */}
      </div>
    </div>
  );
}