/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff9800',
          dark: '#f57c00',
          light: '#ffb74d',
          muted: 'rgba(255, 152, 0, 0.12)',
        },
        background: {
          DEFAULT: '#f5f5f5',
          dark: '#121212',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e1e1e',
          elevated: '#f9f9f9',
          'elevated-dark': '#252525',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1c1c1e',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          dark: 'rgba(255, 255, 255, 0.08)',
        },
        muted: {
          DEFAULT: '#666666',
          dark: '#999999',
          light: '#757575',
          foreground: '#666666',
          'foreground-dark': '#999999',
        },
        destructive: {
          DEFAULT: '#d32f2f',
          dark: '#ef5350',
          muted: 'rgba(211, 47, 47, 0.12)',
        },
        success: {
          DEFAULT: '#2e7d32',
          dark: '#4caf50',
          muted: 'rgba(46, 125, 50, 0.12)',
        },
        warning: {
          DEFAULT: '#ed6c02',
          dark: '#ffa726',
          muted: 'rgba(237, 108, 2, 0.12)',
        },
        info: {
          DEFAULT: '#1976d2',
          dark: '#42a5f5',
          muted: 'rgba(25, 118, 210, 0.12)',
        },
      },
    },
  },
  plugins: [],
};
