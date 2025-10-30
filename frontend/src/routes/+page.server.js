// @ts-check
// Importamos la función fetchAllServers de nuestra librería,
// la cual internamente ya sabe la URL de la API gracias a env.API_URL
import { fetchAllServers } from "$lib/data/api";

/**
 * Función que se ejecuta ÚNICAMENTE en el servidor.
 * Su objetivo es cargar la data inicial que el componente +page.svelte necesita.
 * La variable de entorno API_URL de Railway se usa dentro de fetchAllServers.
 */
export async function load() {
  console.log("Iniciando carga de datos en el servidor...");
  try {
    // 1. Llamamos a la función que usa la API_URL de Railway
    const serverData = await fetchAllServers();

    // 2. Retornamos la data real al componente
    return {
      servers: serverData,
      status: "success",
    };
  } catch (error) {
    console.error("ERROR: No se pudieron cargar los datos iniciales.", error);

    // 3. Devolvemos un estado de error al componente para que pueda mostrar un mensaje
    return {
      servers: [],
      status: "error",
      errorMessage:
        "Error al conectar con la API. Verifica la variable API_URL en Railway y el estado del backend.",
    };
  }
}
