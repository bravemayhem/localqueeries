"use client";

import { useState, useEffect } from 'react';

interface Provider {
  id: string;
  name: string;
  category: string;
  isVerified: boolean;
  email: string;
  phone?: string;
  imageUrl?: string;
  businessName?: string;
  isAlly: boolean;
  isLGBTQIA: boolean;
  rating: number;
  reviewCount: number;
}

export default function AdminProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await fetch('/api/providers');
      const data = await response.json();
      setProviders(data);
    };

    fetchProviders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Providers</h1>
      
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.name}</td>
              <td>{provider.category}</td>
              <td>{provider.isVerified ? 'Verified' : 'Pending'}</td>
              <td>
                {/* Add edit/delete actions */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}