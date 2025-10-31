// src/routes/api/servers/+server.js
import { json } from "@sveltejs/kit";
import { loadServers, saveServers } from "$lib/server/utils";

export const GET = async () => {
  const servers = loadServers();
  return json(servers);
};

export const POST = async ({ request }) => {
  const nuevo = await request.json();
  if (!nuevo || typeof nuevo.ID !== "number" || !nuevo.URL) {
    return json(
      { error: "Faltan campos obligatorios o ID inválido" },
      { status: 400 }
    );
  }
  const servers = loadServers();
  if (servers.some((s) => s.ID === nuevo.ID))
    return json({ error: "Ya existe un servidor con ese ID" }, { status: 400 });
  servers.push(nuevo);
  const ok = saveServers(servers);
  if (!ok)
    return json({ error: "No se pudo guardar servers.json" }, { status: 500 });
  return json({ ok: true });
};

export const DELETE = async ({ params, request }) => {
  // Eliminar por ID vía query o body
  let id;
  try {
    const body = await request.json();
    id = body?.id ?? body?.ID;
  } catch (e) {
    // ignore
  }
  // intentar query param
  if (!id) {
    // no params in +server.js path by default; user can pass ?id=NN
  }
  id = Number(id);
  if (!id) return json({ error: "ID inválido" }, { status: 400 });
  let servers = loadServers();
  const inicial = servers.length;
  servers = servers.filter((s) => s.ID !== id);
  if (servers.length === inicial)
    return json({ error: "Servidor no encontrado" }, { status: 404 });
  const ok = saveServers(servers);
  if (!ok)
    return json({ error: "No se pudo guardar servers.json" }, { status: 500 });
  return json({ ok: true });
};
