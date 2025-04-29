import { Select } from "@cliffy/prompt";
import type { Script } from "../types.ts";

/**
 * インタラクティブにスクリプトを選択する
 *
 * @param scripts 選択可能なスクリプト一覧
 * @param defaultScript デフォルトで選択するスクリプト名
 * @returns 選択されたスクリプト、キャンセルされた場合はnull
 */
export async function selectScript(
  scripts: Script[],
  defaultScript?: string
): Promise<Script | null> {
  try {
    // Cliffyの選択UIのためのオプションを作成
    const options = scripts.map((script) => ({
      name: script.name,
      value: script.name,
      description: script.description,
    }));

    // インタラクティブ選択UIを表示（デフォルト値を設定）
    const selectedName = await Select.prompt<string>({
      message: "Select a script to run:",
      options,
      default: defaultScript, // デフォルト選択を設定
      search: true, // 検索機能を有効化
    });

    // 選択結果からスクリプトオブジェクトを特定して返す
    return scripts.find((script) => script.name === selectedName) || null;
  } catch (error) {
    // ユーザーがCtrl+Cなどでキャンセルした場合
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    throw error;
  }
}
