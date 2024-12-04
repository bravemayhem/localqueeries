"use client";
import React from 'react';
import Link from 'next/link';

const Navigation = () => {
 return (
   <nav className="bg-teal-700 p-4 flex justify-between items-center">
     <div className="flex items-center">
       <Link href="/" className="text-white font-bold text-xl">
         Local Queeries
       </Link>
     </div>
     <div className="flex gap-4">
       <Link 
         href="/" 
         className="bg-[#f5e6c3] px-8 py-2 rounded-md font-medium hover:bg-[#e6d4b0] transition-colors"
       >
         Home
       </Link>
       <Link 
         href="/find-provider" 
         className="bg-[#f5e6c3] px-8 py-2 rounded-md font-medium hover:bg-[#e6d4b0] transition-colors"
       >
         Find Provider
       </Link>
     </div>
   </nav>
 );
};

export default Navigation;