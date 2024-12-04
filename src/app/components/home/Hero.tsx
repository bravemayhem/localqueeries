import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative h-[500px]">
      <div className="absolute inset-0">
        <Image 
          src="/images/manworking.jpg" // Update this path to your image
          alt="LGBTQIA+ friendly home services"
          fill
          className="object-cover"
          priority
          quality={100} // Optional: adjust image quality (default is 75)
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-center">
        <div className="bg-white/90 p-8 rounded-lg max-w-xl">
          <h1 className="text-3xl font-bold mb-4">
            Connecting You with Trusted LGBTQIA+ Service Providers
          </h1>
          <p className="mb-6 text-gray-800">
            At Local Queeries, we empower LGBTQIA+ individuals by connecting them with
            verified service providers who prioritize safety and inclusivity. Experience peace of
            mind knowing that every professional in our directory is committed to creating a
            welcoming environment in your home.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/learn-more" 
              className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition-colors"
            >
              Learn More
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-[#f5e6c3] text-teal-700 px-6 py-2 rounded hover:bg-[#e6d4b0] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;