import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
    value?: string;  // Add this line
    options: SelectOption[];
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
  }

export default function Select({ 
  value,
  options, 
  placeholder, 
  onChange,
  className = ''
}: SelectProps) {
  return (
    <select
      value={value || ''}
      className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main ${className}`}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {placeholder && (
        <option value=""> 
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}