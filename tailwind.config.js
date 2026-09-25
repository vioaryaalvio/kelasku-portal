/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0F172A',
        foreground: '#020617',
        muted: '#475569',
        'muted-bg': '#E8ECF1',
        surface: '#F8FAFC',
        card: '#ffffff',
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#1E40AF',
          700: '#1E3A8A',
        },
        border: '#E2E8F0',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.06)',
        subtle: '0 1px 2px rgba(15,23,42,0.06)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}
