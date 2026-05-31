let fileHandle = null;
const editor = document.getElementById("editor");

document
    .getElementById("newBtn")
    .addEventListener("click", newFile);

document
    .getElementById("saveBtn")
    .addEventListener("click", saveFile);

document
    .getElementById("saveAsBtn")
    .addEventListener("click", saveAsFile);

document
    .getElementById("searchInput")
    .addEventListener("input", searchText);

document
    .getElementById('filePicker')
    .addEventListener('change', openFile);

async function openFile(event) {
    const file = event.target.files[0];
    if (file) {
        const text = await file.text();
        document.getElementById('editor').value = text;
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
