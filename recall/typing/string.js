import { generateProblems } from "/sandbox/recall/util.js";
import { createNavigator } from "/sandbox/recall/nav.js";

const length = 8;
const count = 10;
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
const nav = createNavigator({slides :problems, render: renderStr});

// ボタンをナビと結び付け
nav.bindButtons(
  document.getElementById("prevBtn"),
  document.getElementById("nextBtn")
);

// Enterで次の問題を表示する
function setupEnterKey() {
  document.body.addEventListener('keydown', (e) => {
    // フォーカスが入力欄などにある場合は除外できるが、現在は入力欄が無いので、そのまま Enter のみ処理
    if (e.key === 'Enter') {
      e.preventDefault();
      nav.next();
    }
  });
}

// 初回描画
renderStr(0);
nav.updateButtons(); 
document.getElementById("answBtn").hidden = true;
document.getElementById("navSelect").hidden = true;

setupEnterKey();
