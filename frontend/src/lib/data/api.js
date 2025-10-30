// src/lib/data/api.js

// 🚨 IMPORTANTE: Esta utilidad ya NO lee variables de entorno.
// La URL de la API (API_URL) y la función fetch son inyectadas desde el servidor (+page.server.js).

/**
 * Consulta el endpoint /multiple-requests para obtener la lista de sucursales por servidor.
 * @param {string} API_URL - URL base de la API (obtenida del env privado en el servidor).
 * @param {typeof fetch} fetch - Función fetch pasada desde el load de SvelteKit.
 * @returns {Promise<Array<Object>>} Los resultados brutos de cada servidor.
 */
export const fetchAllServers = async (API_URL, fetch) => {
  if (!API_URL) {
    throw new Error("API_URL es requerida para fetchAllServers.");
  }

  try {
    const response = await fetch(`${API_URL}/multiple-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!response.ok)
      throw new Error(
        `Error ${response.status}: ${response.statusText} al obtener múltiples requests.`
      );

    return await response.json();
  } catch (error) {
    console.error("Error en multiple-requests:", error);
    throw new Error("Error al conectar con el servidor: " + error.message);
  }
};

/**
 * Consulta el endpoint /managementinformation.
 * @param {string} API_URL - URL base de la API.
 * @param {typeof fetch} fetch - Función fetch pasada desde el load.
 */
export const fetchManagementInfo = async (
  API_URL,
  fetch,
  serverUrl,
  branchId
) => {
  if (!API_URL) throw new Error("API_URL es requerida.");

  const infoResp = await fetch(`${API_URL}/managementinformation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serverUrl, branchId }),
  });

  if (!infoResp.ok)
    throw new Error(`Error ${infoResp.status}: ${infoResp.statusText}`);

  return await infoResp.json();
};

/**
 * Consulta el endpoint /status-branch.
 * @param {string} API_URL - URL base de la API.
 * @param {typeof fetch} fetch - Función fetch pasada desde el load.
 */
export const fetchBranchStatus = async (
  API_URL,
  fetch,
  serverUrl,
  branchId
) => {
  if (!API_URL) throw new Error("API_URL es requerida.");

  const statusResp = await fetch(`${API_URL}/status-branch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serverUrl, branchId }),
  });

  if (!statusResp.ok)
    throw new Error(`Error ${statusResp.status}: ${statusResp.statusText}`);

  return await statusResp.json();
};
