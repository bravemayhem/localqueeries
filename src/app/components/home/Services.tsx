import React from 'react';
import { Package } from 'lucide-react';

const Services = () => {
  return (
    <div className="bg-[#f5e6c3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-black">Discover Our Trusted Home Service Providers</h2>
          <p className="max-w-2xl mx-auto text-black">
            At Local Queeries, we connect you with skilled professionals who prioritize your comfort and
            safety. Enjoy a seamless experience with service providers who respect and understand your
            unique needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Reliable Services",
              description: "Our vetted providers ensure quality and respect in every job."
            },
            {
              title: "Tailored to Your Comfort",
              description: "From repairs to installations, our handymen are here for you."
            },
            {
              title: "Safe and Welcoming Home Interactions",
              description: "Experience peace of mind with our trusted providers."
            }
          ].map((service, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <Package className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">{service.title}</h3>
              <p className="text-black">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;