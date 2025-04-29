import { Command } from "@cliffy/command";
import { detectProjectType } from "./core/detector.ts";
import { createRunner } from "./core/runner.ts";
import { selectScript } from "./core/interactive.ts";
import { getLastScript, saveCache } from "./core/cache.ts";

const VERSION = "0.1.0";

// メインコマンドの定義
const cli = new Command()
  .name("urun")
  .version(VERSION)
  .description(
    "Universal script runner for npm, yarn, pnpm, bun, and deno projects"
  )
  .arguments("[command...:string]")
  .option("-l, --list", "List available scripts")
  .action(async (options, command) => {
    const [script, ...args] = command || [];
    const cwd = Deno.cwd();
    const projectType = await detectProjectType(cwd);

    if (!projectType) {
      console.error(
        "Error: Could not detect project type. Are you in a valid project directory?"
      );
      Deno.exit(1);
    }

    const runner = createRunner(projectType, cwd);

    // スクリプト一覧表示
    if (options.list) {
      const scripts = await runner.getScripts();
      console.log(`Available scripts (${projectType}):`);

      if (scripts.length === 0) {
        console.log("  No scripts found");
        return;
      }

      const maxNameLength = Math.max(...scripts.map((s) => s.name.length));

      for (const { name, description } of scripts) {
        console.log(`  ${name.padEnd(maxNameLength + 2)}${description}`);
      }
      return;
    }

    // スクリプト名が指定されていない場合はインタラクティブモード
    if (!script) {
      const scripts = await runner.getScripts();

      if (scripts.length === 0) {
        console.error(`No scripts found in this ${projectType} project`);
        Deno.exit(1);
      }

      // 前回選択したスクリプトをキャッシュから取得
      const lastScript = await getLastScript(cwd);

      // スクリプト選択UI表示（前回選択したスクリプトをデフォルト値として渡す）
      const selected = await selectScript(scripts, lastScript);

      if (!selected) {
        console.log("No script selected");
        Deno.exit(0);
      }

      // 選択したスクリプトをキャッシュに保存
      await saveCache(cwd, selected.name);

      // スクリプトを実行
      await runner.runScript(selected.name, []);
      return;
    }

    // スクリプト名が指定されている場合
    if (script) {
      // スクリプトが存在するか確認
      if (!(await runner.hasScript(script))) {
        console.error(
          `Error: Script '${script}' not found in this ${projectType} project`
        );
        Deno.exit(1);
      }

      // スクリプトを実行
      await runner.runScript(script, args);
    }
  });

if (import.meta.main) {
  cli.parse(Deno.args);
}
