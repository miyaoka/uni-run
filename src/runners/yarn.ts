import { exists } from "@std/fs";
import { join } from "@std/path";
import { executeCommand } from "../utils.ts";
import type { Runner, Script } from "../types.ts";

/**
 * Yarnプロジェクト用スクリプトランナーを作成
 *
 * @param cwd 現在の作業ディレクトリ
 * @returns スクリプトランナーオブジェクト
 */
export function createYarnRunner(cwd: string): Runner {
  /**
   * 利用可能なスクリプト一覧を取得
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
   * 指定されたスクリプトが存在するか確認
   */
  async function hasScript(name: string): Promise<boolean> {
    const scripts = await getScripts();
    return scripts.some((script) => script.name === name);
  }

  /**
   * 実行コマンド文字列を取得
   */
  function getCommandString(name: string): string {
    return `yarn ${name}`;
  }

  /**
   * スクリプトを実行
   */
  async function runScript(name: string, args: string[] = []): Promise<void> {
    const cmd = ["yarn", name, ...args];
    await executeCommand(cmd, cwd);
  }

  // スクリプトランナーオブジェクトを返す
  return {
    getScripts,
    hasScript,
    getCommandString,
    runScript,
  };
}
