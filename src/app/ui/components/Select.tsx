interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  suppressHydrationWarning?: boolean;
  className?: string;
}

export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  suppressHydrationWarning,
  className = ''
}: SelectProps) {
  return (
    <select
      id={id}
      value={value || ''}
      className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main ${className}`}
      onChange={(e) => onChange?.(e.target.value)}
      suppressHydrationWarning={suppressHydrationWarning}
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