/**
 * サポートされているプロジェクトタイプ
 */
export type ProjectType = "npm" | "yarn" | "pnpm" | "bun" | "deno" | null;

/**
 * スクリプト情報
 */
export interface Script {
  name: string;
  description: string;
}

/**
 * スクリプト実行者インターフェース
 */
export interface Runner {
  /**
   * 利用可能なスクリプト一覧を取得
   */
  getScripts(): Promise<Script[]>;

  /**
   * 指定されたスクリプトが存在するか確認
   */
  hasScript(name: string): Promise<boolean>;

  /**
   * スクリプトを実行
   */
  runScript(name: string, args: string[]): Promise<void>;
}
