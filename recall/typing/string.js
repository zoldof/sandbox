import { generateProblems } from "/sandbox/recall/util.js";
import { play, soundsReady } from '/sandbox/recall/typing/sound.js';

const length = 8;
const count  = 10;
const problems = generateProblems(count, length);

let current = 0;
let remaining = [];

// 音声オブジェクトの作成
await soundsReady;

// ---------- 描画 ----------
function render() {
  const el = document.getElementById("typing");
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
  }
}

// ---------- キー入力 ----------
function setupKeyHandler() {
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (remaining.length === 0) {
        next();
        play('next'); 
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
      play('correct');
    } else {
      setCurrentProblem(current);      // 同じ問題にリセット
      play('wrong');
    }
  });
}

// ---------- 初期化 ----------
setCurrentProblem(0);
setupKeyHandler();
