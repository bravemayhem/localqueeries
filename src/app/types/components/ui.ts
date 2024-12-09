// UI component props

export interface SelectOption {
    value: string;
    label: string;
  }
  
  export interface SelectProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    className?: string;
  }
  
  export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
    bold?: boolean;
    className?: string;
    disabled?: boolean;
  }