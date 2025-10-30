// src/lib/data/api.js

// NOTA: Hemos eliminado la importación de '$env/dynamic/private' de este archivo
// para evitar el error de compilación. Ahora la URL debe ser pasada como argumento.

/**
 * Consulta el endpoint /multiple-requests para obtener la lista de sucursales por servidor.
 * La URL base de la API se recibe como argumento.
 * @param {string} API_URL - La URL base de la API (obtenida de la variable de entorno de Railway en el servidor).
 * @returns {Promise<Array<Object>>} Los resultados brutos de cada servidor.
 */
export const fetchAllServers = async (API_URL) => {
  try {
    const response = await fetch(`${API_URL}/multiple-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok)
      throw new Error(`Error ${response.status}: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("Error en multiple-requests:", error);
    // Lanzamos el error para que loadData pueda capturarlo y actualizar el estado
    throw new Error("Error al conectar con el servidor: " + error.message);
  }
};

/**
 * Consulta el endpoint /managementinformation.
 * La URL base de la API se recibe como argumento.
 */
export const fetchManagementInfo = async (API_URL, serverUrl, branchId) => {
  const infoResp = await fetch(`${API_URL}/managementinformation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serverUrl, branchId }),
  });
  return await infoResp.json();
};

/**
 * Consulta el endpoint /status-branch.
 * La URL base de la API se recibe como argumento.
 */
export const fetchBranchStatus = async (API_URL, serverUrl, branchId) => {
  const statusResp = await fetch(`${API_URL}/status-branch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serverUrl, branchId }),
  });
  return await statusResp.json();
};
