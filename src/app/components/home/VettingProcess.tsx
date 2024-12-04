import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const VettingProcess = () => {
  return (
    <div className="bg-[#f5e6c3] px-4 py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="text-sm font-medium">Trusted</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">
            Our Rigorous Vetting Process for Providers
          </h2>
          <p className="mb-8">
            We meticulously vet each service provider to ensure they uphold our standards of safety
            and respect for the LGBTQIA+ community. This thorough process guarantees that you
            receive services from professionals who are not only skilled but also sensitive to your
            needs.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/learn-more" 
              className="bg-white px-6 py-2 rounded border border-gray-300"
            >
              Learn More
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-gray-800 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              Sign Up 
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
        <div className="flex-1 relative h-[500px]">
          <Image 
            src="/api/placeholder/500/500"
            alt="Vetting process"
            fill
            className="rounded-3xl object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default VettingProcess;