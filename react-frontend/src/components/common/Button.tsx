// Reusable Button component - MInT IMS Design System
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-mint-blue focus:ring-opacity-20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100';
  
  const variantStyles = {
    primary: 'bg-mint-navy text-white hover:bg-mint-blue border-none',
    secondary: 'bg-surface-white text-text-primary border border-border-default hover:bg-surface-page hover:border-[#B8C3D8]',
    danger: 'bg-eth-red text-white hover:bg-[#B91C1C] border-none',
    ghost: 'bg-transparent text-mint-blue hover:bg-mint-pale border-none',
    success: 'bg-eth-green text-white hover:bg-[#065F46] border-none',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-[13px] h-[36px]',
    md: 'px-5 py-2.5 text-body h-[42px]',
    lg: 'px-6 py-3 text-body-lg h-[48px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${widthStyle}
        ${className}
        inline-flex items-center justify-center gap-2
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="text-base">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
