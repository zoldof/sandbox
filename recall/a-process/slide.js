import { shuffle, showAverage } from "/sandbox/recall/util.js";
import { createNavigator } from "/sandbox/recall/nav.js";

// ---- グローバル変数 ----
const MAX_TIME_MS = 10 * 60 * 1000;
let startTime = null;
let timerId = null;
let avgTime = null;
let mesrBtn = null;

// ---- 画像ファイルを取得 & 件数取得 ----
/* async function loadSlides(max = 30) {
  const slides = [];
  for (let i = 1; i <= max; i++) {
    const file = `images/${String(i).padStart(2, '0')}.jpg`;
    const res = await fetch(file, {method: 'HEAD'});
    if (!res.ok) break;
    slides.push({ src: file });
  }
  return slides;
} */

const IMAGE_COUNT = 7;
async function loadSlides() {
  return Array.from({ length: IMAGE_COUNT }, (_, i) => ({
    src: `images/${String(i + 1).padStart(2, '0')}.jpg`
  }));
}

const slides = await loadSlides();

// ---------- ランダム化 ----------
// 元の slides 配列は残したい場合はコピーしてからシャッフル
const shuffledSlides = shuffle([...slides]);

// ---------- 描画関数 ----------
function renderImg(item, idx) {
  // 画像＋キャプションを #question に描画
  const el = document.getElementById("question");
  el.innerHTML = `<img src="${item.src}" class="slide-img">`;

  // 右上の進捗を更新
  const prog = document.getElementById("progress");
  prog.textContent = `${idx + 1} / ${slides.length}`;
  
  // 平均所要時間の計測ボタンを表示する
  if (idx === slides.length - 1) mesrBtn.hidden = false;
}

// ---------- ナビゲータ作成 ----------
const nav = createNavigator({slides :shuffledSlides, render: renderImg});

// ボタンをナビと結び付け
nav.bindButtons(
  document.getElementById("prevBtn"),
  document.getElementById("nextBtn")
);

// 平均所要時間を計測する
avgTime = document.getElementById('avgTime');
startTime = showAverage(shuffledSlides, startTime, timerId, avgTime);
timerId = setTimeout(() => { avgTime.textContent = "計測上限超過"; }, MAX_TIME_MS);

mesrBtn = document.getElementById('mesrBtn');
mesrBtn.addEventListener('click', () => {
  startTime = showAverage(shuffledSlides, startTime, timerId, avgTime);
  mesrBtn.disabled = true;
});

// 初回描画
renderImg(shuffledSlides[0], 0);
nav.updateButtons(); 
document.getElementById('answBtn').disabled = true;
