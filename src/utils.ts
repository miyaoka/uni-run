/**
 * Execute command
 *
 * @param cmd Array of command and arguments to execute
 * @param cwd Working directory
 */
export async function executeCommand(
  cmd: string[],
  cwd: string,
): Promise<void> {
  const [executable, ...args] = cmd;
  const command = new Deno.Command(executable, {
    args,
    cwd,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  const { code } = await command.spawn().status;

  if (code !== 0) {
    Deno.exit(code);
  }
}
