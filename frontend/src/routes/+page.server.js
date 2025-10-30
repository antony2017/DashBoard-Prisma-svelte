// @ts-check

// 1. Importamos la función de la librería (la que espera la URL como argumento)
import { fetchAllServers } from "$lib/data/api";

// 2. Importamos el entorno aquí. Este es el ÚNICO lugar que debe hacerlo.
import { env } from "$env/dynamic/private";

/**
 * Función que se ejecuta ÚNICAMENTE en el servidor.
 * Su objetivo es cargar la data inicial que el componente +page.svelte necesita.
 */
export async function load() {
  // 3. Obtenemos la variable de Railway (o un fallback)
  const API_URL =
    env.API_URL || "https://dashboard-prisma-backend.up.railway.app/api";

  console.log(`[SERVER LOAD] Usando API URL: ${API_URL}`);

  try {
    // 4. Llamamos a la función de API e INYECTAMOS la API_URL como argumento
    const serverData = await fetchAllServers(API_URL);

    // 5. Retornamos la data real al componente
    return {
      servers: serverData,
      status: "success",
    };
  } catch (error) {
    console.error("ERROR: No se pudieron cargar los datos iniciales.", error);

    // 6. Devolvemos un estado de error al componente
    return {
      servers: [],
      status: "error",
      errorMessage: "Error al conectar con la API. Detalles: " + error.message,
    };
  }
}
