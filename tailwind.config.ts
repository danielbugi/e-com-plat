import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Rubik"', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        bbh: ['"Rubik"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Luxury jewelry color palette
        steel: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0d1117',
          950: '#080a0d',
        },
        gold: {
          50: '#fffef5',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#d4a574',
          600: '#c89550',
          700: '#b8860b',
          800: '#9a7b4f',
          900: '#6b5d3f',
          950: '#4a4233',
        },
        champagne: {
          50: '#fdfbf7',
          100: '#f9f5ed',
          200: '#f2ebd9',
          300: '#e8ddc3',
          400: '#d9c8a8',
          500: '#cab38d',
          600: '#b89968',
          700: '#9a7b4f',
          800: '#7a6240',
          900: '#5c4a32',
        },
        pearl: {
          50: '#ffffff',
          100: '#fefefe',
          200: '#fcfcfc',
          300: '#f8f8f8',
          400: '#f0f0f0',
          500: '#e8e8e8',
          600: '#d4d4d4',
          700: '#a8a8a8',
          800: '#7c7c7c',
          900: '#505050',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-steel': 'linear-gradient(135deg, #1a1d23 0%, #2d3748 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4a574 0%, #b8860b 100%)',
        'gradient-luxury':
          'linear-gradient(135deg, #0d1117 0%, #2d3748 50%, #1a1d23 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in': 'slide-in 0.4s ease-out',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
