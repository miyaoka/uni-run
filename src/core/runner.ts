import type { ProjectType, Runner } from "../types.ts";
import { createNpmRunner } from "../runners/npm.ts";
import { createYarnRunner } from "../runners/yarn.ts";
import { createPnpmRunner } from "../runners/pnpm.ts";
import { createBunRunner } from "../runners/bun.ts";
import { createDenoRunner } from "../runners/deno.ts";

/**
 * プロジェクトタイプに対応するスクリプトランナーを作成
 *
 * @param type プロジェクトタイプ
 * @param cwd 現在の作業ディレクトリ
 * @returns スクリプトランナーオブジェクト
 * @throws プロジェクトタイプがサポートされていない場合はエラー
 */
export function createRunner(type: ProjectType, cwd: string): Runner {
  switch (type) {
    case "npm":
      return createNpmRunner(cwd);
    case "yarn":
      return createYarnRunner(cwd);
    case "pnpm":
      return createPnpmRunner(cwd);
    case "bun":
      return createBunRunner(cwd);
    case "deno":
      return createDenoRunner(cwd);
    default:
      throw new Error(`Unsupported project type: ${type}`);
  }
}
