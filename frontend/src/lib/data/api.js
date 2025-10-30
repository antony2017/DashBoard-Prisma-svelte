// src/lib/data/api.js
// Importa tu variable usando el nombre completo, incluido PUBLIC_
import { PUBLIC_API_URL } from "$env/static/public";
// Ahora puedes usarla directamente en tus funciones o en el HTML
console.log(`Conectando a: ${PUBLIC_API_URL}`);
//const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_URL = "https://dashboard-prisma-backend.up.railway.app/api";
/**
 * Consulta el endpoint /multiple-requests para obtener la lista de sucursales por servidor.
 * @returns {Promise<Array<Object>>} Los resultados brutos de cada servidor.
 */
export const fetchAllServers = async () => {
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
 */
export const fetchManagementInfo = async (serverUrl, branchId) => {
  const infoResp = await fetch(`${API_URL}/managementinformation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serverUrl, branchId }),
  });
  return await infoResp.json();
};

/**
 * Consulta el endpoint /status-branch.
 */
export const fetchBranchStatus = async (serverUrl, branchId) => {
  const statusResp = await fetch(`${API_URL}/status-branch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serverUrl, branchId }),
  });
  return await statusResp.json();
};
