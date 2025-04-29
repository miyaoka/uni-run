/**
 * Supported project types
 */
export type ProjectType = "npm" | "yarn" | "pnpm" | "bun" | "deno" | null;

/**
 * Script information
 */
export interface Script {
  name: string;
  description: string;
}

/**
 * Script runner interface
 */
export interface Runner {
  /**
   * Get list of available scripts
   */
  getScripts(): Promise<Script[]>;

  /**
   * Check if the specified script exists
   */
  hasScript(name: string): Promise<boolean>;

  /**
   * Get command string for execution
   */
  getCommandString(name: string): string;

  /**
   * Run script
   */
  runScript(name: string, args: string[]): Promise<void>;
}
