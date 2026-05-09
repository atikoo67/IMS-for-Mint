/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette
        'mint-navy': '#1F3864',
        'mint-blue': '#2E5B8A',
        'mint-light': '#4A7DB5',
        'mint-pale': '#EEF4FB',
        
        // Ethiopian Brand Palette
        'eth-green': '#078930',
        'eth-yellow': '#FCDD09',
        'eth-red': '#DA121A',
        
        // Semantic/Functional Palette
        'status-pending-bg': '#FFFBEB',
        'status-pending-text': '#92400E',
        'status-pending-dot': '#D97706',
        'status-approved-bg': '#ECFDF5',
        'status-approved-text': '#065F46',
        'status-approved-dot': '#078930',
        'status-hold-bg': '#FEF3C7',
        'status-hold-text': '#78350F',
        'status-hold-dot': '#F59E0B',
        'status-rejected-bg': '#FEF2F2',
        'status-rejected-text': '#991B1B',
        'status-rejected-dot': '#DA121A',
        'status-completed-bg': '#EFF6FF',
        'status-completed-text': '#1D4ED8',
        'status-eval-bg': '#F5F3FF',
        'status-eval-text': '#4C1D95',
        
        // Neutral Palette
        'surface-white': '#FFFFFF',
        'surface-page': '#F4F6FA',
        'surface-input': '#FAFBFD',
        'border-default': '#D6DCE8',
        'border-subtle': '#EEF1F7',
        'text-primary': '#1A2640',
        'text-muted': '#6B7A99',
        'text-hint': '#9BADC7',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        ethiopic: ['Noto Sans Ethiopic', 'sans-serif'],
      },
      fontSize: {
        'display': ['32px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['15px', { lineHeight: '1.65' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'body-sm': ['13px', { lineHeight: '1.55' }],
        'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.07em', fontWeight: '600' }],
        'caption': ['11px', { lineHeight: '1.4' }],
        'mono': ['12px', { lineHeight: '1.5' }],
      },
      spacing: {
        '2px': '2px',
        '4px': '4px',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'pill': '999px',
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(31,56,100,0.07)',
        'level-2': '0 4px 12px rgba(31,56,100,0.10)',
        'level-3': '0 8px 24px rgba(31,56,100,0.14)',
        'focus': '0 0 0 3px rgba(46,91,138,0.22)',
      },
    },
  },
  plugins: [],
}
