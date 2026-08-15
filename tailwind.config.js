/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Single fixed calming palette — no dark mode / theme switching in v1
        // (a light/dark flip mid-panic-episode would work against the app's
        // purpose). See PROJECT.md for the reasoning.
        accent: 'rgb(var(--accent) / <alpha-value>)',
        background: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
        body: 'rgb(var(--body) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
