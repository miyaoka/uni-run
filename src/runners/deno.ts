import { exists } from "@std/fs";
import { join } from "@std/path";
import { executeCommand } from "../utils.ts";
import type { Runner, Script } from "../types.ts";

/**
 * Denoプロジェクト用スクリプトランナーを作成
 *
 * @param cwd 現在の作業ディレクトリ
 * @returns スクリプトランナーオブジェクト
 */
export function createDenoRunner(cwd: string): Runner {
  /**
   * 利用可能なスクリプト一覧を取得
   */
  async function getScripts(): Promise<Script[]> {
    // deno.json または deno.jsonc を探す
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
    return `deno task ${name}`;
  }

  /**
   * スクリプトを実行
   */
  async function runScript(name: string, args: string[] = []): Promise<void> {
    const cmd = ["deno", "task", name, ...args];
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
