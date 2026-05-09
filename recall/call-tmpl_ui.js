export async function loadTemplate() {
  const src = await fetch('/sandbox/recall/ui.html').then(r => r.text());
  const tmpl = document.getElementById('uiTemplate');
  tmpl.innerHTML = src.trim();
  document.body.appendChild(tmpl.content.cloneNode(true));
}
