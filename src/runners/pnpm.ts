import { exists } from "@std/fs";
import { join } from "@std/path";
import { executeCommand } from "../utils.ts";
import type { Runner, Script } from "../types.ts";

/**
 * Create script runner for pnpm projects
 *
 * @param cwd Current working directory
 * @returns Script runner object
 */
export function createPnpmRunner(cwd: string): Runner {
  /**
   * Get list of available scripts
   */
  async function getScripts(): Promise<Script[]> {
    const packageJsonPath = join(cwd, "package.json");

    if (!(await exists(packageJsonPath))) {
      return [];
    }

    try {
      const content = await Deno.readTextFile(packageJsonPath);
      const pkg = JSON.parse(content);

      if (!pkg.scripts) return [];

      return Object.entries(pkg.scripts).map(([name, command]) => ({
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
    // Add --silent flag to suppress extra output
    const cmd = ["pnpm", "run", "--silent", name];

    // Add arguments directly (PNPM handles differently than npm)
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
