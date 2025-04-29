/**
 * コマンドを実行する
 *
 * @param cmd 実行するコマンドと引数の配列
 * @param cwd 作業ディレクトリ
 */
export async function executeCommand(
  cmd: string[],
  cwd: string
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
