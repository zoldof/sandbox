import { generateProblems } from "/sandbox/recall/util.js";

const length = 8;
const count = 10;
let current = 0;
const problems = generateProblems(count, length);   // ページ読み込み時に一度だけ作成

// ---------- 描画関数 ----------
function renderStr(idx) {
  const el = document.getElementById("question");
  el.textContent = problems[idx].text.split('').join(' ');

  // 右上の進捗を更新
  const prog = document.getElementById("progress");
  prog.textContent = `${idx + 1} / ${problems.length}`;
}

// ---------- ナビゲータ作成 ----------
function next() {
  if (current < data.length - 1) {
    current++;
    renderStr(current);
  }
}

// Enterで次の問題を表示する
function setupEnterKey() {
  document.body.addEventListener('keydown', (e) => {
    // フォーカスが入力欄などにある場合は除外できるが、現在は入力欄が無いので、そのまま Enter のみ処理
    if (e.key === 'Enter') {
      e.preventDefault();
      next();
    }
  });
}

// 初回描画
renderStr(0);
setupEnterKey();
