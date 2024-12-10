"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProviderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast('Coming Soon! 🚀', {
      style: {
        background: '#115e59',
        color: '#f5e6c3',
        fontWeight: 'bold',
      },
      duration: 2000,
    });
  };

  return (
    <nav className="bg-teal-700 p-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/logo.png"
            alt="Local Queeries Logo"
            width={101}
            height={58}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link 
            href="/" 
            className="text-[#f5e6c3] hover:text-[#e6d4b0] transition-colors text-lg font-medium"
          >
            Home
          </Link>
          <Link 
            href="/find-provider" 
            className="text-[#f5e6c3] hover:text-[#e6d4b0] transition-colors text-lg font-medium"
          >
            Find Provider
          </Link>
          <button 
            onClick={handleProviderClick}
            className="border-2 border-[#f5e6c3] text-[#f5e6c3] px-6 py-2 rounded-full 
              hover:bg-[#f5e6c3] hover:text-teal-700 transition-all duration-200
              text-lg font-medium"
          >
            Become a Provider
          </button>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-white p-2 hover:bg-teal-800 rounded transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          />
        )}

        {/* Mobile Navigation Slide-out */}
        <div
          className={`
            fixed top-0 left-0 h-full w-[80%] max-w-sm
            bg-teal-700 z-50 transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:hidden
          `}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMenu}
              className="text-white p-2 hover:bg-teal-800 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-6 space-y-6">
            <Link 
              href="/" 
              className="block w-full text-[#f5e6c3] text-xl p-3 rounded-md 
                hover:bg-teal-800 transition-all duration-200 ease-in-out"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              href="/find-provider" 
              className="block w-full text-[#f5e6c3] text-xl p-3 rounded-md 
                hover:bg-teal-800 transition-all duration-200 ease-in-out"
              onClick={toggleMenu}
            >
              Find Provider
            </Link>
            <button 
              onClick={handleProviderClick}
              className="block w-full text-[#f5e6c3] text-xl p-3 rounded-md 
                border-2 border-[#f5e6c3] text-center
                hover:bg-[#f5e6c3] hover:text-teal-700 transition-all duration-200"
            >
              Become a Provider
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;