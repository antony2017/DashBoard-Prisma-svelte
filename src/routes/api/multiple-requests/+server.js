// src/routes/api/multiple-requests/+server.js
import { json } from "@sveltejs/kit";
import { loadServers } from "$lib/server/utils";
import {
  DEFAULT_USER,
  DEFAULT_CLAVE,
  endpointSuffix,
} from "$lib/server/config";

export const POST = async () => {
  const servers = loadServers();
  const credentials = Buffer.from(`${DEFAULT_USER}:${DEFAULT_CLAVE}`).toString(
    "base64"
  );

  const requests = servers.map(async (server) => {
    try {
      const fullUrl = server.URL + endpointSuffix;
      const resp = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${credentials}`,
        },
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}: ${resp.statusText}`);
      let data = await resp.json();
      if (Array.isArray(data))
        data = data.filter((item) => item.enabled === true);
      else if (typeof data === "object" && data !== null && !data.enabled)
        data = [];

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
  return json(allResults);
};
