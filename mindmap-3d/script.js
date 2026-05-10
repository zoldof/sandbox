// --- 基本設定 -------------------------------------------------
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- ライト ---------------------------------------------------
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// --- データ構造 ------------------------------------------------
let nodes = [];   // {mesh, id, label}
let edges = [];   // {line, fromId, toId}

// ノード作成関数
function createNode(position, label = 'Node') {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({color: 0x4a90e2});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  scene.add(mesh);

  const id = Date.now() + Math.random(); // 簡易ID
  nodes.push({mesh, id, label});
  return id;
}

// エッジ作成関数（直線）
function createEdge(fromId, toId) {
  const from = nodes.find(n => n.id === fromId);
  const to   = nodes.find(n => n.id === toId);
  if (!from || !to) return;

  const points = [from.mesh.position, to.mesh.position];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({color: 0x999999});
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  edges.push({line, fromId, toId});
}

// --- 初期ノード ------------------------------------------------
const rootId = createNode(new THREE.Vector3(0, 0, 0), 'Root');

// 周囲に数個サンプルノードを配置してエッジを接続
for (let i = 0; i < 5; i++) {
  const angle = (i / 5) * Math.PI * 2;
  const pos = new THREE.Vector3(
    8 * Math.cos(angle),
    8 * Math.sin(angle),
    0
  );
  const nid = createNode(pos, `Node ${i+1}`);
  createEdge(rootId, nid);
}

// --- インタラクション -----------------------------------------
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

canvas.addEventListener('pointerdown', (ev) => {
  mouse.set(
    (ev.clientX / window.innerWidth) * 2 - 1,
    -(ev.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    nodes.map(n => n.mesh)
  );

  if (intersects.length > 0) {
    // クリックしたノードをハイライト
    const hit = intersects[0].object;
    hit.material.emissive.setHex(0xffaa00);
    setTimeout(() => hit.material.emissive.setHex(0x000000), 300);
  } else {
    // 何も無ければカメラ前方に新規ノード追加
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const pos = camera.position.clone().add(dir.multiplyScalar(12));
    const newId = createNode(pos, 'New');
    // 例として最後に作ったノードと root を接続
    createEdge(rootId, newId);
  }
});

// --- アニメーションループ ---------------------------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// --- ウィンドウリサイズ対応 ------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
