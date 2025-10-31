import { json } from "@sveltejs/kit";
import {
  DEFAULT_USER,
  DEFAULT_CLAVE,
  managementinformation,
} from "$lib/server/config";

export const POST = async ({ request }) => {
  const body = await request.json();
  const { serverUrl, branchId } = body;
  if (!serverUrl || !branchId)
    return json(
      { error: "Faltan parámetros: serverUrl o branchId" },
      { status: 400 }
    );

  try {
    const credentials = Buffer.from(
      `${DEFAULT_USER}:${DEFAULT_CLAVE}`
    ).toString("base64");
    const fullUrl =
      serverUrl + managementinformation + branchId + "/servicePoints";
    const resp = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${credentials}`,
      },
    });
    if (!resp.ok) throw new Error(`Error ${resp.status}: ${resp.statusText}`);
    const data = await resp.json();
    return json({ success: true, data });
  } catch (error) {
    console.error("managementinformation error:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
