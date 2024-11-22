/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily:{
      poppins:['Poppins','sans-serif'],
      openSans:["Open Sans", 'sans-serif'],
      roboto:['Roboto','sans-serif'],
      edu:["Edu AU VIC WA NT Hand", 'cursive'],
      nerko:['Nerko One', 'cursive']
    }
  },
  plugins: [],
}