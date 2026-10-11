/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F3EB',
          light: '#FCFAF6',
          dark: '#EBE4D5',
          border: '#E2D9C5',
        },
        forest: {
          DEFAULT: '#243D32',
          light: '#315243',
          dark: '#172720',
          hover: '#1B2E26',
        },
        caramel: {
          DEFAULT: '#D9A777',
          light: '#E7C3A0',
          dark: '#BF8955',
          soft: '#F4E8DC',
        },
        sage: {
          DEFAULT: '#E3E9DD',
          light: '#F1F5ED',
          dark: '#C8D5BE',
          border: '#D2DDC8',
        },
        charcoal: {
          DEFAULT: '#191D19',
          light: '#2D322E',
          muted: '#777A72',
          faint: '#9Ea19A',
        },
        crowd: {
          empty: '#10B981',       // Green
          comfortable: '#F59E0B', // Amber
          busy: '#EA580C',        // Orange
          packed: '#DC2626',      // Red
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(25, 29, 25, 0.04), 0 2px 6px -1px rgba(25, 29, 25, 0.03)',
        'card': '0 12px 32px -4px rgba(25, 29, 25, 0.07), 0 4px 12px -2px rgba(25, 29, 25, 0.03)',
        'elevated': '0 24px 48px -8px rgba(25, 29, 25, 0.12), 0 8px 20px -4px rgba(25, 29, 25, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
