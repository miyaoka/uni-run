import { Command } from "@cliffy/command";
import { detectProjectType } from "./core/detector.ts";
import { createRunner } from "./core/runner.ts";
import { selectScript } from "./core/interactive.ts";
import { getLastScript, saveCache } from "./core/cache.ts";
import denoJson from "../deno.json" with { type: "json" };

const VERSION = denoJson.version;

// Example (for uni-run --list test -- --watch):
//   Options:           { list: true }      # Command options
//   Arguments:         ["test"]            # Regular arguments (script name)
//   Literal arguments: ["--watch"]         # Arguments after "--" (passed to script)

// Define main command
const cli = new Command()
  .name("uni-run")
  .version(VERSION)
  .versionOption("-v, --version", "Show version information")
  .description(
    "Universal script runner for npm, yarn, pnpm, bun, and deno projects"
  )
  .usage("[options] [script] [--args]")
  .arguments("[...args:string]")
  .option("-l, --list", "List available scripts")
  .example("Interactive mode", "uni-run")
  .example("Run a specific script", "uni-run dev")
  .example("Run with arguments", "uni-run test -- --watch")
  .example("Pass build flags", "uni-run build -- --mode production")
  .action(async function (options, ...args: Array<string>) {
    // Extract script name from args (safely)
    const script = args.length > 0 ? args[0] : undefined;
    const cwd = Deno.cwd();
    const projectType = await detectProjectType(cwd);

    if (!projectType) {
      console.error(
        "Error: Could not detect project type. Are you in a valid project directory?"
      );
      Deno.exit(1);
    }

    const runner = createRunner(projectType, cwd);

    // Display script list
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

    // Use interactive mode if no script name is specified
    if (!script) {
      const scripts = await runner.getScripts();

      if (scripts.length === 0) {
        console.error(`No scripts found in this ${projectType} project`);
        Deno.exit(1);
      }

      // Get the last selected script from cache
      const lastScript = await getLastScript(cwd);

      // Display script selection UI (with last selected script as default)
      const selected = await selectScript(scripts, lastScript);

      if (!selected) {
        console.log("No script selected");
        Deno.exit(0);
      }

      // Save selected script to cache
      await saveCache(cwd, selected.name);

      // Run the script
      await runner.runScript(selected.name, []);
      return;
    }

    // If script name is specified
    if (script) {
      // Check if the script exists
      if (!(await runner.hasScript(script))) {
        console.error(
          `Error: Script '${script}' not found in this ${projectType} project`
        );
        Deno.exit(1);
      }

      // Run the script with literal args
      await runner.runScript(script, this.getLiteralArgs());
    }
  });

if (import.meta.main) {
  cli.parse(Deno.args);
}
