// Stat/Metric Card Component - MInT IMS Design System
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  accentColor?: 'green' | 'blue' | 'amber' | 'red';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  accentColor = 'blue',
  className = '',
}) => {
  const accentColors = {
    green: 'border-t-eth-green',
    blue: 'border-t-mint-blue',
    amber: 'border-t-status-pending-dot',
    red: 'border-t-eth-red',
  };

  const deltaColors = {
    positive: 'text-eth-green',
    negative: 'text-eth-red',
    neutral: 'text-text-muted',
  };

  const deltaIcons = {
    positive: '↑',
    negative: '↓',
    neutral: '',
  };

  return (
    <div
      className={`
        bg-surface-white rounded-md border border-border-default
        shadow-level-1 p-5 border-t-[3px] ${accentColors[accentColor]}
        ${className}
      `}
    >
      <p className="text-label uppercase text-text-muted tracking-wider mb-2">
        {label}
      </p>
      <p className="text-[28px] font-bold text-text-primary leading-none">
        {value}
      </p>
      {delta && (
        <p className={`text-xs mt-1.5 ${deltaColors[delta.type]}`}>
          {deltaIcons[delta.type]} {delta.value}
        </p>
      )}
    </div>
  );
};
