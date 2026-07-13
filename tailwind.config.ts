import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C7F2A',
          50: '#F1F8E9',
          100: '#DFEEC5',
          200: '#C3E09A',
          300: '#A0CC6C',
          400: '#7DB349',
          500: '#4C7F2A',
          600: '#3D6A20',
          700: '#2F5419',
          800: '#234011',
          900: '#0F4E19',
        },
        secondary: {
          DEFAULT: '#8BA34A',
          50: '#F6F9EE',
          100: '#E9F0D6',
          200: '#D3E1AE',
          300: '#B7CE82',
          400: '#A2BF63',
          500: '#8BA34A',
          600: '#6F8339',
          700: '#56652D',
          800: '#405021',
          900: '#2C3B16',
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FFFAEB',
          100: '#FEF0C7',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#F59E0B',
          600: '#DC7609',
          700: '#B65409',
          800: '#93400E',
          900: '#79350F',
        },
        success: '#22C55E',
        danger: '#EF4444',
        surface: {
          DEFAULT: '#FAFAFA',
          dark: '#0F172A',
        },
        ink: {
          DEFAULT: '#111827',
          soft: '#374151',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.25', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.25rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(17, 24, 39, 0.06), 0 4px 16px -4px rgba(17, 24, 39, 0.06)',
        card: '0 4px 20px -4px rgba(17, 24, 39, 0.08), 0 2px 8px -2px rgba(17, 24, 39, 0.04)',
        lifted: '0 20px 40px -12px rgba(17, 24, 39, 0.18)',
        glow: '0 0 0 1px rgba(76, 127, 42, 0.1), 0 8px 24px -4px rgba(76, 127, 42, 0.28)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4C7F2A 0%, #0F4E19 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #7DB349 100%)',
        'gradient-radial-soft': 'radial-gradient(circle at 30% 20%, rgba(76,127,42,0.12), transparent 60%)',
        'gradient-dark': 'linear-gradient(135deg, #0B2E10 0%, #16471E 100%)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
