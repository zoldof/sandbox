//  同じ文字を使わずに len 文字のランダム文字列を作る
const CHAR_POOL = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',   // 大文字
  ...'0123456789',                     // 数字
  ...'!@#$%^&*()-_=+[]{};:,<.>/?'      // 記号（好きなもので増減可）
];

function randomString(len) {
  const pool = [...CHAR_POOL];
  let result = '';
  for (let i = 0; i < len; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result += pool.splice(idx, 1)[0]; // 使った文字はプールから除去
  }
  return result;
}

export function generateProblems(cnt, len) {
  const problems = [];
  for (let i = 0; i < cnt; i++) {
    problems.push({
      id: i,
      text: randomString(len)   // 正解文字列
    });
  }
  return problems;
}

// フィッシャー・イェーツのシャッフル
// デクリメントのデータの減少に合わせた効率的な並べ替えのアルゴリズム
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
