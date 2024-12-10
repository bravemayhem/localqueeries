'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e6c3] px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-teal-700 mb-4">
          Something went wrong!
        </h2>
        <button
          onClick={reset}
          className="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 