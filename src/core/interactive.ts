import { Select } from "@cliffy/prompt";
import { dim } from "@std/fmt/colors";
import type { Script } from "../types.ts";

/**
 * Select script interactively
 *
 * @param scripts List of available scripts
 * @param defaultScript Default script name to select
 * @returns Selected script, or null if cancelled
 */
export async function selectScript(
  scripts: Script[],
  defaultScript?: string
): Promise<Script | null> {
  try {
    // Create options for Cliffy's selection UI with formatted script names and commands
    const options = scripts.map((script) => ({
      name: `${script.name} ${dim(`- ${script.description}`)}`,
      value: script.name,
    }));

    // Display interactive selection UI (with default value)
    const selectedName = await Select.prompt<string>({
      message: "Select a script to run:",
      options,
      default: defaultScript, // Set default selection
      search: true, // Enable search functionality
    });

    // Find and return script object from selection result
    return scripts.find((script) => script.name === selectedName) || null;
  } catch (error) {
    // Handle cancellation (e.g., user pressed Ctrl+C)
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    throw error;
  }
}
