import { Command } from "@cliffy/command";
import { detectProjectType } from "./core/detector.ts";
import { createRunner } from "./core/runner.ts";
import { selectScript } from "./core/interactive.ts";

const VERSION = "0.1.0";

// メインコマンドの定義
const cli = new Command()
  .name("urun")
  .version(VERSION)
  .description(
    "Universal script runner for npm, yarn, pnpm, bun, and deno projects"
  )
  .arguments("[script] [script-args...:string]")
  .option("-l, --list", "List available scripts")
  .action(async (options, script, scriptArgs) => {
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

      const selected = await selectScript(scripts);

      if (!selected) {
        console.log("No script selected");
        Deno.exit(0);
      }

      // ここで重要なポイント: スクリプトを実行せずにコマンド文字列を表示して終了
      console.log(`\x1b[1A\x1b[Kurun ${selected.name}`);
      Deno.exit(0);
    }

    // スクリプトが存在するか確認
    if (!(await runner.hasScript(script))) {
      console.error(
        `Error: Script '${script}' not found in this ${projectType} project`
      );
      Deno.exit(1);
    }

    // スクリプトを実行
    await runner.runScript(script, Array.isArray(scriptArgs) ? scriptArgs : []);
  });

if (import.meta.main) {
  cli.parse(Deno.args);
}
