import { exists } from "@std/fs";
import { join } from "@std/path";
import type { ProjectType } from "../types.ts";

/**
 * Detect project type from project directory
 *
 * @param dir Project directory path
 * @returns Detected project type, or null if not detected
 */
export async function detectProjectType(dir: string): Promise<ProjectType> {
  // Detection by lock files (most reliable)
  if (await exists(join(dir, "yarn.lock"))) return "yarn";
  if (await exists(join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (await exists(join(dir, "package-lock.json"))) return "npm";
  if (await exists(join(dir, "bun.lockb"))) return "bun";

  // Detection by configuration files
  if (
    (await exists(join(dir, "deno.json"))) ||
    (await exists(join(dir, "deno.jsonc")))
  ) {
    return "deno";
  }

  if (await exists(join(dir, "package.json"))) {
    try {
      const content = await Deno.readTextFile(join(dir, "package.json"));
      const pkg = JSON.parse(content);

      // Determine by packageManager field
      if (pkg.packageManager) {
        if (pkg.packageManager.startsWith("pnpm")) return "pnpm";
        if (pkg.packageManager.startsWith("yarn")) return "yarn";
        if (pkg.packageManager.startsWith("npm")) return "npm";
        if (pkg.packageManager.startsWith("bun")) return "bun";
      }

      return "npm"; // Default is npm
    } catch {
      return "npm";
    }
  }

  return null;
}
