// Cache type definition
interface ScriptCache {
  [directory: string]: string; // Directory path -> Selected script name
}

const STORAGE_KEY = "uni-run-cache";

/**
 * Load cache
 *
 * @returns Cache data
 */
export function loadCache(): ScriptCache {
  try {
    const cacheData = localStorage.getItem(STORAGE_KEY);
    return cacheData ? JSON.parse(cacheData) : {};
  } catch (error) {
    // Safely check the type of error object
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Failed to load cache:", errorMsg);
    return {};
  }
}

/**
 * Save cache
 *
 * @param directory Working directory
 * @param scriptName Selected script name
 */
export function saveCache(
  directory: string,
  scriptName: string,
): void {
  try {
    // Load existing cache
    const cache = loadCache();

    // Add new information
    cache[directory] = scriptName;

    // Write cache to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
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
export function getLastScript(
  directory: string,
): string | undefined {
  const cache = loadCache();
  return cache[directory];
}
