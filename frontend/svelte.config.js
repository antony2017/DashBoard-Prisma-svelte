// svelte.config.js

// 1. Importar el adaptador estático
import adapter from '@sveltejs/adapter-static'; 

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // 2. Usar el adaptador estático
        adapter: adapter({
            // Directorio de salida. El build se guardará en la carpeta 'build' (valor por defecto).
            pages: 'build', 
            assets: 'build',
            // El 'fallback' es crucial para Single Page Applications (SPA).
            // Le dice al servidor estático que, si una URL (ej. /dashboard) no existe,
            // cargue 'index.html' para que el enrutador de SvelteKit pueda manejar la ruta.
            fallback: 'index.html', 
            precompress: false,
            strict: true
        }),
        
        // 3. Configuración para asegurar que SvelteKit opere como SPA y no use SSR.
        prerender: {
            // Asegura que todas las rutas se intenten prerenderizar. 
            // Esto es necesario para generar el 'index.html' base.
            entries: ['*'], 
        }
    }
};

export default config;