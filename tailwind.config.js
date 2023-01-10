/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blou: "rgba(2, 114, 150, 1)",
        blou_light: "rgba(4, 130, 170, 1)",
      },
      fontSize : {
        big : '5rem'
      }
    },
    fontFamily : {
      inria : ['Inria Serif', 'serif'],
      indie : ['Indie Flower', 'cursive'],
    }
  },
  plugins: [require("daisyui")],

}
