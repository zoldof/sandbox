// フィッシャー・イェーツのシャッフル
// デクリメントのデータの減少に合わせた効率的な並べ替えのアルゴリズム
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
