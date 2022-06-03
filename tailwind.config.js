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
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
    // themes: [],
  },

  darkMode: 'class',
}
