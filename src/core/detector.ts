import { exists } from "@std/fs";
import { join } from "@std/path";
import type { ProjectType } from "../types.ts";

/**
 * プロジェクトディレクトリからプロジェクトタイプを検出する
 *
 * @param dir プロジェクトディレクトリパス
 * @returns 検出されたプロジェクトタイプ、検出できない場合はnull
 */
export async function detectProjectType(dir: string): Promise<ProjectType> {
  // ロックファイルによる検出（最も信頼性が高い）
  if (await exists(join(dir, "yarn.lock"))) return "yarn";
  if (await exists(join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (await exists(join(dir, "package-lock.json"))) return "npm";
  if (await exists(join(dir, "bun.lockb"))) return "bun";

  // 設定ファイルによる検出
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

      // packageManagerフィールドによる判断
      if (pkg.packageManager) {
        if (pkg.packageManager.startsWith("pnpm")) return "pnpm";
        if (pkg.packageManager.startsWith("yarn")) return "yarn";
        if (pkg.packageManager.startsWith("npm")) return "npm";
        if (pkg.packageManager.startsWith("bun")) return "bun";
      }

      return "npm"; // デフォルトはnpm
    } catch {
      return "npm";
    }
  }

  return null;
}
