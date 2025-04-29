import { exists } from "@std/fs";
import { join } from "@std/path";
import { executeCommand } from "../utils.ts";
import type { Runner, Script } from "../types.ts";

/**
 * Create script runner for Deno projects
 *
 * @param cwd Current working directory
 * @returns Script runner object
 */
export function createDenoRunner(cwd: string): Runner {
  /**
   * Get list of available scripts
   */
  async function getScripts(): Promise<Script[]> {
    // Look for deno.json or deno.jsonc
    let configPath = join(cwd, "deno.json");
    let exists1 = await exists(configPath);

    if (!exists1) {
      configPath = join(cwd, "deno.jsonc");
      exists1 = await exists(configPath);

      if (!exists1) {
        return [];
      }
    }

    try {
      const content = await Deno.readTextFile(configPath);
      const config = JSON.parse(content);

      if (!config.tasks) return [];

      return Object.entries(config.tasks).map(([name, command]) => ({
        name,
        description: String(command),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Check if the specified script exists
   */
  async function hasScript(name: string): Promise<boolean> {
    const scripts = await getScripts();
    return scripts.some((script) => script.name === name);
  }

  /**
   * Run script
   */
  async function runScript(name: string, args: string[] = []): Promise<void> {
    // Add --quiet flag to suppress extra output
    const cmd = ["deno", "task", "--quiet", name];

    // Add arguments directly (Deno tasks don't use -- separator)
    if (args.length > 0) {
      cmd.push(...args);
    }

    await executeCommand(cmd, cwd);
  }

  // Return script runner object
  return {
    getScripts,
    hasScript,
    runScript,
  };
}
