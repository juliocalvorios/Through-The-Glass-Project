/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores de la pared
        wall: {
          light: '#f5f0e8',
          dark: '#1a1a2e',
        },
        // Colores del cielo
        sky: {
          day: '#87CEEB',
          sunset: '#FF7E5F',
          night: '#0f0c29',
          storm: '#2c3e50',
        },
        // Colores de la ventana
        window: {
          frame: '#8B4513',
          frameDark: '#5D3A1A',
          sill: '#A0522D',
        },
      },
      animation: {
        'rain-fall': 'rainFall 1s linear infinite',
        'snow-fall': 'snowFall 3s linear infinite',
        'lightning': 'lightning 0.1s ease-in-out',
        'aurora-wave': 'auroraWave 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        rainFall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        snowFall: {
          '0%': { transform: 'translateY(-10%) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' },
        },
        lightning: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        auroraWave: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-20px) scaleY(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'window': 'inset 0 0 30px rgba(0,0,0,0.3)',
        'frame': '0 4px 20px rgba(0,0,0,0.3)',
        'clock': '0 4px 15px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
