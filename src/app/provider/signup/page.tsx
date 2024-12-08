"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    category: '',
    services: [],
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create provider');

      router.push('/provider/dashboard');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Provider Sign Up</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Business Name</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              businessName: e.target.value
            }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        {/* Add more form fields for other provider data */}
      </div>

      <button
        type="submit"
        className="mt-6 bg-primary-main text-white px-6 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}