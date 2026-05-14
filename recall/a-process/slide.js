import { shuffle, showAverage } from "/sandbox/recall/util.js";
import { createNavigator } from "/sandbox/recall/nav.js";

// ---- グローバル変数 ----
let startTime = null;
let endTime = null;

// ---- 画像ファイルを取得 & 件数取得 ----
async function loadSlides(max = 30) {
  const slides = [];
  for (let i = 1; i <= max; i++) {
    const file = `images/${String(i).padStart(2, '0')}.jpg`;
    const res = await fetch(file, {method: 'HEAD'});
    if (!res.ok) break;
    slides.push({ src: file });
  }
  return slides;
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

  // 平均所要時間を計算する
  if (idx === 0) startTime = performance.now();
  if (idx === slides.length - 1) {
    endTime = performance.now();
    const avgEl = document.getElementById('avgTime');
    avgEl.textContent = showAverage(slides, startTime, endTime);
  }
  
  // 右上の進捗を更新
  const prog = document.getElementById("progress");
  prog.textContent = `${idx + 1} / ${slides.length}`;
}

// ---------- ナビゲータ作成 ----------
const nav = createNavigator({slides :shuffledSlides, render: renderImg});

// ボタンをナビと結び付け
nav.bindButtons(
  document.getElementById("prevBtn"),
  document.getElementById("nextBtn")
);

// 初回描画
renderImg(shuffledSlides[0], 0);
nav.updateButtons(); 
document.getElementById('answBtn').disabled = true;
