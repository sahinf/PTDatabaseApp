const preprocess = require("svelte-preprocess");

const config = {
  preprocess: preprocess({ postcss: true, sourceMap: true }),

};

module.exports = config;