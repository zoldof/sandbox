const src = await fetch('/sandbox/devtools/eruda.html').then(r => r.text());
const tmpl = document.getElementById('uiTemplate');
tmpl.innerHTML = src.trim();
document.body.appendChild(tmpl.content.cloneNode(true));
