/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta institucional USEBEQ / Gobierno del Estado de Querétaro
        gov: {
          navy:  '#242B57', // Azul marino (primario oscuro)
          blue:  '#4996C6', // Azul institucional
          cyan:  '#7CC6D8', // Azul claro / cyan
          gray:  '#707F8F', // Gris azulado
          pink:  '#FF3E8D', // Rosa/magenta (acento)
        },
        primary: {
          50:  '#f0f7fc',
          100: '#d9edf6',
          200: '#b3dbed',
          300: '#7CC6D8',
          400: '#4996C6',
          500: '#3a7aaa',
          600: '#2c5f8a',
          700: '#1d4870',
          800: '#242B57',
          900: '#1a1f40',
        },
      },
    },
  },
  plugins: [],
}
