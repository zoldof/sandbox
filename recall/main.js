const STORAGE_KEY = "shortcut_state";
const counts = 30;
let shortcuts = [];
let questions = [];
let current = 0;
  
// CSV読込
async function loadCSV(csvPath) {
  const res = await fetch(csvPath);
  const text = await res.text();

  return text.trim().split("\n").slice(1).map(line => {
    const [answer, question] = line.split(",");
    return { answer, question };
  });
}

// 初期データ設定 
// DOM が完成したらすぐ実行
document.addEventListener("DOMContentLoaded", async () => {
  const appEl   = document.getElementById("app");
  const csvPath = appEl.dataset.csv.trim();
  const allData = await loadCSV(csvPath);
  shortcuts = allData.map(d => d.question);
  
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      render();
    }
  });
  nextBtn.addEventListener('click', () => {
    if (current < questions.length - 1) {
      current++;
      render();
    }
  });
  
  start();
});

// フィッシャー・イェーツのシャッフル
// デクリメントのデータの減少に合わせた効率的な並べ替えのアルゴリズム
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 状態取得 or 初期化
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  let state = "";
  if (saved) {
    state = JSON.parse(saved)
    if (state.index <= state.order.length - 1) 
    return state;
  }

  // 初回のみ
  const shuffled = shuffle([...shortcuts]);

  state = {
    order: shuffled,
    index: 0
  };
  
  saveState(state);
  return state;
}

// 状態保存
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

// 初期化
function start() {
  questions = getTodayQuestions();
  current = 0;
  render();
}

// 描画
function render() {
  document.getElementById("question").innerText = questions[current];
  document.getElementById("progress").innerText = `${current + 1} / ${questions.length}`;
}

// 次へ
function next() {
  if (current < questions.length - 1) {
    current++;
    render();
  }
}

// 戻る
function prev() {
  if (current > 0) {
    current--;
    render();
  }
}
