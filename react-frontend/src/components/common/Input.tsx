// Reusable Input component with validation - MInT IMS Design System
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#374151] mb-1.5">
          {label}
          {props.required && <span className="text-eth-red ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full h-[42px] rounded-lg border transition-all
            text-body text-text-primary placeholder:text-text-hint
            focus:outline-none focus:ring-4 focus:ring-mint-blue focus:ring-opacity-20
            disabled:bg-surface-page disabled:text-text-hint disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${rightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-eth-red bg-surface-white focus:border-eth-red' 
              : 'border-border-default bg-surface-input focus:bg-surface-white focus:border-mint-blue'
            }
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-[#991B1B]">{error}</p>}
      {helperText && !error && <p className="mt-1 text-caption text-text-muted">{helperText}</p>}
    </div>
  );
};
