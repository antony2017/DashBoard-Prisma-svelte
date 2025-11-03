import { env } from "$env/dynamic/private";

// Leer variables de entorno de forma segura (no lanzar en build)
function readEnv(name) {
  return env[name] ?? process.env[name] ?? null;
}

export const DEFAULT_USER = readEnv("DEFAULT_USER");
export const DEFAULT_CLAVE = readEnv("DEFAULT_CLAVE");

export const endpointSuffix = "qsystem/rest/config/branches/";
export const managementinformation =
  "qsystem/rest/managementinformation/v2/branches/";

export default {
  DEFAULT_USER,
  DEFAULT_CLAVE,
  endpointSuffix,
  managementinformation,
};
