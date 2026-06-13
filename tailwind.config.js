/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080c18',
          card: '#0d1421',
          elevated: '#111827',
        },
        gold: {
          DEFAULT: '#ffd700',
          dim: '#cc9a00',
        },
        accent: {
          blue: '#3b82f6',
          green: '#22c55e',
          red: '#ef4444',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
        },
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['48px', { lineHeight: '1.05', fontWeight: '700' }],
        section: ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        cardtitle: ['16px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255,215,0,0.35)',
        'gold-glow-lg': '0 0 40px rgba(255,215,0,0.45)',
        'blue-glow': '0 0 20px rgba(59,130,246,0.35)',
        card: '0 8px 30px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'live-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(239,68,68,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'score-pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        ticker: 'ticker 40s linear infinite',
        'score-pop': 'score-pop 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
