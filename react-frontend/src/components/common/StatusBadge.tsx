// Status badge component - MInT IMS Design System
import React from 'react';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'on-hold' | 'rejected' | 'completed' | 'evaluation' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalizedStatus = status.toLowerCase().replace(/_/g, '-');
  
  const getStatusStyles = () => {
    switch (normalizedStatus) {
      case 'approved':
        return {
          bg: 'bg-status-approved-bg',
          text: 'text-status-approved-text',
          border: 'border-[#A7F3D0]',
          dot: 'bg-status-approved-dot',
          label: 'APPROVED'
        };
      case 'pending':
        return {
          bg: 'bg-status-pending-bg',
          text: 'text-status-pending-text',
          border: 'border-[#FDE68A]',
          dot: 'bg-status-pending-dot',
          label: 'PENDING'
        };
      case 'on-hold':
      case 'hold':
        return {
          bg: 'bg-status-hold-bg',
          text: 'text-status-hold-text',
          border: 'border-[#FCD34D]',
          dot: 'bg-status-hold-dot',
          label: 'ON HOLD'
        };
      case 'rejected':
        return {
          bg: 'bg-status-rejected-bg',
          text: 'text-status-rejected-text',
          border: 'border-[#FECACA]',
          dot: 'bg-status-rejected-dot',
          label: 'REJECTED'
        };
      case 'completed':
        return {
          bg: 'bg-status-completed-bg',
          text: 'text-status-completed-text',
          border: 'border-[#BFDBFE]',
          dot: 'bg-mint-blue',
          label: 'COMPLETED'
        };
      case 'evaluation':
      case 'under-review':
        return {
          bg: 'bg-status-eval-bg',
          text: 'text-status-eval-text',
          border: 'border-[#DDD6FE]',
          dot: 'bg-[#7C3AED]',
          label: 'EVALUATION'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          dot: 'bg-gray-500',
          label: status.toUpperCase()
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill
        text-label uppercase tracking-wider
        border ${styles.border} ${styles.bg} ${styles.text}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {styles.label}
    </span>
  );
};
