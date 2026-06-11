/* ==== 1. ヘッダー表示フラグ ==== */
let showHeader = true;               // 初期状態は表示
let currentPage = "memo";
const headerEl = document.getElementById('appHeader');
const toggleBtn = document.getElementById('toggleHeaderBtn');

/* ==== 2. トグル処理 ==== */
function updateHeaderLabel() {
    toggleBtn.textContent = `${showHeader ? '▼' : '▲'} ${currentPage}`;
}

function updateHeaderVisibility() {
    headerEl.style.display = showHeader ? 'flex' : 'none';
    updateHeaderLabel();
}

function refreshHeaderLabel() {
    currentPage = currentFileName.replace(".txt", "");
    updateHeaderLabel();
}

/* ボタンにハンドラを登録 */
toggleBtn.addEventListener('click', () => {
  showHeader = !showHeader;
  updateHeaderVisibility();
});

/* ==== 3. ヘッダー内部設定 ==== */
/** グローバル変数設定 **/
let currentFileName = "memo.txt";
const editor = document.getElementById("editor");

/** 要素取得とリスナーの設定 **/
document
    .getElementById("newBtn")
    .addEventListener("click", newFile);

// filePicker を直接表示させず、ボタンで呼び出す
document
    .getElementById('openFileBtn')
    .addEventListener('click', () => {
      document.getElementById('filePicker').click();
    });

document
    .getElementById('filePicker')
    .addEventListener('change', openFile);

document
    .getElementById("saveBtn")
    .addEventListener("click", saveFile);

document
    .getElementById("saveAsBtn")
    .addEventListener("click", saveAsFile);

/** リスナーの動作設定 **/
function newFile() {
    editor.value = "";
    currentFileName = "memo.txt";
    refreshHeaderLabel();
}

async function openFile(event) {
    const file = event.target.files[0];
    if (file) {
        currentFileName = file.name;
        refreshHeaderLabel();
        editor.value = await file.text();
    }
}

function downloadText(text, filename) {
    const blob = new Blob(["\uFEFF" + text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveFile() {
    if (editor.value.trim() === "") return;
    downloadText(editor.value, currentFileName);
}

function saveAsFile() {
    if (!editor.value.trim()) return;
    const fileName = prompt("ファイル名を入力", currentFileName);
    if (!fileName) return;
    currentFileName = fileName;
    refreshHeaderLabel();
    saveFile();
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./service-worker.js")
        .catch(console.error);
}
