// Reusable Card component - MInT IMS Design System
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accentColor?: 'green' | 'blue' | 'amber' | 'red' | 'none';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  actions,
  padding = 'md',
  accentColor = 'none'
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const accentStyles = {
    green: 'border-t-[3px] border-t-eth-green',
    blue: 'border-t-[3px] border-t-mint-blue',
    amber: 'border-t-[3px] border-t-status-pending-dot',
    red: 'border-t-[3px] border-t-eth-red',
    none: '',
  };

  return (
    <div className={`
      bg-surface-white rounded-md border border-border-default 
      shadow-level-1 overflow-hidden
      ${accentStyles[accentColor]}
      ${className}
    `}>
      {(title || actions) && (
        <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
          {title && <h3 className="text-h2 text-text-primary">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
};
