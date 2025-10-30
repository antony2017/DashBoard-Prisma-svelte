// src/lib/data/api.js

// 1. Importamos 'env' del módulo dinámico privado.
// Esto es CRUCIAL, ya que te da acceso a las variables de Railway (como process.env)
// en tiempo de ejecución. Usamos la versión 'dynamic' porque los valores cambian (local vs Railway).
import { env } from "$env/dynamic/private";

// 2. Accedemos a la variable de entorno API_URL (sin prefijo PUBLIC_)
// El valor hardcodeado se deja como un fallback SÓLO si env.API_URL no está definido,
// aunque si lo tienes en Railway, nunca se usará.
const API_URL =
  env.API_URL || "https://dashboard-prisma-backend.up.railway.app/api";

console.log(`[API.JS - Servidor] Conectando a: ${API_URL}`);

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
