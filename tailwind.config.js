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
          DEFAULT: '#1F2421',
          light: '#3A423D',
          muted: '#667069',
          faint: '#8F9992',
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
        'soft': '0 4px 20px -2px rgba(36, 61, 50, 0.06), 0 2px 6px -1px rgba(36, 61, 50, 0.04)',
        'card': '0 10px 30px -4px rgba(36, 61, 50, 0.08), 0 4px 10px -2px rgba(36, 61, 50, 0.03)',
        'elevated': '0 20px 40px -6px rgba(36, 61, 50, 0.12), 0 8px 16px -4px rgba(36, 61, 50, 0.06)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
