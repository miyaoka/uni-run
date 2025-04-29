import { join } from "@std/path";
import { exists, ensureDir } from "@std/fs";

// Cache directory settings
const HOME_DIR = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "~";
const CACHE_DIR = join(HOME_DIR, ".cache", "uni-run");
const CACHE_FILE = join(CACHE_DIR, "cache.json");

// Cache type definition
interface ScriptCache {
  [directory: string]: string; // Directory path -> Selected script name
}

/**
 * Load cache
 *
 * @returns Cache data
 */
export async function loadCache(): Promise<ScriptCache> {
  try {
    if (await exists(CACHE_FILE)) {
      const content = await Deno.readTextFile(CACHE_FILE);
      return JSON.parse(content);
    }
  } catch (error) {
    // Safely check the type of error object
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Failed to load cache:", errorMsg);
  }
  return {};
}

/**
 * Save cache
 *
 * @param directory Working directory
 * @param scriptName Selected script name
 */
export async function saveCache(
  directory: string,
  scriptName: string
): Promise<void> {
  try {
    // Create cache directory if it doesn't exist
    await ensureDir(CACHE_DIR);

    // Load existing cache
    const cache = await loadCache();

    // Add new information
    cache[directory] = scriptName;

    // Write cache to file
    await Deno.writeTextFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    // Safely check the type of error object
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Failed to save cache:", errorMsg);
  }
}

/**
 * Get last selected script for the working directory
 *
 * @param directory Working directory
 * @returns Last selected script name, or undefined if not found
 */
export async function getLastScript(
  directory: string
): Promise<string | undefined> {
  const cache = await loadCache();
  return cache[directory];
}
