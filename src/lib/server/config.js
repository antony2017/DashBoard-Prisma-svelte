import { env } from "$env/dynamic/private";

function required(name) {
  const val = env[name];
  if (!val) {
    throw new Error(`Missing required env var ${name}`);
  }
  return val;
}

export const DEFAULT_USER = required("DEFAULT_USER");
export const DEFAULT_CLAVE = required("DEFAULT_CLAVE");
export const endpointSuffix = "qsystem/rest/config/branches/";
export const managementinformation =
  "qsystem/rest/managementinformation/v2/branches/";

export default {
  DEFAULT_USER,
  DEFAULT_CLAVE,
  endpointSuffix,
  managementinformation,
};
