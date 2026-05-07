// -----------------------------------------------------------------
// ① 定数・グローバル変数
// -----------------------------------------------------------------

const general = "shortcut"; // 現状ではデフォルトショートカット機能は未使用
const counts = 30;
let STORAGE_KEY = "";
let shortcuts = [];
let questions = [];
let current = 0;

// -----------------------------------------------------------------
// ② ユーティリティー
// -----------------------------------------------------------------

// CSV読込
async function loadCSV(csvPath) {
  const res = await fetch(csvPath);
  const text = await res.text();

  return text.trim().split("\n").slice(1).map(line => {
    const [answer, question] = line.split(",");
    return { answer, question };
  });
}

// -----------------------------------------------------------------
// ③ 状態保存・ロード
// -----------------------------------------------------------------

// 状態保存
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 状態取得 or 初期化
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  let state = "";
  if (saved) {
    state = JSON.parse(saved)
    if (state.index < state.order.length - counts) {
      return state;
    }
  }

  // 初回もしくは残存問題数が不足した場合
  const shuffled = shuffle([...shortcuts]);

  state = {
    order: shuffled,
    index: 0
  };
  
  saveState(state);
  return state;
}

// 今日の問題取得
function getTodayQuestions() {
  const state = loadState();
  const start = state.index;
  const end = Math.min(start + counts, state.order.length);
  const today = state.order.slice(start, end);

  // 次回のために更新
  state.index = end;
  saveState(state);

  return today;
}

// -----------------------------------------------------------------
// ④ 描画・実行設定
// -----------------------------------------------------------------

// 描画
function render() {
  document.getElementById("question").innerText = questions[current];
  document.getElementById("progress").innerText = `${current + 1} / ${questions.length}`;
}

// 初期化
function start() {
  questions = getTodayQuestions();
  current = 0;
  render();
}

// 戻る
function prev() {
  if (current > 0) {
    current--;
    render();
  }
}

// 次へ
function next() {
  if (current < questions.length - 1) {
    current++;
    render();
  }
}

// -----------------------------------------------------------------
// ⑤ DOM構築後のイベントハンドラ設定・初回実行
// -----------------------------------------------------------------

// 初期データ設定 
// DOM構築が完成したらすぐ実行
document.addEventListener("DOMContentLoaded", async () => {
  // htmlで指定したdataset.csvからパスを取得し1列の配列に整形
  const appEl   = document.getElementById("app");
  const csvPath = appEl.dataset.csv.trim();
  const allData = await loadCSV(csvPath);
  shortcuts = allData.map(d => d.question);

  // 文字列のcsvPathをorigin含めた絶対URLに変換して抽出分割
  const origin = window.location.origin; 
  const csvUrl = new URL(csvPath, origin);
  const parts = csvUrl.pathname.split('/').filter(Boolean);

  // STORAGE_KEYの振り分け
  STORAGE_KEY = parts[3];
  
  // 回答確認場所へのリンクパス作成部品
  const user = csvUrl.hostname.split('.')[0];
  const repo = parts[0];
  const regex = new RegExp(`^/${repo}/`);

  // エクセルショートカットの暗記用ページへのリンクパス作成部品
  const segments = parts.splice(0, 3);

  // 共用変数を定義
  let newPath = "";
  let externalUrl = "";

  // 変数にボタン要素を格納
  const answBtn = document.getElementById('answBtn');
  const shctBtn = document.getElementById('shctBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // イベントハンドラ設定
  answBtn.addEventListener('click', () => {
    newPath = csvUrl.pathname.replace(regex, "");
    externalUrl = `https://github.com/${user}/${repo}/blob/main/${newPath}`;
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  });
  shctBtn.addEventListener('click', () => {
    newPath = segments.join('/');
    externalUrl = `${origin}/${newPath}/${general}/`;
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  });
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  
  // 初回実行
  start();
});

