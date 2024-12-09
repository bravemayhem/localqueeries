import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'primary-agbalumo' | 'secondary-agbalumo';
  className?: string;
  bold?: boolean;
  disabled?: boolean;  // Add disabled prop
  'aria-busy'?: boolean;  // Add aria-busy prop
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  bold = false,
}: ButtonProps) {
  const getVariantClasses = () => {
    switch(variant) {
      case 'primary':
        return 'bg-teal-700 text-white hover:bg-teal-800';
      case 'secondary':
        return 'bg-[#CB6040] text-white hover:bg-[#E07A5C]';
      case 'primary-agbalumo':
        return 'bg-teal-700 text-white hover:bg-teal-800 font-agbalumo';
      case 'secondary-agbalumo':
        return 'bg-[#CB6040] text-white hover:bg-[#E07A5C] font-agbalumo';
      default:
        return 'bg-teal-700 text-white hover:bg-teal-800';
    }
  };

  return (
    <button 
      className={`px-4 py-2 rounded-md transition-colors ${getVariantClasses()} ${
        bold ? 'font-medium' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}