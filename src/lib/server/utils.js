// src/lib/server/utils.js
import fs from "fs";
import path from "path";

// Look for servers.json in the root of the SvelteKit project (process.cwd())
const candidatePaths = [path.join(process.cwd(), "servers.json")];

/**
 * Finds the path to the servers.json file.
 * If the file exists in any of the candidate paths, it returns that path.
 * Otherwise, it returns the first candidate path to be used for writing later.
 */
function findServersPath() {
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {
      // Ignore errors during path checking
    }
  }
  // If not found, return the first path as default for future writing
  return candidatePaths[0];
}

/**
 * Loads the list of servers from the servers.json file.
 * If the file cannot be read or parsed, returns an empty array.
 */
export function loadServers() {
  const p = findServersPath();
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.warn("loadServers: could not read", p, e.message);
    return [];
  }
}

/**
 * Saves the list of servers to the servers.json file.
 * Returns true if successful, false otherwise.
 */
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
