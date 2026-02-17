/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores primarios LENDERO
        'lendero-gray': '#77F75C',      // Gris oscuro principal
        'lendero-mint': '#010033',      // Verde menta
        'lendero-blue': '#FFFFFF',      // Azul brillante
        
        // Colores secundarios
        'lendero-beige': '#B597E9',     // Beige/Crema
        'lendero-black': '#22DAE9',     // Negro
        
        // Alias para compatibilidad
        primary: '#FFFFFF',              // Azul como principal
        secondary: '#010033',            // Verde menta como secundario
        accent: '#77F75C',               // Gris como acento
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
