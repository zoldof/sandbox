import { generateProblems } from "/sandbox/recall/util.js";

const length = 8;
const count  = 10;
const problems = generateProblems(count, length);

let current = 0;
let remaining = [];

// ---------- 描画 ----------
function render() {
  const el = document.getElementById("question");
  el.textContent = remaining.join(' ');
  const prog = document.getElementById("progress");
  prog.textContent = `${current + 1} / ${problems.length}`;
}

// ---------- 問題セット ----------
function setCurrentProblem(idx) {
  const txt = problems[idx].text;
  remaining = [...txt];
  render();
}

// ---------- 次の問題 ----------
function next() {
  if (current < problems.length - 1) {
    current++;
    setCurrentProblem(current);
  } else {
    alert('すべての問題が終了しました！');
  }
}

// ---------- キー入力 ----------
function setupKeyHandler() {
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (remaining.length === 0) next();
      return;
    }

    // 無効キーは除外
    if (e.key.length !== 1) return;

    const typed = e.key;               // 必要に応じて .toUpperCase() などで正規化
    const expected = remaining[0];

    if (typed === expected) {
      remaining.shift();               // 正解 → 先頭を削除
      render();
    } else {
      alert('違う文字です。最初からやり直してください。');
      setCurrentProblem(current);      // 同じ問題にリセット
    }
  });
}

// ---------- 初期化 ----------
setCurrentProblem(0);
setupKeyHandler();
