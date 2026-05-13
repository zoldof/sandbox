// Eruda 本体とプラグインを順番にロード
await import('https://cdn.jsdelivr.net/npm/eruda');          // ← ESモジュール版があれば
await import('https://cdn.jsdelivr.net/npm/eruda-dom');
await import('https://cdn.jsdelivr.net/npm/eruda-fps');

// カスタム起動スクリプト
import '/sandbox/devtools/eruda.js';

// CSS は <link> を作って HEAD に追加
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/sandbox/devtools/eruda.css';
document.head.appendChild(link);
