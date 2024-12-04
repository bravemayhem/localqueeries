import React from 'react';
import Link from 'next/link';

const Footer = () => {
 return (
   <footer className="bg-teal-700 text-white py-12">
     <div className="max-w-6xl mx-auto px-4">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div>
           <div className="text-xl font-bold mb-4">Local Queeries</div>
           <div className="space-y-2">
             <p className="font-medium">Address:</p>
             <p>SHHH Can&apos;t Tell</p>
             <p className="font-medium mt-4">Contact:</p>
             <p>shhh@localqueeries.com</p>
           </div>
           <div className="flex gap-4 mt-6">
             <a href="#" aria-label="Facebook" className="hover:text-gray-200">FB</a>
             <a href="#" aria-label="Instagram" className="hover:text-gray-200">IG</a>
             <a href="#" aria-label="Twitter" className="hover:text-gray-200">X</a>
             <a href="#" aria-label="LinkedIn" className="hover:text-gray-200">LI</a>
             <a href="#" aria-label="YouTube" className="hover:text-gray-200">YT</a>
           </div>
         </div>
         <div className="space-y-4">
           <Link href="#" className="block hover:text-gray-200">Community Support</Link>
           <Link href="#" className="block hover:text-gray-200">Service Providers</Link>
           <Link href="#" className="block hover:text-gray-200">Get Involved</Link>
           <Link href="#" className="block hover:text-gray-200">Help Center</Link>
           <Link href="#" className="block hover:text-gray-200">Blog Updates</Link>
         </div>
         <div className="space-y-4">
           <Link href="#" className="block hover:text-gray-200">Join Us</Link>
           <Link href="#" className="block hover:text-gray-200">Testimonials</Link>
           <Link href="#" className="block hover:text-gray-200">FAQs</Link>
           <Link href="#" className="block hover:text-gray-200">Contact Us</Link>
           <Link href="#" className="block hover:text-gray-200">Follow Us</Link>
         </div>
       </div>
     </div>
   </footer>
 );
};

export default Footer;