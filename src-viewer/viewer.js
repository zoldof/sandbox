document.getElementById('load').addEventListener('click', async () => {
    const url = document.getElementById('url').value.trim();
    if (!url) return alert('URL を入力してください');

    try {
        // GitHub Pages は CORS ヘッダーが付かないページを取得できません。
        // 同一オリジンか、CORS 許可されている URL を指定してください。
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const text = await resp.text();
        const codeEl = document.querySelector('#output code');
        codeEl.textContent = text;               // 生のテキストを設定
        Prism.highlightElement(codeEl);          // ハイライト
    } catch (e) {
        alert(`取得失敗: ${e.message}`);
    }
});
