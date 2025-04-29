import { join } from "@std/path";
import { exists, ensureDir } from "@std/fs";

// キャッシュディレクトリの設定
const HOME_DIR = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "~";
const CACHE_DIR = join(HOME_DIR, ".cache", "uni-run");
const CACHE_FILE = join(CACHE_DIR, "cache.json");

// キャッシュの型定義
interface ScriptCache {
  [directory: string]: string; // ディレクトリパス → 選択したスクリプト名
}

/**
 * キャッシュを読み込む
 *
 * @returns キャッシュデータ
 */
export async function loadCache(): Promise<ScriptCache> {
  try {
    if (await exists(CACHE_FILE)) {
      const content = await Deno.readTextFile(CACHE_FILE);
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to load cache:", error.message);
  }
  return {};
}

/**
 * キャッシュを保存
 *
 * @param directory 実行ディレクトリ
 * @param scriptName 選択したスクリプト名
 */
export async function saveCache(
  directory: string,
  scriptName: string
): Promise<void> {
  try {
    // キャッシュディレクトリがなければ作成
    await ensureDir(CACHE_DIR);

    // 既存のキャッシュを読み込み
    const cache = await loadCache();

    // 新しい情報を追加
    cache[directory] = scriptName;

    // キャッシュを書き込み
    await Deno.writeTextFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error("Failed to save cache:", error.message);
  }
}

/**
 * 実行ディレクトリに対応する前回のスクリプト選択を取得
 *
 * @param directory 実行ディレクトリ
 * @returns 前回選択したスクリプト名、なければundefined
 */
export async function getLastScript(
  directory: string
): Promise<string | undefined> {
  const cache = await loadCache();
  return cache[directory];
}
