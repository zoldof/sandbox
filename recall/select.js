// ページ全体のロードは待たずに監視開始
const observer = new MutationObserver((mutations, obs) => {
  const nav = document.getElementById('navSelect');
  if (nav) {
    // 目的の要素が見つかったらリスナを付けて監視を止める
    nav.addEventListener('change', function () {
      if (this.value) location.href = this.value;
    });
    obs.disconnect();   // 以降の監視は不要
  }
});

// <body> 直下（またはテンプレートが挿入される親要素）を監視
observer.observe(document.body, {
  childList: true,   // 子ノードの追加・削除を検知
  subtree: true      // 深い階層も対象
});

