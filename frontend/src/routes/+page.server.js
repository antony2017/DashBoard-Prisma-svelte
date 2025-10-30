import { env } from "$env/dynamic/private"; // Módulo para acceder a variables privadas (SOLO SERVIDOR)
import { error } from "@sveltejs/kit";
import { fetchAllServers } from "$lib/data/api"; // Importamos la función de utilidad de tu api.js

/** * Función load que se ejecuta exclusivamente en el servidor.
 * Esta función es la única que puede acceder a la variable API_URL.
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ fetch }) {
  // 1. Accede a la variable privada (debe llamarse API_URL en Railway)

  const API_URL = env.API_URL;
  console.log(API_URL);

  // 2. Verificación de configuración. Si falla, significa que la variable no fue seteada.
  if (!API_URL || API_URL.includes("undefined")) {
    console.error(
      "ERROR: API_URL no está definida en el entorno privado del servidor."
    );
    // Lanza un error 500 para informar del fallo de configuración.
    throw error(
      500,
      "Error de configuración del servidor: La URL del backend no está disponible."
    );
  }

  // 3. Llama a la función de utilidad, pasando la URL y la función fetch de SvelteKit.
  try {
    // fetchAllServers ahora requiere API_URL y el objeto fetch
    const serverResults = await fetchAllServers(API_URL, fetch);

    // 4. Los datos se devuelven y están disponibles en el componente +page.svelte
    return {
      serverResults: serverResults,
    };
  } catch (e) {
    console.error("Error al cargar datos en +page.server.js:", e.message);
    // Lanza un error de SvelteKit en caso de fallo de conexión.
    throw error(
      500,
      "Fallo al obtener datos del servidor backend. Detalles: " + e.message
    );
  }
}
