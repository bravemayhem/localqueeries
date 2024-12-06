"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navigation = () => {
 return (
   <nav className="bg-teal-700 p-4 flex justify-between items-center">
     <div className="flex items-center">
       <Link href="/" className="flex items-center">
         <Image 
           src="/images/logo.png"
           alt="Local Queeries Logo"
           width={101}  // Adjust these values based on your logo size
           height={58}  // Adjust these values based on your logo size
           className="object-contain"
         />
       </Link>
     </div>
     <div className="flex gap-2 sm:gap-4">
       <Link 
         href="/" 
         className="bg-[#f5e6c3] px-4 sm:px-8 py-1.5 sm:py-2 rounded-md font-medium hover:bg-[#e6d4b0] transition-colors text-sm sm:text-base flex items-center justify-center min-w-[80px] sm:min-w-[120px]"
       >
         Home
       </Link>
       <Link 
         href="/find-provider" 
         className="bg-[#f5e6c3] px-4 sm:px-8 py-1.5 sm:py-2 rounded-md font-medium hover:bg-[#e6d4b0] transition-colors text-sm sm:text-base flex items-center justify-center min-w-[120px] sm:min-w-[160px]"
       >
         Find Provider
       </Link>
     </div>
   </nav>
 );
};

export default Navigation;