// デバッグツールを自動起動
// 本番で無効化したい場合は、環境変数やクエリパラメータで制御してください。
// 例: if (location.search.includes('debug')) { eruda.init(); }
eruda.init();
// 任意プラグインを追加
eruda.add(erudaDom());
eruda.add(erudaFps());
