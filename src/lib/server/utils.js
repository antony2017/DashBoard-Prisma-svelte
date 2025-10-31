// src/lib/server/utils.js
import fs from "fs";
import path from "path";

// Buscamos servers.json en la raíz del proyecto SvelteKit (process.cwd())
// o, si existe, en ../backend/servers.json (cuando migres desde la carpeta backend).
const candidatePaths = [path.join(process.cwd(), "servers.json")];

function findServersPath() {
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {
      // ignore
    }
  }
  // si no existe, usaremos la primera ruta para escribir luego
  return candidatePaths[0];
}

export function loadServers() {
  const p = findServersPath();
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.warn("loadServers: no se pudo leer", p, e.message);
    return [];
  }
}

export function saveServers(servers) {
  const p = findServersPath();
  try {
    fs.writeFileSync(p, JSON.stringify(servers, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("saveServers error:", e.message);
    return false;
  }
}
