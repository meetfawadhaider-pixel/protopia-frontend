/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px #ff00ff' },
          '50%': { boxShadow: '0 0 20px #ff00ff' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        glow: "glow 1.5s infinite",
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.8)",
      },
    },
  },
  plugins: [],
};
