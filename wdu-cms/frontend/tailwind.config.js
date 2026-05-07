/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#15803d",
        "on-primary": "#ffffff",
        "primary-container": "#166534",
        "on-primary-container": "#bbf7d0",
        "primary-fixed": "#dcfce7",
        "on-primary-fixed": "#052e16",
        "primary-fixed-dim": "#86efac",
        "on-primary-fixed-variant": "#14532d",

        "secondary": "#166534",
        "on-secondary": "#ffffff",
        "secondary-container": "#166534",
        "on-secondary-container": "#fefcff",
        "secondary-fixed": "#dcfce7",
        "on-secondary-fixed": "#052e16",
        "secondary-fixed-dim": "#86efac",
        "on-secondary-fixed-variant": "#166534",

        "tertiary": "#14532d",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#14532d",
        "on-tertiary-container": "#166534",
        "tertiary-fixed": "#dcfce7",
        "on-tertiary-fixed": "#052e16",
        "tertiary-fixed-dim": "#86efac",
        "on-tertiary-fixed-variant": "#166534",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        "outline": "#757684",
        "outline-variant": "#c4c5d5",

        "surface": "#f8f9fa",
        "on-surface": "#191c1d",
        "surface-variant": "#e1e3e4",
        "on-surface-variant": "#444653",
        "inverse-surface": "#2e3132",
        "inverse-on-surface": "#f0f1f2",
        "surface-bright": "#f8f9fa",
        "surface-dim": "#d9dadb",
        "surface-tint": "#166534",

        "surface-container": "#edeeef",
        "surface-container-low": "#f3f4f5",
        "surface-container-high": "#e7e8e9",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#e1e3e4",

        "background": "#f8f9fa",
        "on-background": "#191c1d",

        // Add stone for compatibility with base styles
        stone: {
          50: '#F9F8F7',
          100: '#F2F1EF',
          200: '#E5E3DF',
          300: '#D6D3CD',
          400: '#BDB9AF',
          500: '#A39E91',
          600: '#898374',
          700: '#6C675B',
          800: '#4F4B42',
          900: '#32302A',
          950: '#1C1B17',
        }
      },
      spacing: {
        "xs": "4px",
        "margin": "32px",
        "base": "4px",
        "lg": "24px",
        "xl": "32px",
        "gutter": "24px",
        "sm": "8px",
        "md": "16px"
      },
      fontFamily: {
        "headline": ["Inter", "Outfit", "sans-serif"],
        "body": ["Inter", "Outfit", "sans-serif"],
        "label": ["Inter", "Outfit", "sans-serif"],
        "sans": ["Inter", "Outfit", "sans-serif"],
        "h1": ["Inter"],
        "h2": ["Inter"],
        "h3": ["Inter"],
        "button": ["Inter"],
        "body-lg": ["Inter"],
        "label-sm": ["Inter"],
        "body-md": ["Inter"]
      },
      fontSize: {
        "body-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0", "fontWeight": "400"}],
        "h1": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "h2": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "h3": ["20px", {"lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "button": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "600"}],
        "body-lg": ["16px", {"lineHeight": "24px", "letterSpacing": "0", "fontWeight": "400"}],
        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}]
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}