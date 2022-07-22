import { defineConfig } from "vite";
import { svelte } from '@sveltejs/vite-plugin-svelte';


// const preprocess = require('svelte-preprocess')

export default defineConfig({
  base: "/PTDatabaseApp",
  plugins: [svelte()]
})