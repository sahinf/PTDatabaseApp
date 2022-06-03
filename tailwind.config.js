module.exports = {
  content: ['./public/index.html', './src/**/*.svelte'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],

  // Daisyui had some theme turned on by default
  daisyui: {
    themes: false,
 }
}
