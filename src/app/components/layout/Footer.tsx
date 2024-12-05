import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
 return (
   <footer className="bg-teal-700 text-white py-6">
     <div className="max-w-6xl mx-auto px-4">
       {/* Logo Section */}
       <div className="mb-4">  {/* Added margin bottom for spacing */}
         <Image 
           src="/images/logo.png"
           alt="Local Queeries Logo"
           width={123}
           height={75.17}
           className="object-contain"
         />
       </div>

       {/* Links Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {/* Contact Info */}
         <div className="space-y-2">
           <p className="font-medium">Address:</p>
           <p>SHHH Can&apos;t Tell</p>
           <p className="font-medium mt-4">Contact:</p>
           <p>shhh@localqueeries.com</p>
           <div className="flex gap-4 mt-6">
             <a href="#" aria-label="Facebook" className="hover:text-gray-200">FB</a>
             <a href="#" aria-label="Instagram" className="hover:text-gray-200">IG</a>
             <a href="#" aria-label="Twitter" className="hover:text-gray-200">X</a>
             <a href="#" aria-label="LinkedIn" className="hover:text-gray-200">LI</a>
             <a href="#" aria-label="YouTube" className="hover:text-gray-200">YT</a>
           </div>
         </div>

         {/* Links Columns */}
         <div className="space-y-4">
           <Link href="#" className="block hover:text-gray-200">Community Support</Link>
           <Link href="#" className="block hover:text-gray-200">Service Providers</Link>
           <Link href="#" className="block hover:text-gray-200">Get Involved</Link>
         </div>

         <div className="space-y-4">
           <Link href="#" className="block hover:text-gray-200">Help Center</Link>
           <Link href="#" className="block hover:text-gray-200">Blog Updates</Link>
           <Link href="#" className="block hover:text-gray-200">Resources</Link>
         </div>

         <div className="space-y-4">
           <Link href="#" className="block hover:text-gray-200">About Us</Link>
           <Link href="#" className="block hover:text-gray-200">Privacy Policy</Link>
           <Link href="#" className="block hover:text-gray-200">Terms of Service</Link>
         </div>
       </div>
     </div>
   </footer>
 );
};

export default Footer;