// デバッグツールを自動起動
// 本番で無効化したい場合は、環境変数やクエリパラメータで制御してください。
// 例: if (location.search.includes('debug')) { eruda.init(); }
eruda.init();               // トグルボタン生成
eruda.add(erudaDom());      // DOM 検査プラグイン（任意）
eruda.add(erudaFps());      // FPS 表示プラグイン（任意）
