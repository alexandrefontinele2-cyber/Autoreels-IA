/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#607D8B", // Azul Acinzentado - Cor principal/Acentos
        "brand-gold": "#C9A96E",    // Dourado Champanhe - Destaques, Badges e CTAs
        "brand-bg": "#F8F6F1",      // Off-white - Fundo principal da aplicação
        "brand-dark": "#252A2E",    // Grafite - Textos principais e alto contraste
        "brand-secondary": "#D9DDE0", // Cinza Claro - Cards, bordas e fundos secundários
      },
      fontFamily: {
        serif: ["'Playfair Display'", "'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(37, 42, 46, 0.08), 0 0 1px 1px rgba(96, 125, 139, 0.1)',
        'gold-glow': '0 8px 24px -6px rgba(201, 169, 110, 0.35)',
      }
    },
  },
  plugins: [],
};
