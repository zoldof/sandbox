import { generateProblems, showAverage } from "/sandbox/recall/util.js";

const length = 8;
const count  = 10;
const problems = generateProblems(count, length);

let current = 0;
let remaining = [];

const MAX_TIME_MS = 10 * 60 * 1000;
let startTime = null;
let timerId = null;
let avgTime = null;

// ---------- 描画 ----------
function render() {
  const el = document.getElementById("typing");
  el.textContent = remaining.join('');
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
  }
}

// ---------- キー入力 ----------
function setupKeyHandler() {
  document.body.addEventListener('keydown', (e) => {  
    console.log(
      "key=", e.key,
      "expected=", remaining[0]
    );
    if (e.key === 'Enter') {
      e.preventDefault();
      if (remaining.length === 0) {
        if (current === problems.length - 1) {
          // 平均所要時間の計測結果を表示する
          startTime = showAverage(problems, startTime, timerId, avgTime);
        }
        // 画面遷移
        next();
      }
      return;
    }

    // 無効キーは除外
    if (e.key.length !== 1) return;

    const typed = e.key.toUpperCase();
    const expected = remaining[0];
    
    if (typed === expected) {
      remaining.shift();               // 正解 → 先頭を削除
      render();
    } else {
      setCurrentProblem(current);      // 同じ問題にリセット
    }
  });
}

/* ----- クリックでフォーカス対応 ----- 
window.addEventListener('load', () => {
  let hint = document.getElementById('focusHint');
  document.body.addEventListener('click', () => {
    if (hint) { hint.remove(); hint = null; }
  });
});
*/

// 平均所要時間の計測を開始する
avgTime = document.getElementById('avgTime');
startTime = showAverage(problems, startTime, timerId, avgTime);
timerId = setTimeout(() => { avgTime.textContent = "計測上限超過"; }, MAX_TIME_MS);

// ---------- 初期化 ----------
setCurrentProblem(0);
setupKeyHandler();

console.log(document.activeElement);
console.log(document.hasFocus());
