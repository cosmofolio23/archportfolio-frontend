import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - refined teal/blue
        primary: '#0D47A1',
        'primary-light': '#1976D2',
        'primary-lighter': '#42A5F5',
        secondary: '#01579B',

        // Accent - sophisticated gold/amber
        accent: '#B8860B',
        'accent-light': '#DAA520',

        // Architectural grays - sophisticated neutral palette
        charcoal: '#1A1A1A',
        slate: '#2D3E50',
        'slate-light': '#455A64',
        stone: '#78909C',
        'stone-light': '#90A4AE',
        ash: '#BDBDBD',
        cream: '#F5F5F0',

        // Functional colors
        success: '#2E7D32',
        warning: '#F57C00',
        error: '#C62828',
        info: '#0277BD',

        // State colors
        'border-light': '#E0E0E0',
        'bg-subtle': '#FAFAF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevation-4': '0 15px 35px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'subtle-lift': 'subtleLift 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        subtleLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
