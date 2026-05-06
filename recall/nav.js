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

  // ==== インデックス操作 ====
  function prev() {
    if (current > 0) {
      current--;
      render(data[current], current);   // ← データと index を渡す
      updateButtons(); 
    }
  }

  function next() {
    if (current < data.length - 1) {
      current++;
      render(data[current], current);
      updateButtons(); 
    }
  }

  // ==== UI バインディング ====
  function bindButtons(pBtn, nBtn) {
    prevBtn = pBtn;
    nextBtn = nBtn;
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    updateButtons(); 
  }

  function updateButtons(prevBtn, nextBtn) {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === data.length - 1;
  }

  // ==== 補助メソッド ====
  function getIndex() { return current; }
  function goTo(idx) {
    const i = Math.max(0, Math.min(idx, data.length - 1));
    if (i !== current) {
      current = i;
      render(data[current], current);
      updateButtons(); 
    }
  }

  // API をオブジェクトで返す
  return {prev, next, bindButtons, updateButtons, getIndex, goTo};
}
