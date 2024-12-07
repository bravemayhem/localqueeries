import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  bold?: boolean;
  useAgbalumo?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  bold = false,
  useAgbalumo = false
}: ButtonProps) {
  return (
    <button 
      className={`px-4 py-2 rounded-md transition-colors ${
        variant === 'primary' 
          ? 'bg-teal-700 text-white hover:bg-teal-800' 
          : 'bg-[#CB6040] text-white hover:bg-[#E07A5C]'
      } ${bold ? 'font-medium' : ''} ${useAgbalumo ? 'font-agbalumo' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}