const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
// Variables globales para endpoints remotos
const endpointSuffix = "qsystem/rest/config/branches/";
const managementinformation = "qsystem/rest/managementinformation/v2/branches/";
const DEFAULT_USER = "apiprisma";
const DEFAULT_CLAVE = "Ulan1234.";

// --- INICIO: CONFIGURACIÓN CORS EXPLÍCITA MULTI-ORIGEN ---
// 1. Definimos una lista (Array) de todos los orígenes (URLs) permitidos.
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Típico puerto de desarrollo Svelte
  "http://localhost:3000", // Si usas otro puerto de dev
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // 2. Verificamos si el origen de la petición está en la lista de permitidos
  if (ALLOWED_ORIGINS.includes(origin)) {
    // Establece el encabezado de origen con el dominio específico del solicitante
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // NOTA: Si necesitas permitir cualquier localhost (para pruebas rápidas)
  // puedes usar una lógica más compleja aquí, pero es más seguro listar solo los que usas.

  // Permite los métodos que usas (POST, GET, OPTIONS)
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

  // Permite los encabezados necesarios (especialmente Content-Type y Authorization)
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Maneja la petición OPTIONS (preflight request), necesaria para POST.
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Desactivamos el middleware 'cors' simple, ya que usamos el manual y explícito.
// app.use(cors());

// --- FIN: CONFIGURACIÓN CORS EXPLÍCITA MULTI-ORIGEN ---

// Middleware (resto de la configuración)
app.use(express.json());

// Servir archivos estáticos desde la raíz (Esto generalmente no es necesario
// en una Netlify Function, pero se mantiene si así lo requiere tu estructura)
app.use(express.static(__dirname));

// Servir archivos estáticos desde la carpeta js
app.use("/js", express.static(path.join(__dirname, "js")));

// Función para leer servidores desde servers.json
function loadServers() {
  try {
    // En Netlify Functions, 'servers.json' debe ser incluido en el bundle de despliegue
    const data = fs.readFileSync("servers.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer servers.json:", error);
    return [];
  }
}

// Endpoint para obtener servidores
app.get("/api/servers", (req, res) => {
  try {
    const servers = loadServers();
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar servidores" });
  }
});

// Endpoint para múltiples peticiones
app.post("/api/multiple-requests", async (req, res) => {
  try {
    const servers = loadServers();
    const credentials = Buffer.from(
      `${DEFAULT_USER}:${DEFAULT_CLAVE}`
    ).toString("base64");

    // Peticiones paralelas
    const requests = servers.map(async (server) => {
      try {
        // Concatenar url base con endpointSuffix
        const fullUrl = server.URL + endpointSuffix;
        const response = await fetch(fullUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${credentials}`,
          },
          timeout: 10000,
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        let data = await response.json();
        // Filtrar solo elementos habilitados
        if (Array.isArray(data)) {
          data = data.filter((item) => item.enabled === true);
        } else if (typeof data === "object" && data !== null) {
          if (!data.enabled) data = [];
        }
        return {
          success: true,
          server,
          data,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          success: false,
          server,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    });
    const allResults = await Promise.all(requests);
    res.json(allResults);
  } catch (error) {
    console.error("Error en múltiples requests:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener el status de un branch
app.post("/api/status-branch", async (req, res) => {
  const { serverUrl, branchId } = req.body;
  if (!serverUrl || !branchId) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros: serverUrl o branchId" });
  }
  try {
    const credentials = Buffer.from(
      `${DEFAULT_USER}:${DEFAULT_CLAVE}`
    ).toString("base64");
    const fullUrl = serverUrl + endpointSuffix + branchId;
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${credentials}`,
      },
      timeout: 10000,
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error al consultar status branch:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener información de gestión
app.post("/api/managementinformation", async (req, res) => {
  const { serverUrl, branchId } = req.body;
  if (!serverUrl || !branchId) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros: serverUrl o branchId" });
  }
  try {
    const credentials = Buffer.from(
      `${DEFAULT_USER}:${DEFAULT_CLAVE}`
    ).toString("base64");
    const fullUrl =
      serverUrl + managementinformation + branchId + "/servicePoints";
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${credentials}`,
      },
      timeout: 10000,
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error en managementinformation:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- API para agregar y eliminar servidores en servers.json ---

// Agregar un servidor
app.post("/api/servers", (req, res) => {
  try {
    const servers = loadServers();
    const nuevo = req.body;
    // Validación robusta
    if (
      typeof nuevo.ID !== "number" ||
      isNaN(nuevo.ID) ||
      nuevo.ID <= 0 ||
      !nuevo.URL ||
      !nuevo.Pais ||
      !nuevo.Nombre
    ) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios o ID inválido" });
    }
    // Evitar duplicados por ID
    if (servers.some((s) => s.ID === nuevo.ID)) {
      return res
        .status(400)
        .json({ error: "Ya existe un servidor con ese ID" });
    }
    servers.push(nuevo);
    fs.writeFileSync("servers.json", JSON.stringify(servers, null, 2));
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar servidor" });
  }
});

// Eliminar un servidor por ID
app.delete("/api/servers/:id", (req, res) => {
  try {
    let servers = loadServers();
    const id = Number(req.params.id);
    const inicial = servers.length;
    servers = servers.filter((s) => s.ID !== id);
    if (servers.length === inicial) {
      return res.status(404).json({ error: "Servidor no encontrado" });
    }
    fs.writeFileSync("servers.json", JSON.stringify(servers, null, 2));
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar servidor" });
  }
});

// Servir index.html para cualquier otra ruta (Esto es para desarrollo local)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // si está en la raíz
});

// Esta parte solo es relevante para desarrollo local.
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
