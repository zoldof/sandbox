// nav.js – 汎用スライド／ページングナビゲータ
// このモジュールは「前へ / 次へ / 任意インデックスへジャンプ」だけを担う、軽量なステートマシンです。

// どこからでもインポートできる汎用モジュール
export function createNavigator({slides, initial = 0, render}) {
  // slides は任意の型 T の配列
  /* @type {Array<unknown>} */
  const data = slides;            // ただの参照、型は呼び出し側が決める
  let current = initial;
  let prevBtn = null;
  let nextBtn = null;

  // ==== 描画関数における引数の場合分け ====
  function callRender(item, idx) {
    const arity = render.length;
    if (arity === 0) {
      render();
    } else if (arity === 1) {
      render(item);
    } else {
      render(item, idx);
    }
  }

  // ==== インデックス操作 ====
  function prev() {
    if (current > 0) {
      current--;
      callRender(data[current], current);   // ← データと index を渡す
      updateButtons(); 
    }
  }

  function next() {
    if (current < data.length - 1) {
      current++;
      callRender(data[current], current);
      updateButtons(); 
    }
  }

  // ==== UI バインディング ====
  function bindButtons(pBtn, nBtn) {
    prevBtn = pBtn;
    nextBtn = nBtn;
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
  }

  function updateButtons() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === data.length - 1;
  }

  // ==== 補助メソッド ====
  function getIndex() { return current; }
  function goTo(idx) {
    const i = Math.max(0, Math.min(idx, data.length - 1));
    if (i !== current) {
      current = i;
      callRender(data[current], current);
      updateButtons(); 
    }
  }

  // API をオブジェクトで返す
  return {prev, next, bindButtons, updateButtons, getIndex, goTo};
}
