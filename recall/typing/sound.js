// 1️⃣ AudioContext の作成（ページで 1 回だけ実行）
const ctx = new (window.AudioContext || window.webkitAudioContext)();

// 2️⃣ ファイルパスとバッファ格納用オブジェクト
const files = {
  correct: '/sounds/type.mp3',
  wrong:   '/sounds/wrong.mp3',
  next:    '/sounds/next.mp3'
};
const buffers = {};   // {correct: AudioBuffer, ...}

// 3️⃣ すべての音声を fetch → decode してバッファに保存
async function loadAll() {
  await Promise.all(
    Object.entries(files).map(async ([key, url]) => {
      const resp = await fetch(url);
      const array = await resp.arrayBuffer();
      buffers[key] = await ctx.decodeAudioData(array);
    })
  );
}

// ページが読み込まれたらすぐにロード開始
loadAll().catch(e => console.error('sound load error:', e));

// 4️⃣ 再生関数（即時再生）
//    - AudioContext がサスペンド状態なら resume() で起動
//    - 存在しないキーが来たら何もしない（安全策）
export function play(name) {
  if (!buffers[name]) return;          // バッファが無いときは無視

  if (ctx.state === 'suspended') ctx.resume();

  const src = ctx.createBufferSource();
  src.buffer = buffers[name];
  src.connect(ctx.destination);
  src.start(0);
}

// -------------------------------------------------
// 任意でデバッグ用に「ロード完了イベント」を出す
export const soundsReady = new Promise(resolve => {
  // loadAll が終わったら resolve
  loadAll().then(() => resolve());
});
