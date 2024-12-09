// Form-related props

export interface InputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export interface FormProps<T = Record<string, unknown>> {
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  className?: string;
}