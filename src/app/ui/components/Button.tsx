import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  className = ''
}: ButtonProps) {
  return (
    <button 
      className={`px-4 py-2 rounded-md transition-colors ${
        variant === 'primary' 
          ? 'bg-teal-700 text-white hover:bg-teal-800' 
          : 'bg-[#f5e6c3] text-gray-800 hover:bg-[#e6d4b0]'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}