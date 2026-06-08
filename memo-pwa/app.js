/* ==== 1. ヘッダー表示フラグ ==== */
let showHeader = true;               // 初期状態は表示
const headerEl = document.getElementById('appHeader');
const toggleBtn = document.getElementById('toggleHeaderBtn');

/* ==== 2. トグル処理 ==== */
function updateHeaderVisibility() {
  if (showHeader) {
    headerEl.style.display = 'flex';   // 必要なら CSS で layout を整える
    toggleBtn.textContent = '▲';
  } else {
    headerEl.style.display = 'none';
    toggleBtn.textContent = '▼';
  }
}

/* ボタンにハンドラを登録 */
toggleBtn.addEventListener('click', () => {
  showHeader = !showHeader;
  updateHeaderVisibility();
});

/* ==== 3. ヘッダー内部設定 ==== */
let fileHandle = null;
const editor = document.getElementById("editor");

document
    .getElementById("newBtn")
    .addEventListener("click", newFile);

document
    .getElementById('openFileBtn')
    .addEventListener("click", openFile);

document
    .getElementById("saveBtn")
    .addEventListener("click", saveFile);

document
    .getElementById("saveAsBtn")
    .addEventListener("click", saveAsFile);

document
    .getElementById("searchInput")
    .addEventListener("input", searchText);

async function openFile() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: "Text Files",
                accept: {
                    "text/plain": [".txt"]
                }
            }]
        });

        const file = await fileHandle.getFile();
        editor.value = await file.text();

    } catch(error) {
        if (error.name === "AbortError") {
            return;
        }
    
        editor.value =
            `${error.name}\n${error.message}`;
    }
}

async function newFile() {
    editor.value = "";
    fileHandle = null;
}

async function saveFile() {
    try {
        if (!fileHandle) {
            await saveAsFile();
            return;
        }
        const writable = await fileHandle.createWritable();
        await writable.write( editor.value );
        await writable.close();
    } catch (error) {
        console.error(error);
    }
}

async function saveAsFile() {
    try {
        fileHandle =
            await window.showSaveFilePicker({
                suggestedName: "memo.txt",
                types: [{
                    description: "Text Files",
                    accept: {
                        "text/plain": [".txt"]
                    }
                }]
            });
        await saveFile();
    } catch (error) {
        console.error(error);
    }
}

function searchText(event) {
    const keyword =
        event.target.value;
    if (!keyword) {
        return;
    }
    const pos = editor.value.indexOf(keyword);
    if (pos === -1) {
        return;
    }
    editor.focus();
    editor.setSelectionRange(
        pos,
        pos + keyword.length
    );
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./service-worker.js")
        .catch(console.error);
}
