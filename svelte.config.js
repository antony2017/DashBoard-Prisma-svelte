// svelte.config.js

// Usamos adapter-node para poder servir endpoints server-side desde SvelteKit
import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // Al usar adapter-node, por defecto tendrás SSR y endpoints server-side.
    // Ajusta prerender si necesitas generar rutas estáticas adicionales.
    prerender: {
      entries: [],
    },
  },
};

export default config;
