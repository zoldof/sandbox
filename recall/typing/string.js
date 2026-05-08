import { randomString } from 'sandbox/recall/util.js';

const cnt = 10;
const len = 8;

// ---------- 10問生成 ----------
function generateProblems(count, length) {
  const problems = [];
  for (let i = 0; i < count; i++) {
    problems.push({
      id: i,
      text: randomString(length)   // 正解文字列
    });
  }
  return problems;
}

const problems = generateProblems(cnt, len);   // ページ読み込み時に一度だけ作成

// ---------- 表示 ----------
function renderProblem(problem, idx) {
  const q = document.getElementById('question');
  q.innerHTML = `
    <div class="prompt">問題 ${idx + 1} / ${problems.length}</div>
    <div class="target" style="font-size:2rem;letter-spacing:0.2em;">
      ${problem.text.split('').join(' ')}
    </div>
  `;
}

// 初回描画（最初の1問だけ）
renderProblem(problems[0], 0);
