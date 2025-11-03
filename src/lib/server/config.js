import { DEFAULT_USER, DEFAULT_CLAVE } from "$lib/server/config";

if (!DEFAULT_USER || !DEFAULT_CLAVE) {
  console.error("Missing DEFAULT_USER/DEFAULT_CLAVE env vars");
  return json(
    { error: "Server misconfiguration: missing credentials" },
    { status: 500 }
  );
}

export const endpointSuffix = "qsystem/rest/config/branches/";
export const managementinformation =
  "qsystem/rest/managementinformation/v2/branches/";

export default {
  DEFAULT_USER,
  DEFAULT_CLAVE,
  endpointSuffix,
  managementinformation,
};
