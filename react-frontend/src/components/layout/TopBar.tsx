import React, { useState } from 'react';

interface TopBarProps {
  title: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
  unreadCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  breadcrumb, 
  actions,
  unreadCount = 0 
}) => {
  const [language, setLanguage] = useState<'EN' | 'አማ'>('EN');

  return (
    <header className="h-[54px] bg-surface-white border-b border-border-default px-6 flex items-center justify-between">
      {/* Left: Title and Breadcrumb */}
      <div>
        <h1 className="text-h3 text-text-primary">{title}</h1>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            {breadcrumb.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className="text-xs text-text-muted">{crumb}</span>
                {index < breadcrumb.length - 1 && (
                  <span className="text-xs text-text-muted">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions and Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input (optional - can be added later) */}
        
        {/* Notification Bell */}
        <button className="relative p-2 text-text-muted hover:text-text-primary transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-eth-red rounded-full" />
          )}
        </button>

        {/* Language Toggle */}
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          <button
            onClick={() => setLanguage('EN')}
            className={`px-2 py-1 rounded transition-colors ${
              language === 'EN' 
                ? 'text-mint-blue bg-mint-pale' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            EN
          </button>
          <span className="text-text-hint">|</span>
          <button
            onClick={() => setLanguage('አማ')}
            className={`px-2 py-1 rounded transition-colors font-ethiopic ${
              language === 'አማ' 
                ? 'text-mint-blue bg-mint-pale' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            አማ
          </button>
        </div>

        {/* Actions (e.g., primary CTA button) */}
        {actions && <div>{actions}</div>}
      </div>
    </header>
  );
};
