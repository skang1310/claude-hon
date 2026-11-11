import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import LOGOS from './logos.js';

const $ = id => document.getElementById(id);
const cv = $('c');

/* ================= 데이터 ================= */
const T0 = ['버그','커피','포스트잇','지라 티켓','엑셀 시트','PPT 장표','뉴스레터','회의록','TODO 주석','스톡 이미지','Lorem ipsum','견적서'];
// [표시 이름, 로고 slug, 브랜드 색]
const T1 = [['Fiverr','fiverr','#1DBF73'],['Upwork','upwork','#14A800'],['Wix','wix','#0C6EFC'],['Squarespace','squarespace','#222222'],['WordPress','wordpress','#21759B'],
  ['Medium','medium','#1A1A1A'],['Substack','substack','#FF6719'],['Linktree','linktree','#2DBE4E'],['Calendly','calendly','#006BFF'],['Loom','loom','#625DF5'],
  ['Evernote','evernote','#00A82D'],['Buffer','buffer','#231F20'],['Bitly','bitly','#EE6123'],['Gumroad','gumroad','#FF90E8'],['Quizlet','quizlet','#4255FF'],
  ['Udemy','udemy','#A435F0'],['Coursera','coursera','#0056D2'],['DeepL','deepl','#0F2B46'],['Codecademy','codecademy','#1F4056'],['Envato','envato','#6CBF2E'],
  ['Shutterstock','shutterstock','#EE2B24'],['Unsplash','unsplash','#111111'],['Dribbble','dribbble','#EA4C89'],['Behance','behance','#1769FF'],['Todoist','todoist','#E44332'],
  ['Ghost','ghost','#15171A'],['Glitch','glitch','#3333FF'],['CodePen','codepen','#1E1F26'],['Toggl','toggl','#E01B22'],['Basecamp','basecamp','#1D2D35'],
  ['Tistory','tistory','#EB531F'],['Velog','velog','#20C997'],['Pinterest','pinterest','#BD081C'],['Patreon','patreon','#FF424D'],['Kickstarter','kickstarter','#05CE78'],['Product Hunt','producthunt','#DA552F']];
const T2 = [['Notion','notion','#2A2A2A'],['Slack','slack','#4A154B'],['Figma','figma','#F24E1E'],['Canva','canva','#00C4CC'],['Jira','jira','#0052CC'],['Zendesk','zendesk','#03363D'],
  ['Grammarly','grammarly','#15C39A'],['Duolingo','duolingo','#58CC02'],['Zoom','zoom','#2D8CFF'],['Dropbox','dropbox','#0061FF'],['Asana','asana','#F06A6A'],['Trello','trello','#0079BF'],
  ['Airtable','airtable','#FCB400'],['Webflow','webflow','#146EF5'],['Framer','framer','#0055FF'],['Miro','miro','#FFD02F'],['Intercom','intercom','#1F8DED'],['HubSpot','hubspot','#FF7A59'],
  ['Mailchimp','mailchimp','#FFE01B'],['Typeform','typeform','#3A3A3C'],['Linear','linear','#5E6AD2'],['Cursor','cursor','#333333'],['Vercel','vercel','#1A1A1A'],['Replit','replit','#F26207'],
  ['Zapier','zapier','#FF4A00'],['Stack Overflow','stackoverflow','#F48024'],['Sketch','sketch','#FDAD00'],['GitLab','gitlab','#FC6D26'],['Stripe','stripe','#635BFF'],['Discord','discord','#5865F2'],
  ['Twilio','twilio','#F22F46'],['ClickUp','clickup','#7B68EE'],['Datadog','datadog','#632CA6'],['Okta','okta','#007DC1'],['Snowflake','snowflake','#29B5E8']];
const T3 = [['Adobe','adobe','#FA0F00'],['Salesforce','salesforce','#00A1E0'],['Atlassian','atlassian','#0052CC'],['GitHub','github','#24292F'],['Shopify','shopify','#7AB55C'],['SAP','sap','#0FAAFF'],
  ['Oracle','oracle','#C74634'],['Accenture','accenture','#A100FF'],['네이버','naver','#03C75A'],['카카오','kakao','#FEE500'],['Netflix','netflix','#E50914'],['Uber','uber','#222222'],
  ['Spotify','spotify','#1DB954'],['IBM','ibm','#1F70C1'],['Cisco','cisco','#1BA0D7'],['Intel','intel','#0071C5'],['PayPal','paypal','#003087'],['LINE','line','#00C300'],['Airbnb','airbnb','#FF5A5F'],['LinkedIn','linkedin','#0A66C2']];
const T4 = [['Microsoft','microsoft','#00A4EF','오피스째로 접수'],['Google','google','#4285F4','검색 대신 물어보세요'],['Apple','apple','#6E6E73','사과 한 입'],
  ['Amazon','amazon','#FF9900','장바구니째 인수'],['Meta','meta','#0866FF','메타버스도 같이 굴림'],['NVIDIA','nvidia','#76B900','GPU 직접 조달 완료'],
  ['OpenAI','openai','#10A37F','라이벌 정리 완료'],['삼성','samsung','#1428A0','반도체까지 확보'],['Tesla','tesla','#CC0000','자율주행으로 굴러옴']];
const TIERS = [
  { name:'잡무',         rmin:5,   rmax:9,   d0:45,   d1:430 },
  { name:'스타트업',     rmin:14,  rmax:22,  d0:170,  d1:880 },
  { name:'SaaS',         rmin:30,  rmax:50,  d0:520,  d1:1750 },
  { name:'엔터프라이즈', rmin:75,  rmax:115, d0:1300, d1:2950 },
  { name:'빅테크',       rmin:170, rmax:250, d0:2500, d1:4000 },
];
const WORLD_R = 4400, EAT = 0.9, GROW = 0.2, GAME_TIME = 150, R0 = 12;
const ROADS = [{ R: 470, w: 40 }, { R: 1050, w: 76 }, { R: 2000, w: 136 }, { R: 3300, w: 230 }];
const SPOKES = 8, SPOKE0 = 0.39;
const spokeW = d => d < 1050 ? 44 : d < 2000 ? 80 : 140;
const FONT = '-apple-system,"Apple SD Gothic Neo","Pretendard","Noto Sans KR",system-ui,sans-serif';

const qs = new URLSearchParams(location.search);
const kst = new Date(Date.now() + 9 * 3600e3);
const DAY = Math.max(1, Math.floor((Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()) - Date.UTC(2026, 10, 10)) / 864e5) + 1);
const SEED = qs.get('seed') ? (parseInt(qs.get('seed'), 10) || 1) : DAY * 7919 + 13;
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ================= 렌더러 ================= */
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' }); }
catch (e) { $('err').style.display = 'flex'; throw e; }
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.5;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const MAXAN = renderer.capabilities.getMaxAnisotropy();
const scene = new THREE.Scene();
const HAZE = new THREE.Color().setRGB(0.62, 0.98, 1.62);
scene.fog = new THREE.FogExp2(HAZE, 0.0006);
const FOV = 52;
const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 10000);
const SUN = new THREE.Vector3(-0.58, 0.62, 0.53).normalize();

const sky = new Sky();
{ const u = sky.material.uniforms; u.turbidity.value = 1.6; u.rayleigh.value = 2.3; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.82; u.sunPosition.value.copy(SUN); }
{ const pm = new THREE.PMREMGenerator(renderer), es = new THREE.Scene(); sky.scale.setScalar(1000); es.add(sky); scene.environment = pm.fromScene(es, 0, 0.1, 5000).texture; pm.dispose(); }
const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { hz: { value: HAZE }, zn: { value: new THREE.Color().setRGB(0.2, 0.6, 2.1) }, sunDir: { value: SUN }, night: { value: 0 } },
  vertexShader: 'varying vec3 d; void main(){ d = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform vec3 hz; uniform vec3 zn; uniform vec3 sunDir; uniform float night; varying vec3 d;
    float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
    void main(){ vec3 n = normalize(d); float t = pow(clamp(n.y - 0.02, 0.0, 1.0), 0.6);
      vec3 c = mix(hz, zn, t); float s = max(dot(n, sunDir), 0.0);
      c += mix(vec3(1.0, 0.85, 0.6), vec3(1.6, 0.55, 0.2), clamp(night * 2.5, 0.0, 1.0)) * (pow(s, 5.0) * (0.5 + night) + pow(s, 700.0) * 40.0);
      float st = step(0.9965, hash(floor(n * 190.0))) * smoothstep(0.45, 1.0, night) * smoothstep(0.02, 0.25, n.y);
      c += vec3(st * 2.2);
      gl_FragColor = vec4(c, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` }));
dome.frustumCulled = false; dome.renderOrder = -2; scene.add(dome);
const sun = new THREE.DirectionalLight('#FFEFD6', 4.2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; scene.add(sun, sun.target);
const hemi = new THREE.HemisphereLight('#DCEBFF', '#8A7F6C', 0.25); scene.add(hemi);
const ballLamp = new THREE.PointLight('#FFC58A', 0, 100, 0); scene.add(ballLamp);
const glowMats = [];

const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.16, 0.5, 2.6); composer.addPass(bloom);
composer.addPass(new OutputPass());
let W = 1, H = 1, quality = 2;
const isTouch = matchMedia('(pointer: coarse)').matches;
function resize() {
  W = window.innerWidth; H = window.innerHeight;
  const pr = Math.min(window.devicePixelRatio || 1, quality === 2 ? (isTouch ? 1.6 : 2) : quality === 1 ? 1.25 : 1);
  renderer.setPixelRatio(pr); renderer.setSize(W, H, false);
  composer.setPixelRatio(pr); composer.setSize(W, H);
  camera.aspect = W / H; camera.updateProjectionMatrix();
}
function setQuality(q) {
  quality = q;
  sun.shadow.mapSize.setScalar(q === 2 ? 2048 : 1024); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  renderer.shadowMap.enabled = q > 0; sun.castShadow = q > 0;
  scene.traverse(o => { if (o.material) [].concat(o.material).forEach(m => { m.needsUpdate = true; }); });
  resize();
}
window.addEventListener('resize', resize); resize();

/* ================= 에셋: 텍스처 ================= */
function canvasTex(w, h, fn, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  fn(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, MAXAN); return t;
}
const tile = t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
function speckle(c, w, h, n, cols, s0, s1, seed) { const r = mulberry(seed); for (let i = 0; i < n; i++) { c.fillStyle = cols[(r() * cols.length) | 0]; const s = s0 + r() * (s1 - s0); c.fillRect(r() * w, r() * h, s, s); } }
/* 브랜드 로고(24×24 path)를 캔버스에 그린다 */
function drawLogo(c, slug, x, y, size, color) {
  const d = LOGOS[slug]; if (!d) return false;
  c.save(); c.translate(x, y); c.scale(size / 24, size / 24); c.fillStyle = color; c.fill(new Path2D(d)); c.restore(); return true;
}

const ballTex = canvasTex(2048, 1024, (c, w, h) => {
  c.fillStyle = '#D97757'; c.fillRect(0, 0, w, h);
  speckle(c, w, h, 9000, ['rgba(160,70,45,.16)', 'rgba(240,160,130,.16)', 'rgba(120,50,30,.1)'], 2, 7, 7);
  for (const x of [341, 1024, 1707]) drawLogo(c, 'claude', x - 190, 512 - 190, 380, '#FBF7F0');
});
const ballBump = canvasTex(1024, 512, (c, w, h) => { c.fillStyle = '#808080'; c.fillRect(0, 0, w, h); speckle(c, w, h, 7000, ['rgba(255,255,255,.2)', 'rgba(0,0,0,.2)'], 2, 6, 9); }, false);
const paverTex = tile(canvasTex(512, 512, (c, w, h) => {
  const r = mulberry(3);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const v = 154 + r() * 15; c.fillStyle = `rgb(${v},${v - 10},${v - 28})`; c.fillRect(i * 64, j * 64, 64, 64); }
  speckle(c, w, h, 14000, ['rgba(255,255,255,.07)', 'rgba(0,0,0,.07)', 'rgba(90,70,50,.06)'], 1, 4, 4);
  c.strokeStyle = 'rgba(90,76,58,.4)'; c.lineWidth = 2; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, h); c.moveTo(0, i * 64); c.lineTo(w, i * 64); c.stroke(); }
}));
const asphaltTex = tile(canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#3B3C40'; c.fillRect(0, 0, w, h);
  speckle(c, w, h, 26000, ['rgba(255,255,255,.07)', 'rgba(0,0,0,.14)', 'rgba(150,150,160,.08)'], 1, 3.5, 5);
  const r = mulberry(11); c.strokeStyle = 'rgba(15,15,18,.55)'; c.lineWidth = 2;
  for (let k = 0; k < 7; k++) { let x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); for (let i = 0; i < 9; i++) { x += (r() - .5) * 70; y += (r() - .3) * 50; c.lineTo(x, y); } c.stroke(); }
  for (let k = 0; k < 10; k++) { c.fillStyle = 'rgba(25,25,28,.25)'; c.beginPath(); c.ellipse(r() * w, r() * h, 20 + r() * 50, 12 + r() * 26, r() * 3, 0, 6.3); c.fill(); }
}));
const walkTex = tile(canvasTex(256, 256, (c, w, h) => {
  const r = mulberry(5);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = r() * 16; c.fillStyle = `rgb(${226 - v},${182 - v},${168 - v})`; c.fillRect(i * 64, j * 64, 64, 64); }
  speckle(c, w, h, 4000, ['rgba(255,255,255,.08)', 'rgba(0,0,0,.07)'], 1, 3, 6);
  c.strokeStyle = 'rgba(120,80,70,.5)'; c.lineWidth = 2; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, h); c.moveTo(0, i * 64); c.lineTo(w, i * 64); c.stroke(); }
}));
const grassTex = tile(canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#4F7F33'; c.fillRect(0, 0, w, h);
  speckle(c, w, h, 30000, ['rgba(120,170,70,.22)', 'rgba(30,70,20,.22)', 'rgba(170,190,90,.12)'], 1, 4, 8);
  const r = mulberry(12); for (let k = 0; k < 24; k++) { c.fillStyle = r() > .5 ? 'rgba(40,80,25,.12)' : 'rgba(130,170,80,.1)'; c.beginPath(); c.ellipse(r() * w, r() * h, 30 + r() * 60, 20 + r() * 40, r() * 3, 0, 6.3); c.fill(); }
}));
const sandTex = tile(canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#E2D2A6'; c.fillRect(0, 0, w, h); speckle(c, w, h, 9000, ['rgba(255,255,255,.12)', 'rgba(150,120,70,.1)'], 1, 3, 2); }));
const cloudTex = canvasTex(512, 256, (c) => {
  const r = mulberry(21);
  for (let i = 0; i < 46; i++) { const x = 70 + r() * 372, y = 150 - r() * 70 * Math.sin((x - 70) / 372 * Math.PI), s = 26 + r() * 46; const g = c.createRadialGradient(x, y, 0, x, y, s); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x - s, y - s, s * 2, s * 2); }
});
const frondTex = canvasTex(512, 128, (c, w, h) => {
  c.strokeStyle = '#3E6B22'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 64); c.lineTo(w, 64); c.stroke();
  for (let x = 6; x < w - 4; x += 9) { const l = 58 * Math.sin(Math.min(1, x / 90) * 1.57) * (1 - Math.pow(x / w, 3) * .8); const g = 70 + (x * 37 % 50);
    c.fillStyle = `rgb(${40 + (x * 13 % 30)},${g + 40},${30})`; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(x, 64); c.lineTo(x + 26, 64 + s * l); c.lineTo(x + 9, 64); c.fill(); } }
});
const trunkTex = tile(canvasTex(64, 256, (c, w, h) => { c.fillStyle = '#7A6248'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { c.fillStyle = 'rgba(40,28,18,.5)'; c.fillRect(0, y, w, 4); c.fillStyle = 'rgba(190,160,120,.25)'; c.fillRect(0, y + 6, w, 3); } speckle(c, w, h, 500, ['rgba(0,0,0,.15)', 'rgba(255,255,255,.1)'], 1, 4, 3); }));

/* 건물 외벽: 4×4 셀. map(색) + orm(G=거칠기, B=금속성) */
function facade(style) {
  const r = mulberry(40 + style), cells = [];
  for (let i = 0; i < 16; i++) cells.push(r());
  const draw = (c, orm) => {
    const F = (col, g, b) => { c.fillStyle = orm ? `rgb(0,${g},${b})` : col; };
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const x = i * 128, y = j * 128, v = cells[i * 4 + j];
      if (style === 0) {
        F('#1D2025', 130, 170); c.fillRect(x, y, 128, 128);
        F(`hsl(208,24%,${60 + v * 30}%)`, 10 + v * 34, 255); c.fillRect(x + 5, y + 5, 118, 92);
        F(`hsl(208,18%,${38 + v * 10}%)`, 70, 255); c.fillRect(x + 5, y + 101, 118, 22);
      } else if (style === 1) {
        F('#F1EDE5', 218, 0); c.fillRect(x, y, 128, 128);
        F(`hsl(210,22%,${22 + v * 14}%)`, 12 + v * 30, 255); c.fillRect(x, y + 34, 128, 70);
        F('#22262B', 120, 160); c.fillRect(x, y + 34, 4, 70); c.fillRect(x + 62, y + 34, 3, 70);
        F('#CFC9BE', 200, 0); c.fillRect(x, y + 104, 128, 5);
      } else {
        F('#E6DFD3', 222, 0); c.fillRect(x, y, 128, 128);
        F('#BDB5A8', 200, 0); c.fillRect(x + 18, y + 14, 92, 94);
        F(`hsl(212,24%,${20 + v * 16}%)`, 12 + v * 30, 255); c.fillRect(x + 24, y + 20, 80, 82);
        F('#2A2E33', 120, 160); c.fillRect(x + 62, y + 20, 4, 82);
      }
    }
  };
  const map = tile(canvasTex(512, 512, c => draw(c, false))), orm = tile(canvasTex(512, 512, c => draw(c, true), false));
  const R = style === 0 ? [5, 5, 118, 92] : style === 1 ? [0, 34, 128, 70] : [24, 20, 80, 82], lr = mulberry(90 + style), LC = ['#FFD9A0', '#FFE9C4', '#CFE4FF', '#FFC36B', '#FFF3D6'];
  const lit = tile(canvasTex(512, 512, c => { c.fillStyle = '#000'; c.fillRect(0, 0, 512, 512); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { if (lr() > .46) continue; c.globalAlpha = .55 + lr() * .45; c.fillStyle = LC[(lr() * LC.length) | 0]; c.fillRect(i * 64 + R[0] / 2, j * 64 + R[1] / 2, R[2] / 2, R[3] / 2); } c.globalAlpha = 1; }));
  lit.repeat.set(.5, .5);
  return { map, orm, lit };
}
const FAC = [facade(0), facade(1), facade(2)];

const texCache = {};
function signTex(name, slug, color) {
  const k = 's' + name + color; if (texCache[k]) return texCache[k];
  return texCache[k] = canvasTex(1024, 320, (c, w, h) => {
    const fg = lum(color) > 0.62 ? '#17181A' : '#FFFFFF';
    c.fillStyle = '#101214'; c.fillRect(0, 0, w, h);
    c.fillStyle = color; c.fillRect(14, 14, w - 28, h - 28);
    const has = !!LOGOS[slug], L = 196;
    c.font = '800 100px ' + FONT; const tw = c.measureText(name).width;
    const avail = w - 110 - (has ? L + 44 : 0), fs = Math.min(168, 100 * avail / tw), textW = tw * fs / 100, total = (has ? L + 44 : 0) + textW, x0 = (w - total) / 2;
    if (has) drawLogo(c, slug, x0, (h - L) / 2, L, fg);
    c.font = '800 ' + fs + 'px ' + FONT; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = fg; c.fillText(name, x0 + (has ? L + 44 : 0), h / 2 + fs * 0.04);
  });
}
function logoTex(slug, color) {
  const k = 'l' + slug + color; if (texCache[k]) return texCache[k];
  return texCache[k] = canvasTex(256, 256, c => { drawLogo(c, slug, 20, 20, 216, color); });
}
const lines = (c, x, y, w, n, gap, col) => { c.fillStyle = col; for (let i = 0; i < n; i++) { rr(c, x, y + i * gap, i % 3 === 2 ? w * 0.6 : w, 12, 6); c.fill(); } };
const DOCS = {
  '지라 티켓': c => { c.fillStyle = '#2684FF'; c.fillRect(0, 0, 256, 320); c.fillStyle = '#fff'; rr(c, 24, 28, 70, 70, 14); c.fill(); drawLogo(c, 'jira', 34, 38, 50, '#2684FF'); lines(c, 24, 130, 208, 5, 34, 'rgba(255,255,255,.85)'); },
  '엑셀 시트': c => { c.fillStyle = '#fff'; c.fillRect(0, 0, 256, 320); c.fillStyle = '#1D8348'; c.fillRect(0, 0, 256, 56); c.strokeStyle = '#B9D8C4'; c.lineWidth = 4; for (let x = 64; x < 256; x += 64) { c.beginPath(); c.moveTo(x, 56); c.lineTo(x, 320); c.stroke(); } for (let y = 100; y < 320; y += 44) { c.beginPath(); c.moveTo(0, y); c.lineTo(256, y); c.stroke(); } c.fillStyle = '#A9DFBF'; c.fillRect(66, 146, 60, 40); },
  'PPT 장표': c => { c.fillStyle = '#FFF8F2'; c.fillRect(0, 0, 256, 320); c.fillStyle = '#D35400'; c.fillRect(0, 0, 256, 70); c.fillStyle = '#E67E22'; c.beginPath(); c.moveTo(128, 200); c.arc(128, 200, 78, -1.57, 2.4); c.closePath(); c.fill(); c.fillStyle = '#F5B041'; c.beginPath(); c.moveTo(128, 200); c.arc(128, 200, 78, 2.4, 4.71); c.closePath(); c.fill(); },
  '뉴스레터': c => { c.fillStyle = '#FDFEFE'; c.fillRect(0, 0, 256, 320); c.strokeStyle = '#AEB6BF'; c.lineWidth = 10; c.strokeRect(5, 5, 246, 310); c.beginPath(); c.moveTo(8, 10); c.lineTo(128, 170); c.lineTo(248, 10); c.stroke(); c.fillStyle = '#E74C3C'; c.beginPath(); c.arc(206, 262, 30, 0, 6.3); c.fill(); },
  '회의록': c => { c.fillStyle = '#B7950B'; c.fillRect(0, 0, 256, 320); c.fillStyle = '#fff'; c.fillRect(18, 34, 220, 270); c.fillStyle = '#7F8C8D'; rr(c, 88, 8, 80, 44, 10); c.fill(); for (let i = 0; i < 5; i++) { c.strokeStyle = '#5D6D7E'; c.lineWidth = 6; c.strokeRect(36, 78 + i * 44, 22, 22); } lines(c, 74, 82, 148, 5, 44, '#BDC3C7'); },
  'TODO 주석': c => { c.fillStyle = '#1E1E2E'; c.fillRect(0, 0, 256, 320); c.fillStyle = '#F38BA8'; c.beginPath(); c.arc(28, 28, 10, 0, 6.3); c.fill(); c.fillStyle = '#F9E2AF'; c.beginPath(); c.arc(58, 28, 10, 0, 6.3); c.fill(); c.fillStyle = '#A6E3A1'; c.font = '800 46px ui-monospace,Menlo,monospace'; c.fillText('// TODO', 18, 120); lines(c, 18, 160, 200, 4, 36, '#585B70'); },
  '스톡 이미지': c => { c.fillStyle = '#85C1E9'; c.fillRect(0, 0, 256, 320); c.fillStyle = '#F9E79F'; c.beginPath(); c.arc(190, 76, 34, 0, 6.3); c.fill(); c.fillStyle = '#27AE60'; c.beginPath(); c.moveTo(0, 320); c.lineTo(90, 150); c.lineTo(170, 320); c.fill(); c.fillStyle = '#1E8449'; c.beginPath(); c.moveTo(90, 320); c.lineTo(180, 190); c.lineTo(256, 320); c.fill(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 8; for (let i = -320; i < 256; i += 70) { c.beginPath(); c.moveTo(i, 320); c.lineTo(i + 320, 0); c.stroke(); } c.strokeStyle = '#fff'; c.lineWidth = 18; c.strokeRect(0, 0, 256, 320); },
  'Lorem ipsum': c => { c.fillStyle = '#fff'; c.fillRect(0, 0, 256, 320); c.fillStyle = '#2C3E50'; c.font = '800 96px Georgia,serif'; c.fillText('Aa', 22, 104); lines(c, 24, 140, 208, 5, 34, '#CCD1D1'); },
  '견적서': c => { c.fillStyle = '#FDFEFE'; c.fillRect(0, 0, 256, 320); lines(c, 24, 30, 208, 5, 36, '#D5D8DC'); c.fillStyle = '#34495E'; c.fillRect(24, 214, 208, 6); c.fillStyle = '#C0392B'; c.font = '800 70px ' + FONT; c.textAlign = 'right'; c.fillText('₩₩₩', 236, 296); },
};
const docTex = n => texCache['d' + n] || (texCache['d' + n] = canvasTex(256, 320, DOCS[n]));

const waterN = tile(canvasTex(256, 256, (c, w, h) => {
  const W8 = [[1, 2, 0], [2, -1, 1.3], [3, 1, 2.1], [-1, 3, .7], [4, 2, 3.3], [2, 5, 1.9], [5, -3, .4]], H = (x, y) => { let v = 0; for (const [a, b, ph] of W8) v += Math.sin((a * x + b * y) / 256 * 6.2832 + ph) / Math.hypot(a, b); return v; };
  const id = c.createImageData(w, h), d = id.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (H(x + 1, y) - H(x - 1, y)) * 2.2, dy = (H(x, y + 1) - H(x, y - 1)) * 2.2, l = Math.hypot(dx, dy, 1), i = (y * w + x) * 4; d[i] = (-dx / l * .5 + .5) * 255; d[i + 1] = (-dy / l * .5 + .5) * 255; d[i + 2] = (1 / l * .5 + .5) * 255; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
}, false));

/* ================= 에셋: 재질 · 지오메트리 ================= */
const mats = {};
const std = (col, rough = 0.8, metal = 0) => { const k = col + rough + '_' + metal; return mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color: col, roughness: rough, metalness: metal })); };
const MAT = {
  trim: std('#2A2D32', 0.55, 0.5), stone: std('#8B877F', 0.9), glass: std('#16222C', 0.06, 1), white: std('#F2F0EA', 0.7),
  tire: std('#17181A', 0.9), chrome: std('#C9CED4', 0.2, 1), tail: new THREE.MeshStandardMaterial({ color: '#5A0A0A', emissive: '#FF2A1A', emissiveIntensity: 1.6, roughness: 0.4 }),
  head: new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#FFF6D8', emissiveIntensity: 1.2, roughness: 0.3 }),
};
function facadeMat(col, style) {
  const k = 'f' + col + style; if (mats[k]) return mats[k];
  const c = new THREE.Color(col); if (lum(col) < 0.22) c.lerp(new THREE.Color('#8FA0B0'), 0.16);
  mats[k] = new THREE.MeshStandardMaterial({ color: c, map: FAC[style].map, roughnessMap: FAC[style].orm, metalnessMap: FAC[style].orm, roughness: 1, metalness: 1, envMapIntensity: 1.15, emissiveMap: FAC[style].lit, emissive: '#FFFFFF', emissiveIntensity: 0 });
  glowMats.push({ m: mats[k], d: 0, n: 1.7 }); return mats[k];
}
const signMat = (name, slug, col) => { const k = 'sg' + name + col; if (mats[k]) return mats[k]; const t = signTex(name, slug, col); mats[k] = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#FFFFFF', emissiveIntensity: 1.0, roughness: 0.45 }); glowMats.push({ m: mats[k], d: 1.0, n: 2.6 }); return mats[k]; };
const crownMat = (slug, col) => { const k = 'cr' + slug + col; if (mats[k]) return mats[k]; const t = logoTex(slug, col); mats[k] = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#FFFFFF', emissiveIntensity: 3.2, transparent: true, alphaTest: 0.35, roughness: 0.5, side: THREE.DoubleSide }); glowMats.push({ m: mats[k], d: 3.2, n: 6 }); return mats[k]; };
const paint = col => mats['p' + col] || (mats['p' + col] = new THREE.MeshStandardMaterial({ color: col, roughness: 0.28, metalness: 0.55, envMapIntensity: 1.3 }));
const docMat = n => mats['d' + n] || (mats['d' + n] = new THREE.MeshStandardMaterial({ map: docTex(n), roughness: 0.75 }));

/* UV가 실제 크기에 비례하는 박스/원기둥 (외벽 타일링용) */
function bx(w, h, d, x, y, z, tu = 1, tv = 1) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
  for (let i = 0; i < 24; i++) { const f = i >> 2, su = f < 2 ? d : w, sv = (f === 2 || f === 3) ? d : h; uv.setXY(i, uv.getX(i) * su * tu, uv.getY(i) * sv * tv); }
  return g.translate(x, y, z);
}
function cy(r, h, x, y, z, tu = 1, tv = 1, seg = 28, rTop) {
  const g = new THREE.CylinderGeometry(rTop === undefined ? r : rTop, r, h, seg, 1), uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 6.283 * r * tu, uv.getY(i) * h * tv);
  return g.translate(x, y, z);
}
const SPH = new THREE.SphereGeometry(1, 20, 14), PLANE = new THREE.PlaneGeometry(1, 1), UBOX = new THREE.BoxGeometry(1, 1, 1);
function assemble(parts, matOf) {
  const g = new THREE.Group();
  for (const k in parts) { const m = new THREE.Mesh(parts[k].length > 1 ? mergeGeometries(parts[k]) : parts[k][0], matOf(k)); m.castShadow = true; g.add(m); }
  return g;
}

/* ---- 잡무 소품 ---- */
const propGeo = {};
function buildProp(name, rnd) {
  let parts = propGeo[name];
  if (!parts) {
    parts = propGeo[name] = {};
    const add = (k, g) => (parts[k] || (parts[k] = [])).push(g);
    const sp = (sx, sy, sz, x, y, z) => SPH.clone().scale(sx, sy, sz).translate(x, y, z);
    if (name === '버그') { add('#C0392B|.35', sp(.68, .5, .88, 0, .5, -.1)); add('#1C1C1E|.4', sp(.4, .36, .4, 0, .44, .78)); add('#1C1C1E|.4', sp(.16, .1, .16, .3, .88, -.2)); add('#1C1C1E|.4', sp(.16, .1, .16, -.3, .84, .1)); add('#1C1C1E|.4', sp(.13, .08, .13, .1, .97, -.5)); }
    else if (name === '커피') { add('#F4F1EA|.6', cy(.5, 1.5, 0, .75, 0, 1, 1, 24, .58)); add('#9A6A47|.85', cy(.535, .6, 0, .72, 0, 1, 1, 24, .565)); add('#2E211A|.5', cy(.6, .14, 0, 1.56, 0)); add('#2E211A|.5', cy(.5, .08, 0, 1.66, 0)); }
    else if (name === '포스트잇') { add('#FFD84D|.85', bx(1.35, .34, 1.35, 0, .17, 0)); add('#FF8FB1|.85', bx(1.25, .3, 1.25, .08, .49, .04).rotateY(.3)); add('#7FD8FF|.85', bx(1.15, .26, 1.15, -.05, .77, 0).rotateY(-.25)); }
    else add('doc', new THREE.BoxGeometry(1.5, 1.9, .07).rotateX(-.95).translate(0, .6, 0));
  }
  const g = assemble(parts, k => k === 'doc' ? docMat(name) : std(k.split('|')[0], +k.split('|')[1]));
  g.rotation.y = DOCS[name] ? (rnd() - .5) * .9 : rnd() * 6.28;
  return g;
}

/* ---- 회사 건물 ---- */
const PLASTER = ['#F3EDE2', '#EFE3D3', '#F6F1EA', '#E9E4DC', '#F2E6DA'];
function buildCompany(e, rnd) {
  const parts = {}, add = (k, g) => (parts[k] || (parts[k] = [])).push(g);
  const col = e.color, style = (rnd() * 3) | 0, v = (rnd() * 3) | 0, t = e.tier, crowns = [];
  let sg; // 간판 {w,x,y,z,tilt}
  const plaster = PLASTER[(rnd() * PLASTER.length) | 0];
  if (t === 1) {
    add('plaster', bx(1.5, .95, 1.3, 0, .475, 0)); add('trim', bx(1.58, .07, 1.38, 0, .985, 0)); add('trim', bx(.34, .2, .34, -.42, 1.12, -.25)); add('chrome', cy(.05, .3, .35, 1.15, -.3));
    add('glass', bx(1.24, .5, .04, 0, .3, .655)); add('trim', bx(.04, .5, .05, 0, .3, .66)); add('trim', bx(1.3, .05, .06, 0, .56, .66));
    add('brand', bx(1.5, .05, .42, 0, .63, .84).rotateX(.18).translate(0, .14, 0)); add('stone', bx(1.7, .04, 1.9, 0, .02, .15));
    sg = { w: 1.5, x: 0, y: 1.24, z: .58, tilt: -.1 };
  } else if (t === 2) {
    const h = 1.9 + rnd() * .7, tu = 1.25, tv = 1.5, y0 = .2, top = y0 + h;
    add('stone', bx(1.56, y0, 1.56, 0, y0 / 2, 0)); add('glass', bx(1.0, .15, 1.58, 0, y0 * .55, 0));
    if (v === 1) { add('fac', cy(.68, h, 0, y0 + h / 2, 0, tu, tv)); add('trim', cy(.72, .06, 0, top + .03, 0)); add('trim', cy(.3, .14, .1, top + .12, -.1)); crowns.push({ s: .5, x: 0, y: top - .42, z: .69 }); sg = { w: 1.5, x: 0, y: top + .34, z: .3, tilt: -.08 }; }
    else if (v === 2) { const h1 = h * .55, h2 = h * .5; add('fac', bx(1.4, h1, 1.4, 0, y0 + h1 / 2, 0, tu, tv)); add('trim', bx(1.46, .05, 1.46, 0, y0 + h1 + .025, 0)); add('fac', bx(1.0, h2, 1.0, 0, y0 + h1 + h2 / 2, -.12, tu, tv)); add('trim', bx(1.06, .05, 1.06, 0, y0 + h1 + h2 + .025, -.12)); add('trim', bx(.3, .14, .4, .2, y0 + h1 + h2 + .12, -.2)); crowns.push({ s: .46, x: 0, y: y0 + h1 + h2 - .36, z: .39 }); sg = { w: 1.46, x: 0, y: y0 + h1 + .3, z: .6, tilt: -.08 }; }
    else { add('fac', bx(1.34, h, 1.34, 0, y0 + h / 2, 0, tu, tv)); add('trim', bx(1.4, .06, 1.4, 0, top + .03, 0)); add('trim', bx(.42, .16, .5, .25, top + .14, -.2)); add('trim', bx(.2, .1, .2, -.35, top + .11, .1)); for (const sx of [-1, 1]) add('trim', bx(.05, h, .05, sx * .68, y0 + h / 2, .68)); crowns.push({ s: .52, x: 0, y: top - .44, z: .68 }); sg = { w: 1.5, x: 0, y: top + .34, z: .3, tilt: -.08 }; }
  } else if (t === 3) {
    const h = 3.1 + rnd() * .9, tu = 1.5, tv = 2, y0 = .26;
    add('stone', bx(1.6, y0, 1.6, 0, y0 / 2, 0)); add('glass', bx(1.1, .2, 1.62, 0, y0 * .55, 0));
    if (v === 0) { const top = y0 + h; add('fac', bx(1.2, h, 1.2, 0, y0 + h / 2, 0, tu, tv)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) add('trim', bx(.07, h + .2, .07, sx * .61, y0 + h / 2 + .1, sz * .61)); add('trim', bx(1.26, .06, 1.26, 0, top + .03, 0)); add('trim', bx(.5, .2, .5, 0, top + .16, -.15)); add('chrome', cy(.025, 1.0, 0, top + .76, -.15, 1, 1, 8)); crowns.push({ s: .56, x: 0, y: top - .46, z: .61 }); sg = { w: 1.6, x: 0, y: top + .36, z: .34, tilt: -.06 }; }
    else if (v === 1) { const a = h * .42, b = h * .34, c = h * .24; let y = y0; add('fac', bx(1.44, a, 1.44, 0, y + a / 2, 0, tu, tv)); y += a; add('trim', bx(1.5, .05, 1.5, 0, y + .025, 0)); add('fac', bx(1.1, b, 1.1, 0, y + b / 2, -.1, tu, tv)); y += b; add('trim', bx(1.16, .05, 1.16, 0, y + .025, -.1)); add('fac', bx(.76, c, .76, 0, y + c / 2, -.18, tu, tv)); y += c; add('trim', bx(.82, .05, .82, 0, y + .025, -.18)); add('chrome', cy(.03, .9, 0, y + .5, -.18, 1, 1, 8)); crowns.push({ s: .44, x: 0, y: y - .34, z: .21 }); sg = { w: 1.5, x: 0, y: y0 + a + .32, z: .62, tilt: -.06 }; }
    else { const top = y0 + h, h2 = h * .82; add('fac', bx(.62, h, 1.1, -.4, y0 + h / 2, 0, tu, tv)); add('fac', bx(.62, h2, 1.1, .4, y0 + h2 / 2, 0, tu, tv)); add('glass', bx(.22, .3, .8, 0, y0 + h * .55, 0)); add('glass', bx(.22, .3, .8, 0, y0 + h * .3, 0)); add('trim', bx(.68, .06, 1.16, -.4, top + .03, 0)); add('trim', bx(.68, .06, 1.16, .4, y0 + h2 + .03, 0)); add('chrome', cy(.025, .8, -.4, top + .45, 0, 1, 1, 8)); crowns.push({ s: .46, x: -.4, y: top - .38, z: .56 }, { s: .46, x: .4, y: y0 + h2 - .38, z: .56 }); sg = { w: 1.7, x: 0, y: y0 + .36, z: .86, tilt: -.06 }; }
  } else {
    const tu = 2, tv = 2.5, y0 = .32, hA = 3.6 + rnd() * .5, hB = 2.5 + rnd() * .4;
    add('stone', bx(1.96, y0, 1.96, 0, y0 / 2, 0)); add('glass', bx(1.5, .22, 1.98, 0, y0 * .55, 0)); add('white', bx(2.02, .03, 2.02, 0, y0 + .015, 0));
    add('fac', bx(.86, hA, .86, -.44, y0 + hA / 2, -.34, tu, tv)); add('trim', bx(.92, .06, .92, -.44, y0 + hA + .03, -.34)); add('white', cy(.3, .02, -.44, y0 + hA + .07, -.34)); add('chrome', cy(.03, 1.1, -.74, y0 + hA + .6, -.64, 1, 1, 8));
    for (const sx of [-1, 1]) add('trim', bx(.06, hA + .15, .06, -.44 + sx * .44, y0 + hA / 2 + .07, .1));
    add('fac', bx(.78, hB, .78, .46, y0 + hB / 2, -.3, tu, tv)); add('trim', bx(.84, .06, .84, .46, y0 + hB + .03, -.3)); add('trim', bx(.36, .16, .3, .5, y0 + hB + .14, -.35));
    add('glass', cy(.4, 1.0, .12, y0 + .5, .46, 1, 1, 28)); add('trim', cy(.43, .05, .12, y0 + 1.02, .46)); add('glass', bx(.5, .3, .3, 0, y0 + hB * .6, -.32));
    crowns.push({ s: .62, x: -.44, y: y0 + hA - .5, z: .1 }, { s: .54, x: .46, y: y0 + hB - .44, z: .1 });
    sg = { w: 2.0, x: 0, y: y0 + .4, z: 1.0, tilt: -.08 };
  }
  const g = assemble(parts, k => k === 'fac' ? facadeMat(col, style) : k === 'plaster' ? std(plaster, .92) : k === 'brand' ? std(col, .6) : MAT[k]);
  const s = new THREE.Mesh(new THREE.BoxGeometry(sg.w, sg.w * .3125, .05), signMat(e.name, e.slug, col)); s.position.set(sg.x, sg.y, sg.z); s.rotation.x = sg.tilt; s.castShadow = true; g.add(s);
  const post = new THREE.Mesh(UBOX, MAT.trim); post.scale.set(sg.w * .9, .05, .04); post.position.set(sg.x, sg.y - sg.w * .17, sg.z - .02); g.add(post);
  if (LOGOS[e.slug]) for (const c of crowns) { const m = new THREE.Mesh(PLANE, crownMat(e.slug, '#FFFFFF')); m.scale.set(c.s, c.s, 1); m.position.set(c.x, c.y, c.z + .012); g.add(m); }
  g.rotation.y = (rnd() - .5) * .3;
  return g;
}

/* ---- 자동차 (앞 = +x) ---- */
const CAR = (() => {
  const prof = (pts, depth, bev) => { const s = new THREE.Shape(); pts.forEach((p, i) => i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])); const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 2, curveSegments: 4 }); return g.translate(0, 0, -depth / 2); };
  const body = prof([[-1, .2], [-1, .5], [-.9, .58], [-.5, .6], [.35, .6], [.9, .52], [1, .42], [1, .2]], .8, .05);
  const cabin = prof([[-.62, .58], [-.4, .9], [.12, .9], [.42, .58]], .68, .04);
  const roof = bx(.5, .04, .7, -.14, .93, 0);
  const w = []; for (const x of [-.62, .62]) for (const z of [-.42, .42]) w.push(new THREE.CylinderGeometry(.2, .2, .15, 16).rotateX(Math.PI / 2).translate(x, .2, z));
  const hub = []; for (const x of [-.62, .62]) for (const z of [-.5, .5]) hub.push(new THREE.CylinderGeometry(.1, .1, .02, 10).rotateX(Math.PI / 2).translate(x, .2, z));
  return { body, cabin, roof, wheels: mergeGeometries(w), hubs: mergeGeometries(hub), tail: mergeGeometries([bx(.03, .08, .2, -1.05, .46, -.28), bx(.03, .08, .2, -1.05, .46, .28)]), head: mergeGeometries([bx(.03, .07, .18, 1.05, .4, -.3), bx(.03, .07, .18, 1.05, .4, .3)]) };
})();
const CARCOL = ['#D8261C', '#F26A1B', '#0F8FA6', '#C2188B', '#F4F4F2', '#1B1C1F', '#2456C7', '#F2C21A', '#8E9AA6'];
function buildCar(rnd) {
  const g = new THREE.Group(), p = paint(CARCOL[(rnd() * CARCOL.length) | 0]);
  for (const [geo, m] of [[CAR.body, p], [CAR.cabin, MAT.glass], [CAR.roof, p], [CAR.wheels, MAT.tire], [CAR.hubs, MAT.chrome], [CAR.tail, MAT.tail], [CAR.head, MAT.head]]) { const o = new THREE.Mesh(geo, m); o.castShadow = geo === CAR.body || geo === CAR.cabin; g.add(o); }
  return g;
}

/* ---- 야자수 (충돌 반경 1, 높이 3.6) ---- */
const PALM = (() => {
  const trunk = new THREE.CylinderGeometry(.07, .13, 3.6, 8, 10).translate(0, 1.8, 0), p = trunk.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) + 0.045 * y * y); }
  trunk.computeVertexNormals();
  const fr = [], r = mulberry(77);
  const frond = (len, up, droop, wid) => { const g = new THREE.PlaneGeometry(len, wid, 8, 2).translate(len / 2, 0, 0).rotateX(-Math.PI / 2), q = g.attributes.position; for (let i = 0; i < q.count; i++) { const x = q.getX(i), z = q.getZ(i); q.setY(i, up * x - droop * x * x - Math.abs(z) * .5); } return g; };
  for (let i = 0; i < 13; i++) fr.push(frond(1.75 + r() * .4, .45 + r() * .3, .34 + r() * .1, .62).rotateY(i / 13 * 6.283 + r() * .3));
  for (let i = 0; i < 6; i++) fr.push(frond(1.3 + r() * .3, 1.2 + r() * .3, .5, .5).rotateY(i / 6 * 6.283 + .4));
  const fronds = mergeGeometries(fr).translate(0.045 * 12.96, 3.6, 0); fronds.computeVertexNormals();
  return { trunk, fronds, coco: SPH.clone().scale(.16, .16, .16).translate(0.045 * 12.96, 3.52, 0),
    tm: new THREE.MeshStandardMaterial({ map: trunkTex, roughness: .95 }),
    fm: new THREE.MeshStandardMaterial({ map: frondTex, alphaTest: .5, side: THREE.DoubleSide, roughness: .7 }),
    dm: new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: frondTex, alphaTest: .5 }) };
})();
function buildPalm() {
  const g = new THREE.Group(), a = new THREE.Mesh(PALM.trunk, PALM.tm), b = new THREE.Mesh(PALM.fronds, PALM.fm);
  a.castShadow = b.castShadow = true; b.customDepthMaterial = PALM.dm; g.add(a, b); return g;
}

/* ================= 월드 고정 요소 ================= */
const flat = (geo, tileSize) => { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / tileSize, p.getZ(i) / tileSize); return geo; };
const ringG = (r0, r1, seg = 192) => new THREE.RingGeometry(r0, r1, seg, 1).rotateX(-Math.PI / 2);
const rectG = (len, wid, mid, ang) => new THREE.PlaneGeometry(len, wid).rotateX(-Math.PI / 2).translate(mid, 0, 0).rotateY(-ang);
const layer = (geos, material, off, tileSize) => { const m = new THREE.Mesh(flat(mergeGeometries(geos), tileSize), material); material.polygonOffset = true; material.polygonOffsetFactor = -off; material.polygonOffsetUnits = -off * 2; m.receiveShadow = true; m.renderOrder = off; scene.add(m); return m; };
{
  const base = new THREE.Mesh(flat(new THREE.CircleGeometry(WORLD_R + 60, 160).rotateX(-Math.PI / 2), 64), new THREE.MeshStandardMaterial({ map: paverTex, roughness: .9 })); base.receiveShadow = true; scene.add(base);
  const sandG = ringG(WORLD_R + 40, WORLD_R + 900), sp = sandG.attributes.position;
  for (let i = 0; i < sp.count; i++) if (Math.hypot(sp.getX(i), sp.getZ(i)) > WORLD_R + 500) sp.setY(i, -40);
  layer([sandG], new THREE.MeshStandardMaterial({ map: sandTex, roughness: 1 }), 1, 90);
  const water = new THREE.Mesh(new THREE.CircleGeometry(400000, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#0E6E8C', roughness: .1, metalness: .25, envMapIntensity: 1.6, normalMap: waterN, normalScale: new THREE.Vector2(.18, .18) })); waterN.repeat.set(420, 420); waterN.anisotropy = MAXAN; water.position.y = -14; scene.add(water);
  const gr = mulberry(SEED + 5), grass = [];
  for (let i = 0; i < 70; i++) { const a = gr() * 6.283, d = 120 + Math.sqrt(gr()) * 4100, rad = 25 + d * (.05 + gr() * .09); const g = new THREE.CircleGeometry(rad, 28).rotateX(-Math.PI / 2); g.scale(1, 1, .6 + gr() * .5).rotateY(gr() * 3).translate(Math.cos(a) * d, 0, Math.sin(a) * d); grass.push(g); }
  layer(grass, new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 }), 2, 70);
  const walk = [], road = [], yel = [], wht = [];
  for (const { R, w } of ROADS) {
    walk.push(ringG(R - w * .5 - w * .2, R + w * .5 + w * .2)); road.push(ringG(R - w / 2, R + w / 2));
    const lw = w * .012; yel.push(ringG(R - lw * 2.4, R - lw), ringG(R + lw, R + lw * 2.4)); wht.push(ringG(R - w * .46, R - w * .46 + lw * 1.3), ringG(R + w * .46 - lw * 1.3, R + w * .46));
  }
  for (let k = 0; k < SPOKES; k++) {
    const a = SPOKE0 + k * 6.283 / SPOKES;
    for (let s = 0; s < ROADS.length; s++) {
      const d0 = ROADS[s].R, d1 = s + 1 < ROADS.length ? ROADS[s + 1].R : WORLD_R + 20, w = spokeW((d0 + d1) / 2), len = d1 - d0, mid = (d0 + d1) / 2;
      walk.push(rectG(len, w * 1.4, mid, a)); road.push(rectG(len, w, mid, a));
      const n = Math.floor(len / (w * 1.1));
      for (let i = 0; i < n; i++) wht.push(rectG(w * .5, w * .022, d0 + (i + .5) * len / n, a));
      for (const sgn of [-1, 1]) wht.push(new THREE.PlaneGeometry(len, w * .016).rotateX(-Math.PI / 2).translate(mid, 0, sgn * w * .46).rotateY(-a));
    }
  }
  layer(walk, new THREE.MeshStandardMaterial({ map: walkTex, roughness: .92 }), 3, 40);
  layer(road, new THREE.MeshStandardMaterial({ map: asphaltTex, roughness: .82 }), 4, 110);
  layer(yel, new THREE.MeshStandardMaterial({ color: '#E0A81C', roughness: .7 }), 5, 100);
  layer(wht, new THREE.MeshStandardMaterial({ color: '#E8E6DF', roughness: .7 }), 5, 100);
}
const clouds = new THREE.Group(); scene.add(clouds);
const cloudMat = new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, color: new THREE.Color(1.9, 1.9, 1.95) });
{ const r = mulberry(31), cm = cloudMat, _unused = ({ map: cloudTex, transparent: true, depthWrite: false, fog: false, color: new THREE.Color(1.9, 1.9, 1.95) });
  for (let i = 0; i < 16; i++) { const az = r() * 6.283, el = .05 + r() * .32, m = new THREE.Mesh(PLANE, cm), s = .32 + r() * .4; m.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)); m.scale.set(s, s * .42, 1); m.lookAt(0, 0, 0); m.renderOrder = -1; clouds.add(m); } }

const ballPivot = new THREE.Group(); scene.add(ballPivot);
const ball = new THREE.Group(); ballPivot.add(ball);
const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), new THREE.MeshStandardMaterial({ map: ballTex, bumpMap: ballBump, bumpScale: 1.2, roughness: .5, metalness: .05, envMapIntensity: 1.1 }));
ballMesh.castShadow = true; ball.add(ballMesh);
const stuckRoot = new THREE.Group(); ball.add(stuckRoot);
const xray = new THREE.Mesh(SPH, new THREE.MeshBasicMaterial({ color: '#FFB08E', transparent: true, opacity: .5, depthFunc: THREE.GreaterDepth, depthWrite: false, fog: false })); xray.renderOrder = 20; ballPivot.add(xray);

const entRoot = new THREE.Group(); scene.add(entRoot);
const MAXE = 460;
const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 0.85, 0.35), transparent: true, opacity: .9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -7, polygonOffsetUnits: -14 });
const rings = new THREE.InstancedMesh(new THREE.RingGeometry(1.2, 1.36, 40).rotateX(-Math.PI / 2), ringMat, MAXE); rings.frustumCulled = false; rings.renderOrder = 7; scene.add(rings);
const MAXP = 190;
const palmT = new THREE.InstancedMesh(PALM.trunk, PALM.tm, MAXP), palmF = new THREE.InstancedMesh(PALM.fronds, PALM.fm, MAXP);
palmT.castShadow = palmF.castShadow = true; palmF.customDepthMaterial = PALM.dm; palmT.frustumCulled = palmF.frustumCulled = false; scene.add(palmT, palmF);
const PN = 110, parts = new THREE.InstancedMesh(UBOX, new THREE.MeshStandardMaterial({ roughness: .5 }), PN); parts.frustumCulled = false; scene.add(parts);
const pdata = []; for (let i = 0; i < PN; i++) { pdata.push({ life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s: 1 }); parts.setColorAt(i, new THREE.Color('#fff')); }
let pcur = 0;
const m4 = new THREE.Matrix4(), v3 = new THREE.Vector3(), q4 = new THREE.Quaternion(), s3 = new THREE.Vector3(), qI = new THREE.Quaternion(), tmpC = new THREE.Color(), eul = new THREE.Euler();
const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);

/* ================= 상태 ================= */
let ents = [], P, state = 'menu', timeLeft, eatenCount, unlocked, shake, lastBumpMsg, bigEaten, bigTotal, notable, comboN, comboT, maxCombo, camR, camX, camZ, moved, muted = false;
const input = { active: false, ox: 0, oy: 0, dx: 0, dy: 0 };
const keys = {};
const tierOf = r => { let t = 0; for (let i = 1; i < 5; i++) if (r >= TIERS[i].rmin * .85) t = i; return t; };
function onRoad(x, y, pad) {
  const d = Math.hypot(x, y);
  for (const { R, w } of ROADS) if (Math.abs(d - R) < w * .72 + pad) return true;
  if (d > ROADS[0].R) { const step = 6.283 / SPOKES; let a = (Math.atan2(y, x) - SPOKE0) % step; if (a < 0) a += step; if (a > step / 2) a -= step; if (Math.abs(Math.sin(a) * d) < spokeW(d) * .72 + pad) return true; }
  return false;
}

function build() {
  entRoot.clear(); stuckRoot.clear(); ents = [];
  const rnd = mulberry(SEED), R = (a, b) => a + rnd() * (b - a);
  const push = (e) => { e.idx = ents.length; e.ed = false; e.tw = 0; e.hop = 0; if (e.obj) { e.obj.position.set(e.x, 0, e.y); e.obj.scale.setScalar(e.r); entRoot.add(e.obj); } ents.push(e); return e; };
  const place = (tier, def) => {
    const T = TIERS[tier], r = R(T.rmin, T.rmax);
    for (let tries = 0; tries < 400; tries++) {
      const a = R(0, Math.PI * 2), d = Math.sqrt(R(T.d0 * T.d0, T.d1 * T.d1)), x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (tier > 0 && onRoad(x, y, r * 1.05)) continue;
      let ok = true;
      for (const e of ents) { const m = r + e.r + Math.min(r, e.r) * 0.7 + 3; if ((e.x - x) ** 2 + (e.y - y) ** 2 < m * m) { ok = false; break; } }
      if (!ok) continue;
      const e = { x, y, r, tier, m: 1, name: def[0], slug: def[1], color: def[2] || '#E8C36A', co: tier > 0 };
      e.obj = tier === 0 ? buildProp(e.name, rnd) : buildCompany(e, rnd);
      return push(e);
    }
  };
  T4.forEach(c => place(4, c)); T3.forEach(c => place(3, c)); T2.forEach(c => place(2, c)); T1.forEach(c => place(1, c));
  for (let i = 0; i < 90; i++) place(0, [T0[i % T0.length]]);
  bigTotal = ents.filter(e => e.tier === 4).length;
  { const cand = ents.filter(e => e.co && e.tier >= 1 && e.tier <= 3); for (let i = 0; i < 6 * (EV.uni || 1) && cand.length; i++) { const e = cand.splice((rnd() * cand.length) | 0, 1)[0]; e.uni = true; e.m = 1.6; const h = new THREE.Mesh(haloGeo, haloMat); h.position.y = [0, 2.0, 3.4, 4.8][e.tier]; e.obj.add(h); const h2 = new THREE.Mesh(haloGeo, haloMat); h2.position.y = h.position.y + .28; h2.scale.setScalar(.6); e.obj.add(h2); } }
  // 가로수 야자수
  let pi = 0;
  ROADS.forEach(({ R: RR, w }, k) => {
    const pr = [14, 30, 62, 112][k], n = Math.floor(6.283 * RR / (pr * 9));
    for (const side of [-1, 1]) for (let i = 0; i < n; i++) {
      const a = (i + (side > 0 ? .5 : 0)) / n * 6.283, d = RR + side * w * .62, x = Math.cos(a) * d, y = Math.sin(a) * d, r = pr * R(.85, 1.15);
      const step = 6.283 / SPOKES; let da = (a - SPOKE0) % step; if (da < 0) da += step; if (da > step / 2) da -= step;
      if (Math.abs(Math.sin(da) * d) < spokeW(d) * .8 + r || pi >= MAXP) continue;
      let ok = true; for (const e of ents) if ((e.x - x) ** 2 + (e.y - y) ** 2 < (r * .5 + e.r) ** 2) { ok = false; break; }
      if (!ok) continue;
      const e = push({ x, y, r, tier: tierOf(r), m: .22, name: '야자수', color: '#4F8A2E', palm: pi, ry: R(0, 6.283), hard: .3 });
      m4.compose(v3.set(x, 0, y), q4.setFromEuler(eul.set(0, e.ry, 0)), s3.setScalar(r)); palmT.setMatrixAt(pi, m4); palmF.setMatrixAt(pi, m4); pi++;
    }
  });
  for (let i = pi; i < MAXP; i++) { palmT.setMatrixAt(i, ZERO); palmF.setMatrixAt(i, ZERO); }
  palmT.instanceMatrix.needsUpdate = palmF.instanceMatrix.needsUpdate = true;
  // 도로 위 차량 (순환 주행)
  [[0, 11.5, 16], [1, 23, 14], [2, 44, 12]].forEach(([k, cr, n]) => {
    const { R: RR, w } = ROADS[k];
    for (let i = 0; i < n; i++) { const dir = i % 2 ? 1 : -1, rad = RR + dir * w * .24, ang = (i + R(0, .6)) / n * 6.283;
      push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad, r: cr, tier: tierOf(cr), m: .8, name: k === 2 ? '셔틀버스' : '법인차', color: '#C9CED4', obj: buildCar(rnd), orbit: { rad, ang, w: dir * (cr * 2.2) / rad } }); }
  });
  for (let i = 0; i < MAXE; i++) rings.setMatrixAt(i, ZERO);
  rings.instanceMatrix.needsUpdate = true;
  P = { x: 0, y: 0, vx: 0, vy: 0, r: M.r0 };
  resetRogue(); spawnBots(); pImm = 0; spawnPups(rnd); spawnPortals(rnd); tweens = []; boostT = magT = slowT = finT = dashT = dashCd = feverT = 0; feverNext = 35; mission = null; missionCd = 12; missionsDone = 0; mark.visible = false;
  ball.quaternion.identity();
  camR = M.r0; camX = 0; camZ = 0;
  timeLeft = GAME_TIME + (EV.time || 0); eatenCount = 0; unlocked = 0; shake = 0; lastBumpMsg = 0; bigEaten = []; notable = []; comboN = 0; comboT = 0; maxCombo = 0; moved = false;
}

/* ================= 소리 ================= */
const buzz = p => { if (!muted && navigator.vibrate) navigator.vibrate(p); };
$('mute').addEventListener('click', () => { muted = !muted; $('mute').textContent = muted ? '🔇' : '🔊'; if (master) master.gain.value = muted ? 0 : 1; });

/* ================= 입력 ================= */
const stick = $('stick'), knob = $('knob'), SM = 56;
cv.addEventListener('pointerdown', e => {
  if (state !== 'play') return;
  input.active = true; input.ox = e.clientX; input.oy = e.clientY; input.dx = input.dy = 0;
  stick.style.display = 'block'; stick.style.left = input.ox + 'px'; stick.style.top = input.oy + 'px'; knob.style.transform = '';
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
});
cv.addEventListener('pointermove', e => {
  if (!input.active) return;
  let dx = e.clientX - input.ox, dy = e.clientY - input.oy; const d = Math.hypot(dx, dy);
  if (d > SM) { input.ox = e.clientX - dx / d * SM; input.oy = e.clientY - dy / d * SM; dx = dx / d * SM; dy = dy / d * SM; stick.style.left = input.ox + 'px'; stick.style.top = input.oy + 'px'; }
  input.dx = dx / SM; input.dy = dy / SM; knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
});
const up = () => { input.active = false; input.dx = input.dy = 0; stick.style.display = 'none'; };
cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
window.addEventListener('keydown', e => { if (e.target.tagName !== 'INPUT') keys[e.key] = true; }); window.addEventListener('keyup', e => { keys[e.key] = false; });
document.addEventListener('touchmove', e => { if (!e.target.closest || !e.target.closest('.panel')) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault());
cv.addEventListener('contextmenu', e => e.preventDefault());

/* ================= UI 헬퍼 ================= */
function fmtMoney(v) {
  for (const [s, n] of [['T', 1e12], ['B', 1e9], ['M', 1e6], ['K', 1e3]]) if (v >= n) { const x = v / n; return '$' + (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2)) + s; }
  return '$' + v.toFixed(0);
}
const worth = () => 1e4 * Math.pow(P.r / R0, 6);
let bannerT = null;
function banner(txt, sub, cls) { const b = $('banner'); for (const k of ['gta', 'wasted', 'r2', 'r3', 'r4']) b.classList.toggle(k, cls === k); b.children[0].textContent = txt; b.children[1].textContent = sub || ''; b.classList.add('on'); clearTimeout(bannerT); bannerT = setTimeout(() => b.classList.remove('on'), 1800); }
let toastT = null;
function toast(t) { const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 1800); }
const popLayer = $('pops');
function pop(x, y, z, txt, cls) {
  if (popLayer.childElementCount > 14) return;
  v3.set(x, y, z).project(camera); if (v3.z > 1) return;
  const el = document.createElement('div'); el.className = 'pop ' + (cls || ''); el.textContent = txt;
  el.style.left = ((v3.x + 1) / 2 * W) + 'px'; el.style.top = ((1 - v3.y) / 2 * H) + 'px';
  popLayer.appendChild(el); setTimeout(() => el.remove(), cls === 'say' ? 2200 : 1080);
}
function burst(e) {
  tmpC.set(e.color);
  const n = e.tier >= 3 ? 14 : 7;
  for (let i = 0; i < n; i++) {
    const p = pdata[pcur], a = Math.random() * 6.28, sp = (1.5 + Math.random() * 2.5) * P.r;
    p.life = .55 + Math.random() * .3; p.x = e.x; p.z = e.y; p.y = e.r * .6; p.vx = Math.cos(a) * sp; p.vz = Math.sin(a) * sp; p.vy = (3 + Math.random() * 4) * P.r; p.s = P.r * (.08 + Math.random() * .09);
    parts.setColorAt(pcur, i % 3 ? tmpC : tmpC.clone().lerp(new THREE.Color('#fff'), .6)); pcur = (pcur + 1) % PN;
  }
  parts.instanceColor.needsUpdate = true;
}

/* ================= 시간 흐름: 낮 → 노을 → 밤 ================= */
const KEY = [ // tod, 지평선, 천정, 태양색, 태양 세기, 반구광, 노출, 밤 정도, 고도°, 방위°
  { t: 0,    hz: [.42, .74, 1.3],  zn: [.05, .27, 1.05],    sc: [1, .94, .84], si: 4.2, he: .25, ex: .5,  n: 0,   el: 52, az: -135, ev: 1 },
  { t: .3,   hz: [.6, .8, 1.2],    zn: [.06, .28, 1.0],   sc: [1, .88, .7],  si: 4.2, he: .25, ex: .5,  n: 0,   el: 34, az: -100, ev: 1 },
  { t: .64,  hz: [2.5, 1.05, .4],  zn: [.3, .36, 1.2],   sc: [1, .52, .22], si: 3.4, he: .3,  ex: .5,  n: .45, el: 8,  az: -32, ev: .5 },
  { t: 1,    hz: [.8, .42, .6],    zn: [.03, .045, .2],  sc: [1, .4, .3],   si: .35, he: .9,  ex: .52, n: 1,   el: -3, az: -22, ev: .1 },
];
const LDIR = new THREE.Vector3().copy(SUN);
let todCur = .6, nightCur = -1;
const L = (a, b, k) => a + (b - a) * k;
function applyTod(target, dt) {
  todCur += (target - todCur) * (1 - Math.exp(-dt * 1.5));
  let i = 0; while (i < KEY.length - 2 && todCur > KEY[i + 1].t) i++;
  const a = KEY[i], b = KEY[i + 1], k = Math.min(1, Math.max(0, (todCur - a.t) / (b.t - a.t)));
  HAZE.setRGB(L(a.hz[0], b.hz[0], k), L(a.hz[1], b.hz[1], k), L(a.hz[2], b.hz[2], k)); scene.fog.color.copy(HAZE);
  dome.material.uniforms.zn.value.setRGB(L(a.zn[0], b.zn[0], k), L(a.zn[1], b.zn[1], k), L(a.zn[2], b.zn[2], k));
  sun.color.setRGB(L(a.sc[0], b.sc[0], k), L(a.sc[1], b.sc[1], k), L(a.sc[2], b.sc[2], k)); sun.intensity = L(a.si, b.si, k);
  hemi.intensity = L(a.he, b.he, k); renderer.toneMappingExposure = L(a.ex, b.ex, k); scene.environmentIntensity = L(a.ev, b.ev, k);
  const el = L(a.el, b.el, k) * Math.PI / 180, az = L(a.az, b.az, k) * Math.PI / 180, night = L(a.n, b.n, k);
  SUN.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
  const le = Math.max(el, .2); LDIR.set(Math.sin(az) * Math.cos(le), Math.sin(le), -Math.cos(az) * Math.cos(le));
  dome.material.uniforms.night.value = night;
  if (Math.abs(night - nightCur) > .015) { nightCur = night; for (const g of glowMats) g.m.emissiveIntensity = L(g.d, g.n, night); ballLamp.intensity = night * 2.6; hemi.color.setRGB(L(.86, .45, night), L(.92, .5, night), L(1, 1, night)); hemi.groundColor.setRGB(L(.54, .22, night), L(.5, .16, night), L(.42, .3, night)); cloudMat.color.setRGB(L(1.9, .5, night), L(1.9, .35, night), L(1.95, .5, night)); }
}

/* ================= 음악 · 효과음 ================= */
let AC = null, master = null, noiseBuf = null, musicTimer = null, nextT = 0, stepN = 0;
function audioInit() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = muted ? 0 : 1;
    const comp = AC.createDynamicsCompressor(); master.connect(comp); comp.connect(AC.destination);
    noiseBuf = AC.createBuffer(1, AC.sampleRate * .5, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) { AC = null; }
}
function tone(t, freq, dur, type, vol, to, cut) {
  const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  if (cut) { const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cut; o.connect(f); f.connect(g); } else o.connect(g);
  g.connect(master); o.start(t); o.stop(t + dur + .02);
}
function hiss(t, dur, vol, hp) {
  const s = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter(); s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + .02);
}
function blip(freq, dur, type, vol) { if (!AC || muted) return; try { tone(AC.currentTime, freq, dur, type || 'triangle', vol || .08, freq * 1.5); } catch (e) {} }
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const CH = [[57, 3], [53, 4], [48, 4], [55, 4]];          // Am F C G (근음, 3도)
const LEAD = [12, 15, 19, 24, 19, 15, 17, 19, 12, 10, 12, 15, 19, 22, 19, 17];
function musicStep(t, s, layer) {
  const bar = (s >> 4) & 3, st = s & 15, [root, third] = CH[bar];
  if (st % 4 === 0 || (layer >= 2 && st === 10)) tone(t, 130, .16, 'sine', .32, 42);
  if ([0, 3, 8, 11].includes(st)) tone(t, mtof(root - 24), .2, 'triangle', .2);
  if (layer >= 1 && st % 2 === 0) hiss(t, st % 4 === 2 ? .09 : .035, st % 4 === 2 ? .07 : .04, 7000);
  if (layer >= 2) tone(t, mtof(root + 12 + [0, third, 7, 12, 7, third][st % 6]), .11, 'triangle', .055);
  if (layer >= 3) { if (st === 4 || st === 12) { hiss(t, .14, .11, 1800); tone(t, 190, .08, 'triangle', .1, 120); } if (st === 0) for (const n of [0, third, 7]) tone(t, mtof(root + n), 1.9, 'sawtooth', .028, 0, 900); }
  if (layer >= 4 && [0, 3, 6, 8, 11, 14].includes(st)) tone(t, mtof(57 + LEAD[(s >> 1) & 15]), .16, 'square', .035, 0, 2400);
}
function musicStart() {
  if (!AC) return; musicStop(); nextT = AC.currentTime + .08; stepN = 0;
  musicTimer = setInterval(() => {
    if (!AC || muted) { nextT = AC ? AC.currentTime + .05 : 0; return; }
    const bpm = state === 'play' && (timeLeft < 20 || feverT > 0) ? 132 : 116, sd = 60 / bpm / 4;
    while (nextT < AC.currentTime + .12) { try { musicStep(nextT, stepN, unlocked); } catch (e) {} stepN++; nextT += sd; }
  }, 30);
}
function musicStop() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

/* ================= 연출: 충격파 · 흡입 · 히트스톱 ================= */
const waves = [];
for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.93, 1, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.1, .4), transparent: true, opacity: 0, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -9, polygonOffsetUnits: -18 })); m.visible = false; m.renderOrder = 9; m.frustumCulled = false; scene.add(m); waves.push({ m, t: 1, r0: 1, r1: 2, d: .7 }); }
let waveI = 0;
function wave(x, z, r0, r1, col, d) { const w = waves[waveI++ % waves.length]; w.t = 0; w.r0 = r0; w.r1 = r1; w.d = d || .7; w.m.position.set(x, 0, z); w.m.visible = true; if (col) w.m.material.color.set(col).multiplyScalar(2.6); else w.m.material.color.setRGB(3, 1.1, .4); }
let tweens = [], slowT = 0, boostT = 0, magT = 0, dustT = 0, spNorm = 0, introT = 0, finT = 0, fovCur = FOV;
const INTRO = 1.7;
function stickTo(obj, er, small) {
  // 월드 위치를 유지한 채 공의 자식으로 옮기고, 표면까지 빨려 들어가는 트윈을 건다
  ballPivot.position.set(P.x, P.r, P.y); ballPivot.scale.setScalar(P.r); ballPivot.updateMatrixWorld(true);
  stuckRoot.attach(obj);
  const p1 = obj.position.clone().normalize().multiplyScalar((.8 + Math.random() * .12) * .9);
  const q1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().normalize()).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * 6.28));
  tweens.push({ o: obj, p0: obj.position.clone(), q0: obj.quaternion.clone(), s0: obj.scale.x, p1, q1, s1: Math.min(.24, Math.max(.13, er / P.r * .7)) * (small ? .5 : 1), t: 0 });
  if (stuckRoot.children.length > 34) stuckRoot.remove(stuckRoot.children[0]);
}
function removeEnt(e, i) {
  if (mission && mission.e === e) missionEnd(false, '라이벌이 ' + e.name + '을(를) 먼저 가져갔어요');
  ents.splice(i, 1); rings.setMatrixAt(e.idx, ZERO); rings.instanceMatrix.needsUpdate = true;
  if (e.palm !== undefined) { palmT.setMatrixAt(e.palm, ZERO); palmF.setMatrixAt(e.palm, ZERO); palmT.instanceMatrix.needsUpdate = palmF.instanceMatrix.needsUpdate = true; }
  else if (e.obj) entRoot.remove(e.obj);
}

/* ================= 라이벌 AI 공 ================= */
const AIS = [['ChatGPT', 'openai', '#10A37F', '챗은 하나면 충분', .74, .21], ['Gemini', 'googlegemini', '#4E82EE', '쌍둥이자리 접수', .68, .19],
  ['Copilot', 'githubcopilot', '#7C5CFF', '부조종사 하차', .62, .17], ['Perplexity', 'perplexity', '#20808D', '검색도 이제 내가', .56, .15]];
const botRoot = new THREE.Group(); scene.add(botRoot);
const BOTGEO = new THREE.SphereGeometry(1, 40, 26), BOTCAP = 125;
let bots = [], aiEaten = [], pImm = 0;
function botTex(slug, col) {
  return texCache['b' + slug] || (texCache['b' + slug] = canvasTex(1024, 512, (c, w, h) => {
    c.fillStyle = col; c.fillRect(0, 0, w, h); speckle(c, w, h, 3000, ['rgba(255,255,255,.08)', 'rgba(0,0,0,.1)'], 2, 6, 17);
    for (const x of [170, 512, 854]) drawLogo(c, slug, x - 100, 256 - 100, 200, '#FFFFFF');
  }));
}
function spawnBots() {
  botRoot.clear(); bots = []; aiEaten = [];
  AIS.forEach(([name, slug, color, quip, spd, grow], k) => {
    const a = k * 1.5708 + .8, pivot = new THREE.Group(), rot = new THREE.Mesh(BOTGEO, new THREE.MeshStandardMaterial({ map: botTex(slug, color), roughness: .42, metalness: .1, envMapIntensity: 1.2 }));
    rot.castShadow = true; pivot.add(rot);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 2.7 * .3125), signMat(name, slug, color)); label.position.set(0, 1.62, 0); label.rotation.x = -.25; pivot.add(label);
    botRoot.add(pivot);
    bots.push({ name, slug, color, quip, spd: spd * (EV.bot || 1), grow, x: Math.cos(a) * 300, y: Math.sin(a) * 300, vx: 0, vy: 0, r: 12.2, tx: 0, ty: 0, think: Math.random() * .3, slow: 0, imm: 0, chase: 0, say: 3 + k * 2, cool: 6 + k * 3, pivot, rot, label });
  });
}
function updateBots(dt) {
  if (pImm > 0) pImm -= dt;
  for (let bi = bots.length - 1; bi >= 0; bi--) {
    const b = bots[bi]; b.think -= dt; b.imm -= dt; b.cool -= dt; if (b.chase > 0) { b.chase -= dt; if (b.chase <= 0) b.cool = 8; }
    const pdx = P.x - b.x, pdy = P.y - b.y, pd = Math.hypot(pdx, pdy) || .001;
    if (b.think <= 0) {
      b.think = .3 + Math.random() * .2;
      if (b.slow > 1.1) { b.slow = 0; b.think = 1; const a = Math.random() * 6.283; b.tx = b.x + Math.cos(a) * b.r * 12; b.ty = b.y + Math.sin(a) * b.r * 12; }
      else if (b.r <= P.r * EAT && pd < P.r * 5 + b.r) { b.tx = b.x - pdx / pd * 600; b.ty = b.y - pdy / pd * 600; }      // 도망
      else if (P.r <= b.r * EAT && pd < b.r * 6 && b.cool <= 0 && pImm <= 0) { b.tx = P.x; b.ty = P.y; if (b.chase <= 0) b.chase = 3; }                                          // 추격
      else { let best = null, bd = 1e18; for (const e of ents) { if (e.orbit || e.r > b.r * EAT || e.r < b.r * .22 || (e.co && e.tier === 4)) continue; const d = (e.x - b.x) ** 2 + (e.y - b.y) ** 2; if (d < bd) { bd = d; best = e; } }
        if (best) { b.tx = best.x; b.ty = best.y; } else { b.tx = 0; b.ty = 0; } }
    }
    const tdx = b.tx - b.x, tdy = b.ty - b.y, td = Math.hypot(tdx, tdy) || 1, mv = (95 + b.r * 3.6) * b.spd, k = 1 - Math.exp(-dt * 3.5);
    b.vx += (tdx / td * mv - b.vx) * k; b.vy += (tdy / td * mv - b.vy) * k;
    const ox = b.x, oy = b.y; b.x += b.vx * dt; b.y += b.vy * dt;
    const lim = WORLD_R - b.r, wd = Math.hypot(b.x, b.y); if (wd > lim) { b.x *= lim / wd; b.y *= lim / wd; }
    const thr = b.r * EAT;
    for (let i = ents.length - 1; i >= 0; i--) {
      const e = ents[i], dx = b.x - e.x, dy = b.y - e.y, rs = b.r + e.r; if (dx > rs || dx < -rs || dy > rs || dy < -rs) continue;
      const d = Math.hypot(dx, dy) || .001;
      if (e.r <= thr && !(e.co && e.tier === 4)) { if (d < b.r + e.r * .25) { removeEnt(e, i); b.r = Math.min(BOTCAP, Math.sqrt(b.r * b.r + b.grow * e.m * e.r * e.r)); if (pd < camR * 30) burst(e); } }
      else { const cr = e.r * (e.hard || 1); if (d < b.r + cr) { b.x = e.x + dx / d * (b.r + cr); b.y = e.y + dy / d * (b.r + cr); } }
    }
    const mvx = b.x - ox, mvy = b.y - oy, md = Math.hypot(mvx, mvy);
    if (md > 1e-4) { v3.set(mvy / md, 0, -mvx / md); q4.setFromAxisAngle(v3, md / b.r); b.rot.quaternion.premultiply(q4); }
    b.slow = md < mv * dt * .3 ? b.slow + dt : 0;
    if (pd < P.r + b.r) {
      if (b.r <= P.r * eatK()) { if (pd < P.r + b.r * .35) { eatBot(b, bi); continue; } }
      else {
        const nx = pdx / pd, ny = pdy / pd; P.x = b.x + nx * (P.r + b.r); P.y = b.y + ny * (P.r + b.r);
        if (dashT > 0) {                                   // 돌진으로 받아치기
          dashT = 0; b.r = Math.max(9, b.r * .9); b.imm = 2; b.cool = 9; b.chase = 0; b.vx = -nx * (200 + b.r * 6); b.vy = -ny * (200 + b.r * 6); P.vx = nx * (60 + P.r * 2); P.vy = ny * (60 + P.r * 2);
          shake = .45; slowT = .12; pImm = Math.max(pImm, 2); wave(b.x, b.y, b.r, b.r * 5, b.color, .5); burst({ x: b.x, y: b.y, r: b.r, color: b.color, tier: 3 }); buzz([30, 20, 50]); blip(80, .25, 'sawtooth', .13);
          pop(b.x, b.r * 2.6, b.y, '쾅! ' + b.name + ' -10%', 'big');
        } else if (P.r <= b.r * EAT && b.imm <= 0 && pImm <= 0) {
          b.imm = 2.2; pImm = 6; b.chase = 0; b.cool = 10; b.think = 0; P.r = Math.max(R0, P.r * .95); b.r = Math.min(BOTCAP, b.r * 1.03); const kv = 150 + P.r * 5; P.vx = nx * kv; P.vy = ny * kv;
          shake = .4; slowT = .12; wave(P.x, P.y, P.r, P.r * 6, b.color, .5); buzz([40, 30, 40]); blip(90, .3, 'sawtooth', .12);
          banner('📉 ' + b.name + '에게 점유율을 뺏겼어요', '더 커져서 되갚아 주세요');
        } else { const vn = P.vx * nx + P.vy * ny; if (vn < 0) { P.vx -= 1.6 * vn * nx; P.vy -= 1.6 * vn * ny; } }
      }
    }
    b.pivot.position.set(b.x, b.r, b.y); b.pivot.scale.setScalar(b.r);
    b.label.visible = b.r > P.r * .5;
    b.say -= dt;
    if (b.say <= 0 && pd < camR * 22) { b.say = 6 + Math.random() * 7; const fl = b.r <= P.r * EAT && pd < P.r * 6 + b.r, ch = b.chase > 0; pop(b.x, b.r * 2.9, b.y, fl ? '살려주세요…' : ch ? '점유율 내놔' : TAUNT[b.name][(Math.random() * TAUNT[b.name].length) | 0], 'say'); }
  }
}
function eatBot(b, bi) {
  bots.splice(bi, 1); aiEaten.push(b.name);
  P.r = Math.sqrt(P.r * P.r + GROW * b.r * b.r); eatenCount++; comboN++; comboT = 1.3;
  notable.push({ name: b.name, color: b.color, slug: b.slug, tier: 3, r: 1e4 + b.r });
  b.pivot.remove(b.label); botRoot.remove(b.pivot); scene.add(b.pivot); b.pivot.updateMatrixWorld(true); stickTo(b.pivot, b.r);
  banner('🤖 ' + b.name + ' 흡수! (' + aiEaten.length + '/' + AIS.length + ')', b.quip); dropLoot(P.x, P.y - P.r * 2.6, 2, 1);
  slowT = .22; shake = .35; wave(b.x, b.y, b.r, b.r * 9, b.color, .8); buzz([30, 40, 30, 40, 60]);
  burst({ x: b.x, y: b.y, r: b.r, color: b.color, tier: 4 });
  [392, 523, 659, 784].forEach((f, i) => setTimeout(() => blip(f, .22, 'square', .07), i * 70));
}

/* ================= 파워업 ================= */
const PUS = [{ k: 'speed', col: '#FFD23F', label: '⚡ 프롬프트 캐싱', sub: '6초 동안 속도 1.7배' }, { k: 'magnet', col: '#C29BFF', label: '🧲 MCP 커넥터', sub: '7초 동안 주변을 빨아들임' }, { k: 'time', col: '#5CE1FF', label: '⏱ 컨텍스트 확장', sub: '+5초 · 해가 다시 떠오름' }, { k: 'lobby', col: '#7CFF9B', label: '💼 로비스트', sub: '단속반 철수 · 8초간 출동 중지' }];
const puRoot = new THREE.Group(); scene.add(puRoot);
const GEM = new THREE.IcosahedronGeometry(1, 0), BEAM = new THREE.CylinderGeometry(.3, .5, 16, 14, 1, true).translate(0, 8, 0);
let pups = [];
function spawnPups(rnd) {
  puRoot.clear(); pups = [];
  [150, 270, 390, 560, 760, 980, 1250, 1550, 1900, 2300, 2700, 3100, 3500, 3850, 640, 1400].forEach((d, i) => {
    const T = PUS[i % 4], s = 5 + d * .017;
    let x = 0, y = 0;
    for (let t = 0; t < 40; t++) { const a = rnd() * 6.283; x = Math.cos(a) * d; y = Math.sin(a) * d; let ok = true; for (const e of ents) if ((e.x - x) ** 2 + (e.y - y) ** 2 < (e.r + s * 2.5) ** 2) { ok = false; break; } if (ok) break; }
    const g = new THREE.Group(), gem = new THREE.Mesh(GEM, new THREE.MeshStandardMaterial({ color: T.col, emissive: T.col, emissiveIntensity: 2.6, roughness: .2, metalness: .3, flatShading: true }));
    gem.position.y = 1.9; gem.castShadow = true;
    const beam = new THREE.Mesh(BEAM, new THREE.MeshBasicMaterial({ color: new THREE.Color(T.col).multiplyScalar(1.6), transparent: true, opacity: .22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }));
    const halo = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.9, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(T.col).multiplyScalar(2.2), transparent: true, opacity: .8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -16 }));
    g.add(gem, beam, halo); g.position.set(x, 0, y); g.scale.setScalar(s); puRoot.add(g);
    pups.push({ x, y, s, T, g, gem, ph: rnd() * 6 });
  });
}
function updatePups(dt, now) {
  for (let i = pups.length - 1; i >= 0; i--) {
    const p = pups[i]; p.gem.rotation.y += dt * 2.2; p.gem.rotation.x += dt * .7; p.gem.position.y = 1.9 + Math.sin(now / 350 + p.ph) * .35;
    if ((p.x - P.x) ** 2 + (p.y - P.y) ** 2 > (P.r + p.s * 1.7) ** 2) continue;
    pups.splice(i, 1); puRoot.remove(p.g);
    if (p.T.k === 'speed') boostT = 6; else if (p.T.k === 'magnet') magT = 7; else if (p.T.k === 'lobby') { for (const c of cops) if (!c.boss) { c.dead = true; burst({ x: c.x, y: c.y, r: c.r, color: '#7CFF9B', tier: 0 }); } copT = 8; } else timeLeft = Math.min(GAME_TIME, timeLeft + 5);
    banner(p.T.label, p.T.sub); wave(p.x, p.y, p.s, Math.max(p.s * 8, P.r * 5), p.T.col, .6); buzz(25);
    [660, 880, 1320].forEach((f, k) => setTimeout(() => blip(f, .14, 'sine', .09), k * 60));
  }
}


/* ================= 돌진 · 피버 · 긴급 인수 미션 ================= */
const QUIP = { Notion: '문서도 대신 써줌', Slack: '안 읽은 알림 0개', Figma: '디자인은 이제 프롬프트로', Canva: '썸네일 자동 생성', Jira: '티켓 전부 닫힘', Zendesk: '문의 전부 자동 응답',
  Grammarly: '맞춤법은 기본이죠', Duolingo: '부엉이 은퇴', Zoom: '회의는 요약으로 대체', Dropbox: '파일 정리 끝', Asana: '할 일 전부 완료', Trello: '카드 전부 Done',
  Airtable: '표는 말로 만듭니다', Webflow: '사이트 한 문장 완성', Framer: '시안 100개 1초', Miro: '포스트잇 전부 정리', Intercom: '상담 대기 0명', HubSpot: '리드 자동 입력',
  Mailchimp: '뉴스레터 자동 발송', Typeform: '설문도 대화로', Linear: '이슈 자동 분류', Cursor: 'Tab 대신 내가 침', Vercel: '배포까지 한 번에', Replit: '코드는 내가 짤게',
  Zapier: '연결은 MCP로', 'Stack Overflow': '중복 질문으로 종료', Sketch: '레이어 정리 완료', GitLab: 'MR 자동 리뷰', Stripe: '결제 연동 3분', Discord: '서버 요약 완료',
  Twilio: '문자도 내가 씀', ClickUp: '클릭할 일 없음', Datadog: '알람 원인 찾음', Okta: '로그인은 한 번만', Snowflake: 'SQL 대신 말로',
  Adobe: '누끼 1초 컷', Salesforce: '영업 일지 자동 작성', Atlassian: '회고까지 자동', GitHub: 'PR 전부 머지', Shopify: '상세페이지 자동 완성', SAP: '전사 자원 접수',
  Oracle: '쿼리 최적화 완료', Accenture: '컨설팅 보고서 3초', '네이버': '지식iN 답변 완료', '카카오': '답장 대신 써줌', Netflix: '다음 화 줄거리 요약', Uber: '경로 계산 끝',
  Spotify: '플레이리스트 추천 완료', IBM: '왓슨 선배 수고했어요', Cisco: '네트워크 설정 끝', Intel: '칩은 못 만들지만 일단 접수', PayPal: '정산 자동화', LINE: '읽씹 방지', Airbnb: '숙소 후기 요약', LinkedIn: '자소서 대필 완료' };
const TAUNT = { ChatGPT: ['무엇이든 물어보세요', '저도 그거 할 줄 알아요', 'GPU가 녹고 있어요'], Gemini: ['검색해 볼게요', '멀티모달입니다만', '쌍둥이라 두 배'], Copilot: ['Tab 누르세요', '제안 하나 드릴까요', '부조종사 대기 중'], Perplexity: ['출처 [1][2][3]', '검색 중…', '인용 달아드림'] };
let dashT = 0, dashCd = 0, feverT = 0, feverNext = 35, mission = null, missionCd = 12, missionsDone = 0;
const DASH_CD = 6;
const mark = new THREE.Group();
{ const c = new THREE.Color(3, .35, .25);
  mark.add(new THREE.Mesh(BEAM, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .3, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false })));
  mark.add(new THREE.Mesh(new THREE.RingGeometry(1.5, 1.75, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -10, polygonOffsetUnits: -20 })));
  mark.visible = false; scene.add(mark); }
function dash() {
  if (state !== 'play' || dashCd > 0) return;
  let dx = input.dx, dy = input.dy; if (keys.ArrowLeft || keys.a) dx -= 1; if (keys.ArrowRight || keys.d) dx += 1; if (keys.ArrowUp || keys.w) dy -= 1; if (keys.ArrowDown || keys.s) dy += 1;
  let l = Math.hypot(dx, dy); if (l < .2) { dx = P.vx; dy = P.vy; l = Math.hypot(dx, dy); } if (l < .01) { dx = 0; dy = -1; l = 1; }
  const v = (95 + P.r * 3.6) * 2.5; P.vx = dx / l * v; P.vy = dy / l * v;
  dashT = .7; dashCd = dashMax(); dashes++; wave(P.x, P.y, P.r, P.r * 4, '#FFB37A', .4); buzz(20);
  if (AC && !muted) { try { hiss(AC.currentTime, .35, .16, 900); tone(AC.currentTime, 180, .3, 'sawtooth', .09, 700, 2600); } catch (e) {} }
}
$('dash').addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); dash(); });
window.addEventListener('keydown', e => { if (e.code === 'Space' && e.target.tagName !== 'INPUT') { e.preventDefault(); dash(); } });
function startFever() {
  feverT = G.pw.fever ? 10 : 5; feverNext = comboN + 60; banner('🔥 FEVER', '5초 동안 성장 1.3배 · 속도 UP'); wave(P.x, P.y, P.r, P.r * 12, '#FF5A1F', .9); slowT = .1; buzz([30, 30, 30, 30, 60]);
  [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => blip(f, .12, 'square', .07), i * 50));
}
function missionEnd(ok, why) {
  if (!mission) return; const e = mission.e; mission = null; missionCd = 10; mark.visible = false;
  if (ok) { missionsDone++; timeLeft = Math.min(GAME_TIME, timeLeft + 3); banner('✅ 긴급 인수 성공', e.name + ' · +3초'); wave(P.x, P.y, P.r, P.r * 10, '#7CFF9B', .8); [784, 988, 1318].forEach((f, i) => setTimeout(() => blip(f, .16, 'sine', .09), i * 70)); }
  else if (why) banner('❌ 긴급 인수 실패', why);
}
function updateMission(dt, now) {
  if (mission) {
    const e = mission.e; mission.t -= dt; mark.position.set(e.x, 0, e.y); mark.scale.setScalar(Math.max(e.r, P.r * .6)); mark.children[1].material.opacity = .55 + .4 * Math.sin(now / 110);
    if (mission.t <= 0) missionEnd(false, e.name + ' 인수 기회를 놓쳤어요');
    return;
  }
  missionCd -= dt; if (missionCd > 0 || unlocked < 1) return;
  const c = [];
  for (const e of ents) { if (!e.co || e.r > P.r * 1.08 || e.r < P.r * .4) continue; const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > P.r * 9 && d < P.r * 45 + 500) c.push([d, e]); }
  if (!c.length) { missionCd = 3; return; }
  c.sort((a, b) => a[0] - b[0]); const e = c[Math.min(c.length - 1, (Math.random() * 4) | 0)][1];
  mission = { e, t: 16 }; mark.visible = true; banner('🎯 긴급 인수: ' + e.name, '16초 안에 먹으면 +3초'); blip(880, .12, 'square', .07); setTimeout(() => blip(880, .12, 'square', .07), 140);
}



/* ================= 모델 · 오늘의 이벤트 · 업적 · 페이스 ================= */
const MODELS = {
  haiku:  { n: 'Haiku',  d: '빠름 · 돌진 쿨 -1.5초 · 성장 -8%', sp: 1.15, gr: .92, dcd: 1.5, r0: 12, start: { orbit: 1 } },
  sonnet: { n: 'Sonnet', d: '균형형 · 툴 유즈 보유', sp: 1, gr: 1, dcd: 0, r0: 12, start: { orbit: 1, bolt: 1 } },
  opus:   { n: 'Opus',   d: '크게 시작 · 성장 +12% · 속도 -8% · 충격파 보유', sp: .92, gr: 1.12, dcd: 0, r0: 13, start: { orbit: 1, pulse: 1 } },
};
let modelId = 'sonnet'; try { const m = localStorage.getItem('claudehon_model'); if (MODELS[m]) modelId = m; } catch (e) {}
let M = MODELS[modelId];
const EVENTS = [
  { n: '평범한 화요일', d: '특별 규칙 없음' },
  { n: 'GPU 대란', d: '단속반 2배 · 경험치 2배', cop: 2, xp: 2 },
  { n: 'IPO 데이', d: '성장 +15% · 제한 시간 -10초', grow: 1.15, time: -10 },
  { n: '규제 샌드박스', d: '단속반 절반 · 성장 -8%', cop: .5, grow: .92 },
  { n: '해커톤 주간', d: '경험치 +50% · 레벨업이 빨라짐', xp: 1.5 },
  { n: '골드러시', d: '유니콘 2배 · 라이벌 AI가 더 빠름', uni: 2, bot: 1.15 },
];
const EV = EVENTS[SEED % EVENTS.length];
const ACH = [
  { id: 'win', n: '특이점', d: '빅테크 9곳 전부 인수', t: r => r.win },
  { id: 'fast', n: '스피드런', d: '100초 안에 클리어', t: r => r.win && r.sec <= 100 },
  { id: 'ai4', n: '독점', d: '라이벌 AI 4/4 흡수', t: r => r.ai >= 4 },
  { id: 'cop100', n: '규제 파괴자', d: '단속반 100대 격파', t: r => r.kills >= 100 },
  { id: 'combo100', n: '콤보 100', d: '콤보 100 달성', t: r => r.combo >= 100 },
  { id: 'boss', n: '청문회 통과', d: '보스 격파', t: r => r.boss >= 1 },
  { id: 'uni', n: '유니콘 헌터', d: '유니콘 5곳 인수', t: r => r.uni >= 5 },
  { id: 'evo', n: '진화', d: '무기 진화 1회', t: r => r.evo >= 1 },
  { id: 'lv12', n: '레벨 12', d: '한 판에 레벨 12 도달', t: r => r.lvl >= 12 },
  { id: 'nodash', n: '비폭력', d: '돌진 없이 클리어', t: r => r.win && r.dashes === 0 },
  { id: 'rift', n: '균열 정복자', d: '균열 던전 1회 정복', t: r => r.rifts >= 1 },
  { id: 'uniq', n: '유니크 수집가', d: '유니크 장비 2개 장착', t: r => r.uniq >= 2 },
  { id: 'set', n: '세트 완성', d: 'Claude 세트 3부위', t: r => r.set >= 3 },
];
let achGot = {}; try { achGot = JSON.parse(localStorage.getItem('claudehon_ach') || '{}') || {}; } catch (e) {}
let bestCurve = null; try { bestCurve = JSON.parse(localStorage.getItem('claudehon_curve') || 'null'); } catch (e) {}
let bossDue = 0, treasureT = 0, curve = [], playT = 0, dashes = 0, uniEaten = 0, bossKills = 0, rerolls = 2, treasure = 0, boss = null, bossN = 0, lvTitle = '';
const orbN = () => upg.evoOrbit ? 6 : Math.min(6, (upg.orbit || 0) + (G.set >= 4 ? 2 : 0)), orbSz = () => P.r * (upg.evoOrbit ? .42 : .3);
const haloGeo = new THREE.TorusGeometry(.95, .09, 8, 36).rotateX(Math.PI / 2), haloMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.4, 2.3, .4), fog: false });
/* 보스: 반독점 청문회 트럭 */
const bossObj = new THREE.Group(); bossObj.visible = false; scene.add(bossObj);
const bossBar = new THREE.Mesh(bx(.2, .16, .9, -.14, 1.06, 0), new THREE.MeshBasicMaterial({ color: '#fff' }));
{ const navy = paint('#16264A'); for (const [g, m] of [[CAR.body, navy], [CAR.cabin, MAT.glass], [CAR.roof, navy], [CAR.wheels, MAT.tire], [CAR.hubs, MAT.chrome], [CAR.head, MAT.head], [CAR.tail, MAT.tail]]) { const o = new THREE.Mesh(g, m); o.castShadow = g === CAR.body; bossObj.add(o); } bossObj.add(bossBar); }
let bossSign = null;
function spawnBoss() {
  if (boss) return; const name = ['반독점 청문회', 'EU AI Act'][bossN % 2]; bossN++;
  const a = Math.random() * 6.283, d = P.r * 22 + 60;
  boss = { boss: true, name, x: P.x + Math.cos(a) * d, y: P.y + Math.sin(a) * d, vx: 0, vy: 0, hp: 45 * bossN + 10, max: 45 * bossN + 10, ocd: 0, r: P.r * .8, dead: false };
  cops.push(boss);
  if (bossSign) bossObj.remove(bossSign); bossSign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6 * .3125), signMat(name, '', '#16264A')); bossSign.position.set(0, 1.75, 0); bossObj.add(bossSign);
  bossObj.visible = true; banner('🚨 ' + name, '보스 출현 · 무기와 돌진으로 격파하세요', 'wasted');
  if (AC && !muted) for (let i = 0; i < 6; i++) { try { tone(AC.currentTime + i * .18, i % 2 ? 520 : 780, .16, 'sawtooth', .06); } catch (e) {} }
}
function setModel(id) { modelId = id; M = MODELS[id]; try { localStorage.setItem('claudehon_model', id); } catch (e) {} for (const b of document.querySelectorAll('#models button')) b.classList.toggle('sel', b.dataset.m === id); $('modeldesc').textContent = M.d; }
$('models').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setModel(b.dataset.m); });
$('reroll').addEventListener('click', () => { if (state !== 'levelup' || rerolls <= 0) return; rerolls--; state = 'play'; levelUp(lvTitle); });

/* ================= 로그라이크: 토큰 · 레벨업 · 자동 무기 · 단속반 ================= */
const UPG = [
  { id: 'orbit', ic: '🛰️', n: '서브에이전트', d: '주위를 도는 미니 Claude +1. 작은 건 먹고 큰 건물은 깎아요', max: 4 },
  { id: 'pulse', ic: '💥', n: '아티팩트 충격파', d: '주기적으로 단속반을 날리고 주변 건물을 깎아요', max: 4 },
  { id: 'bolt', ic: '🔧', n: '툴 유즈', d: '가까운 단속반을 자동으로 요격해요', max: 4 },
  { id: 'speed', ic: '⚡', n: '프롬프트 캐싱', d: '이동 속도 +10%', max: 4 },
  { id: 'magnet', ic: '🧲', n: 'MCP 커넥터', d: '토큰을 끌어오는 범위 +70%', max: 3 },
  { id: 'grow', ic: '📦', n: '배치 API', d: '먹을 때 성장량 +12%', max: 4 },
  { id: 'ctx', ic: '🪟', n: '컨텍스트 윈도우', d: '지금보다 4% 더 큰 것도 삼켜요', max: 3 },
  { id: 'armor', ic: '🛡️', n: '헌법적 AI', d: '단속반 과징금 피해 -25%', max: 3 },
  { id: 'haiku', ic: '🍃', n: '하이쿠 모드', d: '돌진 쿨타임 -1초', max: 3 },
  { id: 'xp', ic: '🧠', n: '확장 사고', d: '토큰 경험치 +25%', max: 3 },
  { id: 'evoOrbit', ic: '🌀', n: '에이전트 군단', d: '[진화] 서브에이전트 6기가 더 크고 빠르게 돕니다', max: 1, evo: 1, req: u => u.orbit >= 4 && u.magnet >= 1 },
  { id: 'evoPulse', ic: '🌋', n: '아티팩트 폭풍', d: '[진화] 충격파 범위 1.7배, 건물을 2배로 깎습니다', max: 1, evo: 1, req: u => u.pulse >= 4 && u.ctx >= 1 },
  { id: 'evoBolt', ic: '🔱', n: '병렬 툴 호출', d: '[진화] 요격탄을 3발씩 동시에 쏩니다', max: 1, evo: 1, req: u => u.bolt >= 4 && u.speed >= 1 },
];
const EVOHINT = { orbit: '진화: MCP 커넥터 필요', pulse: '진화: 컨텍스트 윈도우 필요', bolt: '진화: 프롬프트 캐싱 필요' };
let peakR = 0, upg = { orbit: 1 }, lvl = 1, xp = 0, kills = 0, hitImm = 0, cops = [], copT = 7, bolts = [], boltT = 0, pulseT = 3, orbA = 0, toks = [], choices = [];
const OX = [0, 0, 0, 0, 0, 0], OY = [0, 0, 0, 0, 0, 0];
const eatK = () => EAT + .04 * (upg.ctx || 0) + (dashT > 0 ? .08 : 0) + (G.pw.giant ? .06 : 0);
const need = () => 7 + lvl * 7;
const MAXC = 90, MAXT = 160, MAXB = 24;
const copBody = new THREE.InstancedMesh(CAR.body, std('#F2F2EE', .35, .3), MAXC), copCab = new THREE.InstancedMesh(CAR.cabin, MAT.glass, MAXC), copWheel = new THREE.InstancedMesh(CAR.wheels, MAT.tire, MAXC),
  copTrim = new THREE.InstancedMesh(mergeGeometries([bx(.5, .05, .72, -.14, .935, 0), bx(.62, .3, .84, .1, .4, 0)]), std('#16181C', .4, .3), MAXC),
  copBar = new THREE.InstancedMesh(bx(.12, .1, .6, -.14, 1.01, 0), new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), MAXC);
const tokMesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#8FF0FF', emissive: '#2FD0FF', emissiveIntensity: 2.4, roughness: .25, flatShading: true }), MAXT);
const boltMesh = new THREE.InstancedMesh(SPH, new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 1.3, .4) }), MAXB);
for (const m of [copBody, copCab, copWheel, copTrim, copBar, tokMesh, boltMesh]) { m.frustumCulled = false; m.count = 0; scene.add(m); }
copBody.castShadow = true; for (let i = 0; i < MAXC; i++) { copBar.setColorAt(i, tmpC.set('#fff')); copBody.setColorAt(i, tmpC); }
const orbs = []; for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(BOTGEO, ballMesh.material); m.castShadow = true; m.visible = false; scene.add(m); orbs.push(m); }
const YAX = new THREE.Vector3(0, 1, 0);
function resetRogue() { resetLoot(); bossDue = 0; treasureT = 0; curve = []; playT = 0; dashes = 0; uniEaten = 0; bossKills = 0; rerolls = 2; treasure = 0; boss = null; bossN = 0; bossObj.visible = false; $('boss').style.display = 'none'; peakR = 0; upg = Object.assign({}, M.start); lvl = 1; xp = 0; kills = 0; hitImm = 0; cops = []; toks = []; bolts = []; copT = 7; pulseT = 3; boltT = 0; choices = []; copBody.count = copCab.count = copWheel.count = copTrim.count = copBar.count = tokMesh.count = boltMesh.count = 0; for (const o of orbs) o.visible = false; $('levelup').style.display = 'none'; }
function gainXp(v) { xp += v * (1 + .25 * (upg.xp || 0)) * (EV.xp || 1) * (1 + G.xp / 100); if (xp >= need() && state === 'play') { xp -= need(); lvl++; levelUp(); } }
function levelUp(title) {
  const pool = UPG.filter(u => (upg[u.id] || 0) < u.max && (!u.req || u.req(upg))); for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  pool.sort((a, b) => (b.evo || 0) - (a.evo || 0));
  choices = pool.slice(0, 3); if (!choices.length) { timeLeft = Math.min(GAME_TIME, timeLeft + 2); return; }
  state = 'levelup'; up(); lvTitle = title || '';
  $('lvtitle').textContent = title || 'LEVEL ' + lvl;
  $('lvcards').innerHTML = choices.map((u, i) => `<button class="upg${u.evo ? ' evo' : ''}" data-i="${i}"><span class="ic">${u.ic}</span><span class="tx"><b>${u.n}</b><small>${u.d}${EVOHINT[u.id] && (upg[u.id] || 0) >= 2 ? ' · ' + EVOHINT[u.id] : ''}</small></span><i>${u.evo ? '진화' : upg[u.id] ? 'Lv ' + upg[u.id] + ' → ' + (upg[u.id] + 1) : 'NEW'}</i></button>`).join('');
  $('reroll').textContent = '🎲 다시 뽑기 (' + rerolls + ')'; $('reroll').style.visibility = rerolls > 0 ? 'visible' : 'hidden';
  $('levelup').style.display = 'flex';
  [523, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, .18, 'triangle', .09), i * 80)); buzz([20, 30, 20]);
}
function pick(i) {
  const u = choices[i]; if (!u || state !== 'levelup') return;
  upg[u.id] = (upg[u.id] || 0) + 1; $('levelup').style.display = 'none'; state = 'play'; last = performance.now();
  banner(u.ic + ' ' + u.n, 'Lv ' + upg[u.id]); wave(P.x, P.y, P.r, P.r * 7, '#8FF0FF', .6); blip(1046, .2, 'sine', .09);
  if (u.evo) { slowT = .2; wave(P.x, P.y, P.r, P.r * 14, '#FFD23F', 1); banner('✨ 진화: ' + u.n, u.d.replace('[진화] ', ''), 'gta'); }
  if (treasure > 0) { treasure--; levelUp('TREASURE'); } else if (xp >= need()) { xp -= need(); lvl++; levelUp(); }
}
$('lvcards').addEventListener('click', e => { const b = e.target.closest('.upg'); if (b) pick(+b.dataset.i); });
function killCop(c, ram) {
  if (c.dead) return; c.dead = true; kills++;
  if (c.boss) { boss = null; bossKills++; bossObj.visible = false; $('boss').style.display = 'none'; slowT = .3; shake = .5; wave(c.x, c.y, c.r, c.r * 10, '#FFD23F', 1); buzz([40, 40, 40, 40, 90]);
    for (let i = 0; i < 12 && toks.length < MAXT; i++) { const a = i / 12 * 6.283; toks.push({ x: c.x + Math.cos(a) * c.r * 1.5, y: c.y + Math.sin(a) * c.r * 1.5, t: 0 }); }
    dropLoot(c.x - c.r, c.y, 2, 1); dropLoot(c.x + c.r, c.y, 2, 1);
    burst({ x: c.x, y: c.y, r: c.r, color: '#FFD23F', tier: 4 }); banner('MISSION PASSED', c.name + ' 통과 · 보물 획득', 'gta');
    [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => blip(f, .2, 'square', .08), i * 90));
    treasureT = .9;
    return; }
  burst({ x: c.x, y: c.y, r: c.r, color: ram ? '#FFB37A' : '#DDE3EA', tier: 1 });
  if (toks.length < MAXT) toks.push({ x: c.x, y: c.y, t: 0 });
  if (c.el) { dropLoot(c.x, c.y, 1); if (c.name) pop(c.x, c.r * 2.6, c.y, c.name + ' 격파', 'big'); } else if (Math.random() < .035) dropLoot(c.x, c.y, 0);
  blip(520 + Math.random() * 200, .06, 'square', .04);
  if (ram) { shake = Math.max(shake, .25); buzz(20); }
}
function hurtCop(c, dmg, fx, fy) { c.hp -= dmg * (1 + G.dmg / 100) * (rift ? 2 : 1); const d = Math.hypot(c.x - fx, c.y - fy) || 1, kb = (60 + P.r * 3) * (c.boss ? .25 : 1); c.vx = (c.x - fx) / d * kb; c.vy = (c.y - fy) / d * kb; if (c.hp <= 0) killCop(c, false); }
function updateRogue(dt) {
  const now = performance.now(), stars = Math.min(5, unlocked + 1), base = 95 + P.r * 3.6;
  if (hitImm > 0) hitImm -= dt;
  if (bossDue > 0) { bossDue -= dt; if (bossDue <= 0) spawnBoss(); }
  if (treasureT > 0) { treasureT -= dt; if (treasureT <= 0) { if (state === 'play') levelUp('TREASURE'); else treasure++; } }
  // 서브에이전트(공전)
  const nO = orbN(), oR = P.r * (upg.evoOrbit ? 2.7 : 2.3), oS = orbSz(); orbA += dt * (upg.evoOrbit ? 3.6 : 2.6);
  for (let k = 0; k < 6; k++) { const m = orbs[k]; m.visible = k < nO; if (k < nO) { const a = orbA + k * 6.283 / nO; OX[k] = P.x + Math.cos(a) * oR; OY[k] = P.y + Math.sin(a) * oR; m.position.set(OX[k], oS, OY[k]); m.scale.setScalar(oS); m.rotation.set(0, -a * 2, a * 3); } }
  // 단속반 출동
  copT -= dt;
  if (!rift) { eliteT -= dt; if (eliteT <= 0 && stars >= 2) { eliteT = 15; spawnElite(); } }
  if (!rift && copT <= 0 && cops.length < Math.min(MAXC, (4 + stars * 8) * (EV.cop || 1))) { copT = Math.max(.28, 1.5 - stars * .22) / (EV.cop || 1); const a = Math.random() * 6.283, d = P.r * 24 + 60; cops.push({ x: P.x + Math.cos(a) * d, y: P.y + Math.sin(a) * d, vx: 0, vy: 0, hp: stars, ocd: 0, r: 1, dead: false }); }
  const cr = Math.max(6, P.r * .3), cv = base * (.5 + stars * .03), kk = 1 - Math.exp(-dt * 2.5);
  for (let i = 0; i < cops.length; i++) {
    const c = cops[i]; if (c.dead) continue; c.r = c.boss ? Math.max(P.r * .8, 10) : cr * (c.big || 1); c.ocd -= dt;
    const dx = P.x - c.x, dy = P.y - c.y, d = Math.hypot(dx, dy) || .001;
    if (d > P.r * 60 + 400 && !c.boss) { c.dead = true; continue; }
    const cv2 = c.boss ? cv * .8 : cv * (c.fast || 1); c.vx += (dx / d * cv2 - c.vx) * kk; c.vy += (dy / d * cv2 - c.vy) * kk; c.x += c.vx * dt; c.y += c.vy * dt;
    for (let j = 0; j < i; j++) { const o = cops[j]; if (o.dead) continue; const qx = c.x - o.x, qy = c.y - o.y, q = qx * qx + qy * qy, m = cr * 1.7; if (q < m * m && q > .0001) { const l = Math.sqrt(q), p = (m - l) / l * .5; c.x += qx * p; c.y += qy * p; o.x -= qx * p; o.y -= qy * p; } }
    for (const e of ents) { if (e.orbit || e.r < cr * .9) continue; const qx = c.x - e.x, qy = c.y - e.y, rs = cr + e.r * (e.hard || 1); if (qx > rs || qx < -rs || qy > rs || qy < -rs) continue; const q = Math.hypot(qx, qy) || .001; if (q < rs) { c.x = e.x + qx / q * rs; c.y = e.y + qy / q * rs; } }
    if (d < P.r + c.r * .8) {
      const nx = -dx / d, ny = -dy / d;
      if (dashT > 0) {
        if (!c.boss) { killCop(c, true); continue; }
        dashT = 0; hurtCop(c, 7, P.x, P.y); P.vx = -nx * (80 + P.r * 3); P.vy = -ny * (80 + P.r * 3); shake = .45; slowT = .1; buzz([30, 20, 50]); blip(80, .25, 'sawtooth', .13); wave(c.x, c.y, c.r, c.r * 3, '#FFD23F', .4); pop(c.x, c.r * 2.6, c.y, '쾅! -7', 'big'); if (c.dead) continue;
      }
      if (G.pw.thorns && !c.boss && hitImm <= 0) { hitImm = .5; killCop(c, true); continue; }
      c.x = P.x + nx * (P.r + c.r * .8); c.y = P.y + ny * (P.r + c.r * .8); c.vx = nx * cv * 1.6; c.vy = ny * cv * 1.6;
      if (hitImm <= 0 && pImm <= 0) { hitImm = c.boss ? 1.3 : .8; peakR = Math.max(peakR, P.r); P.r = Math.max(R0, peakR * .6, P.r * (1 - (c.boss ? .04 : .009) * (1 - .25 * (upg.armor || 0)) * (1 - Math.min(60, G.arm) / 100))); shake = Math.max(shake, c.boss ? .4 : .14); blip(c.boss ? 110 : 240, c.boss ? .2 : .07, 'square', .05); buzz(c.boss ? 40 : 12);
        if (c.boss) { P.vx = -nx * (120 + P.r * 4); P.vy = -ny * (120 + P.r * 4); pop(P.x, P.r * 2.6, P.y, c.name + ' 과징금 -4%', 'big'); }
        else if (now - lastBumpMsg > 1500) { lastBumpMsg = now; pop(P.x, P.r * 2.6, P.y, '과징금!', 'no'); } }
    }
    if (c.ocd <= 0) for (let k = 0; k < nO; k++) { const qx = c.x - OX[k], qy = c.y - OY[k], m = c.r + oS; if (qx * qx + qy * qy < m * m) { c.ocd = .35; hurtCop(c, 1.5, OX[k], OY[k]); break; } }
  }
  // 아티팩트 충격파
  const pl = upg.pulse || 0;
  if (pl) { pulseT -= dt; if (pulseT <= 0) { pulseT = 4.4 - pl * .5; const R = P.r * (5 + pl) * (upg.evoPulse ? 1.7 : 1), chip = upg.evoPulse ? .9 : .95; wave(P.x, P.y, P.r, R, '#FF7A45', .5); blip(140, .25, 'sine', .1);
    for (const c of cops) if (!c.dead && (c.x - P.x) ** 2 + (c.y - P.y) ** 2 < R * R) hurtCop(c, 2 + pl * .5, P.x, P.y);
    for (const e of ents) { if (e.ed || !e.obj || e.orbit || !e.co) continue; if ((e.x - P.x) ** 2 + (e.y - P.y) ** 2 > (R + e.r) ** 2) continue; e.r0 = e.r0 || e.r; if (e.r > e.r0 * .62) { e.r *= chip; e.obj.scale.setScalar(e.r); } } } }
  // 툴 유즈(요격탄)
  const bl = upg.bolt || 0;
  if (bl) { boltT -= dt; if (boltT <= 0) { const lim = (P.r * 16 + 80) ** 2, used = []; let fired = 0;
    for (let n = 0; n < (upg.evoBolt ? 3 : 1) && bolts.length < MAXB; n++) { let best = null, bd = lim; for (const c of cops) { if (c.dead || used.includes(c)) continue; const q = (c.x - P.x) ** 2 + (c.y - P.y) ** 2; if (q < bd) { bd = q; best = c; } } if (!best) break; used.push(best); bolts.push({ x: P.x, y: P.y, c: best, t: 0 }); fired++; }
    if (fired) { boltT = 1.1 / (.6 + bl * .4); blip(900, .05, 'sawtooth', .03); } } }
  for (const b of bolts) { b.t += dt; const c = b.c; if (c.dead || b.t > 1.6) { b.dead = true; continue; } const qx = c.x - b.x, qy = c.y - b.y, q = Math.hypot(qx, qy) || .001, st = base * 3.2 * dt; if (q < st + c.r) { b.dead = true; hurtCop(c, 1.5 + bl * .5, b.x, b.y); } else { b.x += qx / q * st; b.y += qy / q * st; } }
  // 토큰
  const mr = G.pw.vac ? 1e9 : (P.r * (3 + 2.1 * (upg.magnet || 0)) + 20) * (1 + G.mag / 100), ts = Math.max(2.4, P.r * .11);
  for (const t of toks) { t.t += dt; const qx = P.x - t.x, qy = P.y - t.y, q = Math.hypot(qx, qy) || .001; if (q < P.r * 1.05) { t.dead = true; gainXp(1); blip(1320, .05, 'sine', .05); } else if (q < mr) { const st = base * 1.8 * dt; t.x += qx / q * st; t.y += qy / q * st; } else if (t.t > 25) t.dead = true; }
  cops = cops.filter(c => !c.dead); bolts = bolts.filter(b => !b.dead); toks = toks.filter(t => !t.dead);
  // 인스턴스 갱신
  const fl = (now / 150) | 0;
  let ci = 0;
  for (const c of cops) { q4.setFromAxisAngle(YAX, -Math.atan2(c.vy, c.vx));
    if (c.boss) { bossObj.position.set(c.x, 0, c.y); bossObj.quaternion.copy(q4); bossObj.scale.setScalar(c.r); bossBar.material.color.setRGB(fl & 1 ? 3.4 : .2, .3, fl & 1 ? .15 : 3.6); if (bossSign) bossSign.quaternion.copy(q4).invert(); continue; }
    m4.compose(v3.set(c.x, 0, c.y), q4, s3.setScalar(c.r)); copBody.setMatrixAt(ci, m4); copCab.setMatrixAt(ci, m4); copWheel.setMatrixAt(ci, m4); copTrim.setMatrixAt(ci, m4); copBar.setMatrixAt(ci, m4); copBar.setColorAt(ci, (fl + ci) & 1 ? tmpC.setRGB(3.4, .15, .15) : tmpC.setRGB(.2, .5, 3.6)); copBody.setColorAt(ci, c.rift ? tmpC.setRGB(.8, .5, 1.7) : c.el ? tmpC.setRGB(1.7, 1.3, .3) : tmpC.setRGB(1, 1, 1)); ci++; }
  for (const m of [copBody, copCab, copWheel, copTrim, copBar]) { m.count = ci; m.instanceMatrix.needsUpdate = true; } copBar.instanceColor.needsUpdate = true; copBody.instanceColor.needsUpdate = true;
  if (boss) { $('boss').style.display = 'block'; $('bossname').textContent = '🚨 ' + boss.name; $('bossfill').style.width = Math.max(0, boss.hp / boss.max * 100) + '%'; }
  playT += dt; if (playT >= curve.length * 5) curve.push(Math.round(P.r));
  for (let i = 0; i < toks.length; i++) { const t = toks[i]; m4.compose(v3.set(t.x, ts * (1.5 + .3 * Math.sin(now / 200 + i)), t.y), q4.setFromAxisAngle(YAX, now / 300 + i), s3.set(ts * .7, ts, ts * .7)); tokMesh.setMatrixAt(i, m4); }
  tokMesh.count = toks.length; tokMesh.instanceMatrix.needsUpdate = true;
  const bs = Math.max(2, P.r * .13); for (let i = 0; i < bolts.length; i++) { m4.makeScale(bs, bs, bs).setPosition(bolts[i].x, P.r * .8, bolts[i].y); boltMesh.setMatrixAt(i, m4); }
  boltMesh.count = bolts.length; boltMesh.instanceMatrix.needsUpdate = true;
}
/* AI 밸리 지명 (바닥 스텐실) */
{ const names = [['SAND HILL RD', 250, 1.2, 60], ['PALO ALTO', 760, .1, 150], ['MENLO PARK', 760, 3.3, 150], ['MOUNTAIN VIEW', 1520, 1.9, 300], ['SUNNYVALE', 1520, 5.0, 300], ['CUPERTINO', 2650, .9, 520], ['SAN JOSE', 2650, 4.1, 520], ['SAN FRANCISCO', 3850, 2.6, 640], ['SOMA', 3850, 5.7, 640], ['EL CAMINO REAL', 470, 4.5, 34], ['US 101', 1050, 2.6, 62], ['I-280', 2000, .3, 110], ['HWY 1', 3300, 3.7, 190]];
  for (const [t, d, a, sz] of names) { const tex = canvasTex(1024, 160, c => { c.font = '900 130px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#FFFFFF'; c.fillText(t, 512, 86); });
    const m = new THREE.Mesh(PLANE, new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: sz < 200 && d < 500 || [470, 1050, 2000, 3300].includes(d) ? .75 : .32, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -12 }));
    m.rotation.x = -Math.PI / 2; m.scale.set(sz * 6.4, sz, 1); m.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); m.renderOrder = 6; scene.add(m); } }


/* ================= 디아블로식 전리품 · 정예 · 고블린 · 균열 ================= */
const SLOTS = { gpu: ['🖥️', 'GPU'], guard: ['🛡️', '가드레일'], conn: ['🔌', '커넥터'], prompt: ['📜', '프롬프트'] }, SLOTK = Object.keys(SLOTS);
const RAR = [['일반', '#E8E8E8'], ['매직', '#6FA8FF'], ['레어', '#FFE14D'], ['유니크', '#FF8A2B'], ['세트', '#3DFF7A']];
const AFF = { grow: ['탐욕의', '성장'], spd: ['신속의', '속도'], mag: ['자석의', '토큰 범위'], arm: ['수호의', '과징금 감소'], dmg: ['파괴의', '무기 피해'], xp: ['현자의', '경험치'] }, AFFK = Object.keys(AFF);
const UNIQ = [
  { slot: 'gpu', n: 'H100 성배', st: { dmg: 60, grow: 6 }, pw: 'crit', d: '무기 피해가 크게 오름' },
  { slot: 'conn', n: '하이쿠의 깃털', st: { spd: 8 }, pw: 'dash', d: '돌진 쿨타임 절반' },
  { slot: 'prompt', n: '소네트의 펜', st: { xp: 20 }, pw: 'fever', d: '피버 지속 2배' },
  { slot: 'guard', n: '헌법 사본', st: { arm: 25 }, pw: 'thorns', d: '닿은 단속반이 부서짐' },
  { slot: 'prompt', n: '오퍼스의 왕관', st: { grow: 10 }, pw: 'giant', d: '먹는 기준 +6%' },
  { slot: 'conn', n: 'MCP 만능 허브', st: { mag: 60 }, pw: 'vac', d: '토큰이 어디서든 끌려옴' },
];
let gear = {}, G = { grow: 0, spd: 0, mag: 0, arm: 0, dmg: 0, xp: 0, set: 0, pw: {} }, loots = [], uniqGot = 0, riftsDone = 0, eliteT = 16, gob = null, gobT = 28, rift = null, portals = [];
const lootRoot = new THREE.Group(); scene.add(lootRoot);
const dashMax = () => (DASH_CD - (upg.haiku || 0) - M.dcd) * (G.pw.dash ? .5 : 1);
function rollItem(minR, luck) {
  const x = Math.random() * 100 - (luck || 0) * 25; let rar = x < 3 ? 3 : x < 6 ? 4 : x < 22 ? 2 : x < 52 ? 1 : 0; rar = Math.max(rar, minR || 0);
  if (rar === 3) { const u = UNIQ[(Math.random() * UNIQ.length) | 0]; return { slot: u.slot, n: u.n, rar, st: u.st, pw: u.pw, d: u.d }; }
  const slot = SLOTK[(Math.random() * 4) | 0];
  if (rar === 4) return { slot, n: 'Claude의 ' + SLOTS[slot][1], rar, st: { grow: 6 }, set: 1 };
  const st = {}, ks = AFFK.slice(); let first = '';
  for (let i = 0; i < rar + 1; i++) { const k = ks.splice((Math.random() * ks.length) | 0, 1)[0]; st[k] = Math.round((3 + Math.random() * 3) * (1 + rar * .7)); first = first || AFF[k][0]; }
  return { slot, n: first + ' ' + SLOTS[slot][1], rar, st };
}
const itemScore = it => Object.values(it.st).reduce((a, b) => a + b, 0) + it.rar * 8 + (it.pw ? 30 : 0) + (it.set ? 14 : 0);
const itemDesc = it => Object.entries(it.st).map(([k, v]) => AFF[k][1] + ' +' + v + '%').join(' · ') + (it.d ? ' · ' + it.d : '') + (it.set ? ' · 세트 ' + G.set + '/4' : '');
function recalcGear() {
  G = { grow: 0, spd: 0, mag: 0, arm: 0, dmg: 0, xp: 0, set: 0, pw: {} };
  for (const k of SLOTK) { const it = gear[k]; if (!it) continue; for (const a in it.st) G[a] += it.st[a]; if (it.pw) G.pw[it.pw] = 1; if (it.set) G.set++; }
  if (G.set >= 2) G.spd += 10; if (G.set >= 3) G.grow += 15;
  $('gear').innerHTML = SLOTK.map(k => { const it = gear[k]; return `<span style="border-color:${it ? RAR[it.rar][1] : 'rgba(255,255,255,.25)'};${it ? 'box-shadow:0 0 8px ' + RAR[it.rar][1] : 'opacity:.45'}">${SLOTS[k][0]}</span>`; }).join('');
}
function dropLoot(x, y, minR, luck) {
  if (loots.length >= 10) return; const it = rollItem(minR, luck), col = RAR[it.rar][1], s = Math.max(5, P.r * .5);
  const g = new THREE.Group(), c = new THREE.Color(col).multiplyScalar(it.rar >= 3 ? 2.6 : 1.6);
  g.add(new THREE.Mesh(BEAM, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: it.rar >= 2 ? .5 : .22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false })));
  const box = new THREE.Mesh(UBOX, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.6, roughness: .3 })); box.scale.set(.9, .9, .9); box.position.y = .8; g.add(box);
  g.position.set(x, 0, y); g.scale.setScalar(s); lootRoot.add(g); loots.push({ x, y, it, g, box, s, t: 0 });
  if (it.rar >= 3) { [1568, 2093, 2637].forEach((f, i) => setTimeout(() => blip(f, .5, 'sine', .1), i * 110)); pop(x, s * 3, y, '★ ' + it.n, 'big'); buzz([20, 40, 60]); } else if (it.rar >= 1) blip(1175, .12, 'triangle', .06);
}
function updateLoot(dt) {
  for (let i = loots.length - 1; i >= 0; i--) {
    const l = loots[i]; l.t += dt; l.box.rotation.y += dt * 2; l.box.position.y = .8 + Math.sin(l.t * 4) * .15;
    if ((l.x - P.x) ** 2 + (l.y - P.y) ** 2 > (P.r * 1.15 + l.s) ** 2) { if (l.t > 40) { lootRoot.remove(l.g); loots.splice(i, 1); } continue; }
    lootRoot.remove(l.g); loots.splice(i, 1);
    const it = l.it, cur = gear[it.slot];
    if (!cur || itemScore(it) > itemScore(cur)) {
      gear[it.slot] = it; recalcGear(); if (it.rar === 3) uniqGot++;
      if (it.rar >= 2) banner(SLOTS[it.slot][0] + ' ' + it.n, '[' + RAR[it.rar][0] + '] ' + itemDesc(it), 'r' + it.rar); else pop(P.x, P.r * 2.8, P.y, SLOTS[it.slot][0] + ' ' + it.n + ' 장착', '');
      wave(P.x, P.y, P.r, P.r * 5, RAR[it.rar][1], .5); blip(880, .12, 'triangle', .07); if (cur) gainXp(2);
    } else { gainXp(2 + it.rar * 2); pop(P.x, P.r * 2.8, P.y, '분해: ' + it.n + ' → 경험치', 'no'); }
  }
}
/* VC 고블린: 도망 다니며 토큰을 흘린다 */
const gobObj = new THREE.Group(); gobObj.visible = false; scene.add(gobObj);
{ const m = new THREE.Mesh(BOTGEO, new THREE.MeshStandardMaterial({ color: '#F2B705', roughness: .25, metalness: .9, envMapIntensity: 1.6, emissive: '#7A5200', emissiveIntensity: .6 })); m.castShadow = true; gobObj.add(m);
  const lb = new THREE.Mesh(new THREE.PlaneGeometry(3, 3 * .3125), signMat('VC 고블린', '', '#8A5A00')); lb.position.y = 1.7; lb.rotation.x = -.25; gobObj.add(lb); }
function updateGoblin(dt) {
  const base = 95 + P.r * 3.6;
  if (!gob) { gobT -= dt; if (gobT <= 0 && !rift && unlocked >= 1) { gobT = 34; const a = Math.random() * 6.283, d = P.r * 11 + 40; gob = { x: P.x + Math.cos(a) * d, y: P.y + Math.sin(a) * d, t: 13, dt: 0, w: Math.random() * 6 }; gobObj.visible = true; banner('💰 VC 고블린 출현', '도망가기 전에 잡으면 레어 이상 전리품'); blip(1568, .1, 'square', .06); setTimeout(() => blip(1245, .1, 'square', .06), 110); } return; }
  const g = gob, dx = g.x - P.x, dy = g.y - P.y, d = Math.hypot(dx, dy) || .001, r = Math.max(5, P.r * .36);
  g.t -= dt; g.w += dt * 1.7; const fa = Math.atan2(dy, dx) + Math.sin(g.w) * .8, v = base * .9;
  g.x += Math.cos(fa) * v * dt; g.y += Math.sin(fa) * v * dt; const wd = Math.hypot(g.x, g.y); if (wd > WORLD_R - 100) { g.x *= (WORLD_R - 100) / wd; g.y *= (WORLD_R - 100) / wd; }
  g.dt -= dt; if (g.dt <= 0 && toks.length < MAXT) { g.dt = .45; toks.push({ x: g.x, y: g.y, t: 0 }); }
  gobObj.position.set(g.x, r + Math.abs(Math.sin(g.w * 5)) * r * .5, g.y); gobObj.scale.setScalar(r);
  if (d < P.r + r) { gob = null; gobObj.visible = false; dropLoot(P.x, P.y + P.r * 2.4, 2, 1); for (let i = 0; i < 8 && toks.length < MAXT; i++) { const a = i / 8 * 6.283; toks.push({ x: g.x + Math.cos(a) * r * 3, y: g.y + Math.sin(a) * r * 3, t: 0 }); } banner('💰 VC 고블린 포획!', '시드 투자금 회수'); wave(g.x, g.y, r, r * 9, '#FFD23F', .7); slowT = .12; buzz([20, 30, 50]); [784, 1046, 1318, 1568].forEach((f, i) => setTimeout(() => blip(f, .12, 'square', .07), i * 60)); }
  else if (g.t <= 0) { pop(g.x, r * 3, g.y, '엑시트! 👋', 'say'); gob = null; gobObj.visible = false; }
}
/* 균열: 해상 데이터센터 던전 */
const RC = { x: 0, y: 12500 };
const riftRoot = new THREE.Group(); riftRoot.visible = false; scene.add(riftRoot);
{ const ft = tile(canvasTex(256, 256, c => { c.fillStyle = '#12141C'; c.fillRect(0, 0, 256, 256); c.strokeStyle = '#3A2A66'; c.lineWidth = 6; c.strokeRect(0, 0, 256, 256); c.strokeStyle = '#6B45D6'; c.lineWidth = 2; c.strokeRect(20, 20, 216, 216); })); ft.repeat.set(14, 14);
  const fl = new THREE.Mesh(new THREE.CircleGeometry(1, 72).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: ft, roughness: .35, metalness: .5, emissiveMap: ft, emissive: '#8A6BFF', emissiveIntensity: .5 })); fl.receiveShadow = true; riftRoot.add(fl);
  const wl = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .03, 72, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, .7, 3.2), transparent: true, opacity: .55, side: THREE.DoubleSide, depthWrite: false, fog: false })); wl.position.y = .015; riftRoot.add(wl);
  const rackM = new THREE.MeshStandardMaterial({ color: '#1B1E28', roughness: .4, metalness: .6, emissive: '#39D5FF', emissiveIntensity: .25 });
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283, m = new THREE.Mesh(UBOX, rackM); m.scale.set(.05, .13, .08); m.position.set(Math.cos(a) * .55, .065, Math.sin(a) * .55); m.rotation.y = -a; m.castShadow = true; riftRoot.add(m); } }
const portalGeo = new THREE.TorusGeometry(1, .16, 10, 40), portalMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, .8, 3.6), fog: false });
function spawnPortals(rnd) {
  for (const p of portals) scene.remove(p.g); portals = [];
  for (const d of [620, 1500, 2700]) { let x = 0, y = 0; for (let t = 0; t < 40; t++) { const a = rnd() * 6.283; x = Math.cos(a) * d; y = Math.sin(a) * d; let ok = true; for (const e of ents) if ((e.x - x) ** 2 + (e.y - y) ** 2 < (e.r + d * .04 + 20) ** 2) { ok = false; break; } if (ok) break; }
    const s = 8 + d * .02, g = new THREE.Group(), t1 = new THREE.Mesh(portalGeo, portalMat); t1.position.y = 1.2; g.add(t1);
    { const bm = new THREE.Mesh(BEAM, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, .6, 3), transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false })); bm.scale.set(.5, .6, .5); g.add(bm); }
    g.position.set(x, 0, y); g.scale.setScalar(s); scene.add(g); portals.push({ x, y, s, g, t1 }); }
}
function resetLoot() { for (const l of loots) lootRoot.remove(l.g); loots = []; gear = {}; uniqGot = 0; riftsDone = 0; eliteT = 16; gob = null; gobT = 28; gobObj.visible = false; rift = null; riftRoot.visible = false; recalcGear(); }
function enterRift(p) {
  scene.remove(p.g); portals.splice(portals.indexOf(p), 1);
  const A = Math.max(280, P.r * 26); rift = { t: 40, wave: 0, A, s: P.r, ret: { x: P.x, y: P.y }, clear: false, exitT: 0, cool: .6 };
  cops = []; if (mission) { mission = null; mark.visible = false; } missionCd = 10; if (gob) { gob = null; gobObj.visible = false; }
  P.x = RC.x; P.y = RC.y + A * .5; P.vx = P.vy = 0; camX = P.x; camZ = P.y; pImm = 1.5;
  riftRoot.position.set(RC.x, 0, RC.y); riftRoot.scale.setScalar(A); riftRoot.visible = true;
  banner('⚔️ 균열: 해상 데이터센터', '40초 안에 3웨이브 격파 · 무기 피해 2배', 'wasted'); slowT = .15; buzz([30, 30, 60]);
  if (AC && !muted) { try { tone(AC.currentTime, 110, .9, 'sawtooth', .1, 55, 900); } catch (e) {} }
}
function leaveRift(ok) {
  const r = rift; rift = null; riftRoot.visible = false; cops = []; boss = null; loots = loots.filter(l => { if (l.y > 8000) { lootRoot.remove(l.g); return false; } return true; });
  P.x = r.ret.x; P.y = r.ret.y; P.vx = P.vy = 0; camX = P.x; camZ = P.y; pImm = 2.5; copT = 4; missionCd = 6;
  if (ok) riftsDone++; banner(ok ? '균열 정복' : '균열 붕괴', ok ? '전리품을 챙겨 귀환했습니다' : '시간 초과 · 빈손으로 귀환', ok ? 'gta' : 'wasted'); wave(P.x, P.y, P.r, P.r * 10, '#B48CFF', .8);
}
function updateRift(dt) {
  for (const p of portals) { p.t1.rotation.y += dt * 2.5; p.t1.rotation.x = Math.sin(performance.now() / 500) * .4; if (!rift && !boss && state === 'play' && (p.x - P.x) ** 2 + (p.y - P.y) ** 2 < (P.r + p.s) ** 2) { enterRift(p); break; } }
  if (!rift) return; const r = rift;
  let dx = P.x - RC.x, dy = P.y - RC.y, d = Math.hypot(dx, dy) || .001; const lim = r.A - P.r; if (d > lim) { P.x = RC.x + dx / d * lim; P.y = RC.y + dy / d * lim; }
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283, px = RC.x + Math.cos(a) * r.A * .55, py = RC.y + Math.sin(a) * r.A * .55, pr = r.A * .045 + P.r, qx = P.x - px, qy = P.y - py, q = Math.hypot(qx, qy) || .001; if (q < pr) { P.x = px + qx / q * pr; P.y = py + qy / q * pr; } }
  if (r.clear) { r.exitT -= dt; if (r.exitT <= 0 || (r.exitT < 5.5 && !loots.some(l => l.y > 8000))) leaveRift(true); return; }
  r.t -= dt; if (r.t <= 0) { leaveRift(false); return; }
  r.cool -= dt; if (r.cool > 0 || cops.some(c => !c.dead)) return;
  if (r.wave >= 3) { r.clear = true; r.exitT = 7; dropLoot(RC.x - r.s * 3, RC.y, 2, 1); dropLoot(RC.x + r.s * 3, RC.y, 2, 2); for (let i = 0; i < 10 && toks.length < MAXT; i++) { const a = i / 10 * 6.283; toks.push({ x: RC.x + Math.cos(a) * r.s * 6, y: RC.y + Math.sin(a) * r.s * 6, t: 0 }); } banner('균열 정복!', '전리품을 주우면 귀환합니다', 'gta'); slowT = .25; wave(P.x, P.y, P.r, r.A, '#FFD23F', 1.2); return; }
  r.wave++; r.cool = .8; const n = 4 + r.wave * 2;
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283; cops.push({ x: RC.x + Math.cos(a) * r.A * .86, y: RC.y + Math.sin(a) * r.A * .86, vx: 0, vy: 0, hp: r.wave, ocd: 0, r: 1, dead: false, rift: 1 }); }
  if (r.wave === 3) cops.push({ x: RC.x, y: RC.y - r.A * .8, vx: 0, vy: 0, hp: 14, ocd: 0, r: 1, dead: false, rift: 1, el: 2, big: 2.3, name: '균열 수호자' });
  pop(P.x, P.r * 3, P.y, '웨이브 ' + r.wave + '/3', 'big'); blip(196, .3, 'sawtooth', .09);
}
function spawnElite() {
  const k = 1 + ((Math.random() * 3) | 0), a = Math.random() * 6.283, d = P.r * 22 + 60, stars = Math.min(5, unlocked + 1);
  cops.push({ x: P.x + Math.cos(a) * d, y: P.y + Math.sin(a) * d, vx: 0, vy: 0, hp: stars * (k === 1 ? 2 : 4), ocd: 0, r: 1, dead: false, el: k, fast: k === 1 ? 1.45 : 1, big: k === 2 ? 1.8 : 1.25, name: ['', '신속한', '거대한', '철갑'][k] + ' 단속반' });
  pop(P.x, P.r * 3.2, P.y, '⚠️ 정예: ' + ['', '신속한', '거대한', '철갑'][k] + ' 단속반', 'big'); blip(330, .2, 'square', .06);
}
/* 내 랭킹 (이 기기에 저장) */
let runs = []; try { runs = JSON.parse(localStorage.getItem('claudehon_runs') || '[]') || []; } catch (e) {}
function renderRank() { $('rank').innerHTML = runs.length ? '<b>🏆 내 랭킹</b>' + runs.slice(0, 5).map((r, i) => `<div><span>${i + 1}. ${r.win ? r.sec + '초 클리어' : fmtMoney(r.worth)}</span><span>${r.model} · Lv ${r.lvl} · #${r.day}</span></div>`).join('') : ''; }

/* ================= 게임 로직 ================= */
function update(dt) {
  let ix = input.dx, iy = input.dy;
  if (keys.ArrowLeft || keys.a) ix -= 1; if (keys.ArrowRight || keys.d) ix += 1;
  if (keys.ArrowUp || keys.w) iy -= 1; if (keys.ArrowDown || keys.s) iy += 1;
  const il = Math.hypot(ix, iy); if (il > 1) { ix /= il; iy /= il; }
  if (il > .2 && !moved) { moved = true; $('hint').style.display = 'none'; }
  const maxV = (95 + P.r * 3.6) * M.sp * (1 + G.spd / 100) * (1 + .1 * (upg.speed || 0)) * (boostT > 0 ? 1.7 : 1) * (dashT > 0 ? 2.3 : feverT > 0 ? 1.2 : 1), k = 1 - Math.exp(-dt * (il > 0.05 ? 5 : 3));
  if (boostT > 0) boostT -= dt; if (magT > 0) magT -= dt; if (dashT > 0) dashT -= dt; if (dashCd > 0) dashCd -= dt; if (feverT > 0) feverT -= dt;
  P.vx += (ix * maxV - P.vx) * k; P.vy += (iy * maxV - P.vy) * k;
  P.x += P.vx * dt; P.y += P.vy * dt;
  const sp = Math.hypot(P.vx, P.vy);
  if (sp > .01) { v3.set(P.vy / sp, 0, -P.vx / sp); q4.setFromAxisAngle(v3, sp * dt / P.r); ball.quaternion.premultiply(q4); }
  const pd = Math.hypot(P.x, P.y), lim = WORLD_R - P.r;
  if (!rift && pd > lim) { P.x *= lim / pd; P.y *= lim / pd; }
  spNorm = sp / (95 + P.r * 3.6);
  dustT -= dt;
  if (spNorm > .55 && dustT <= 0) { dustT = boostT > 0 ? .02 : .05; const q = pdata[pcur]; q.life = .45; q.x = P.x - P.vx / sp * P.r * .7 + (Math.random() - .5) * P.r; q.z = P.y - P.vy / sp * P.r * .7 + (Math.random() - .5) * P.r; q.y = 0; q.vx = -P.vx * .12; q.vz = -P.vy * .12; q.vy = P.r * (1.5 + Math.random() * 2); q.s = P.r * (.07 + Math.random() * .07); parts.setColorAt(pcur, tmpC.set(boostT > 0 ? '#FFD23F' : '#C9BEAA')); parts.instanceColor.needsUpdate = true; pcur = (pcur + 1) % PN; }

  const thr = P.r * eatK(), nOrb = orbN(), orbS = orbSz(); let ringDirty = false;
  for (let i = ents.length - 1; i >= 0; i--) {
    const e = ents[i];
    const ed = e.r <= thr;
    if (e.orbit) { const o = e.orbit; o.ang += o.w * dt; e.x = Math.cos(o.ang) * o.rad; e.y = Math.sin(o.ang) * o.rad; e.obj.position.x = e.x; e.obj.position.z = e.y; e.obj.rotation.y = -(o.ang + 1.5708) + (o.w < 0 ? Math.PI : 0); }
    if (magT > 0 && ed && e.obj && !e.orbit) { const mx = P.x - e.x, my = P.y - e.y, md = Math.hypot(mx, my); if (md < P.r * 7 + 40 && md > 1) { const pull = Math.min(md, (P.r * 5 + 70) * dt); e.x += mx / md * pull; e.y += my / md * pull; e.obj.position.x = e.x; e.obj.position.z = e.y; e.mv = true; } }
    if (ed !== e.ed || (ed && (e.orbit || e.mv))) { e.ed = ed; m4.makeScale(e.r, e.r, e.r).setPosition(e.x, 0, e.y); rings.setMatrixAt(e.idx, ed ? m4 : ZERO); ringDirty = true; }
    if (e.obj) {
      if (e.tw > 0) { e.tw -= dt; e.obj.rotation.z = e.tw > 0 ? Math.sin(e.tw * 45) * .06 : 0; }
      if (e.hop > 0) { e.hop -= dt; const t = Math.max(0, e.hop) / .5; e.obj.position.y = t < 1 ? Math.sin(t * Math.PI) * e.r * .4 : 0; }
    }
    if (nOrb && !e.orbit) { let got = false;
      for (let k = 0; k < nOrb; k++) { const qx = e.x - OX[k], qy = e.y - OY[k], rs = e.r * (e.hard || 1) + orbS; if (qx * qx + qy * qy > rs * rs) continue;
        if (e.r <= P.r * .5) { got = true; break; }
        if (!ed && e.obj) { e.r0 = e.r0 || e.r; if (e.r > e.r0 * .62) { e.r *= 1 - .2 * dt; e.obj.scale.setScalar(e.r); } } }
      if (got) { eat(e, i); ringDirty = true; continue; } }
    const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 0.001, cr = ed ? e.r : e.r * (e.hard || 1);
    if (d > P.r + cr) continue;
    if (ed) { if (d < P.r + e.r * 0.25) { eat(e, i); ringDirty = true; } }
    else {
      const nx = dx / d, ny = dy / d;
      P.x = e.x + nx * (P.r + cr); P.y = e.y + ny * (P.r + cr);
      const vn = P.vx * nx + P.vy * ny;
      if (vn < 0) {
        P.vx -= 1.7 * vn * nx; P.vy -= 1.7 * vn * ny;
        if (-vn > maxV * 0.35) {
          shake = 0.25; e.tw = 0.35; blip(110, 0.12, 'square', 0.05); buzz(18);
          if (dashT > 0 && e.obj && !e.orbit) {            // 돌진으로 들이받으면 건물이 깎인다
            dashT = 0; e.r0 = e.r0 || e.r; shake = .45; slowT = .08; buzz([30, 20, 50]); blip(70, .25, 'sawtooth', .13); wave(e.x, e.y, e.r, e.r * 3, e.color, .45); burst(e);
            if (e.r > e.r0 * .62) { e.r *= .92; e.obj.scale.setScalar(e.r); pop(e.x, e.r * 2.4, e.y, '쾅! ' + e.name + ' -8%', 'big'); lastBumpMsg = performance.now(); }
          }
          const now = performance.now();
          if (now - lastBumpMsg > 900) { lastBumpMsg = now; pop(e.x, e.r * 2, e.y, e.name + '… 아직 너무 커요', 'no'); }
        }
      }
    }
  }
  if (ringDirty) rings.instanceMatrix.needsUpdate = true;

  while (unlocked < 4 && P.r * EAT >= TIERS[unlocked + 1].rmin) {
    unlocked++; banner('🔓 ' + TIERS[unlocked].name + ' 인수 가능!', '음악이 한 겹 더 쌓였어요'); blip(520, 0.35, 'sine', 0.1); buzz(30); wave(P.x, P.y, P.r, P.r * 14, null, .9); slowT = .1;
    if (unlocked === 2 || unlocked === 4) bossDue = 2.5;
    if (AC && !muted) for (let i = 0; i < 4; i++) { try { tone(AC.currentTime + .5 + i * .22, i % 2 ? 620 : 880, .2, 'square', .05); } catch (e) {} }
    setTimeout(() => { if (state === 'play') pop(P.x, P.r * 3, P.y, '🚨 규제 레벨 ' + '★'.repeat(Math.min(5, unlocked + 1)), 'big'); }, 900);
    for (const e of ents) if (e.tier === unlocked) e.hop = .5 + Math.random() * .5;
  }
  updateBots(dt); updatePups(dt, performance.now()); updateMission(dt, performance.now()); updateRogue(dt); updateLoot(dt); updateGoblin(dt); updateRift(dt);
  if (comboT > 0) { comboT -= dt; if (comboT <= 0) { comboN = 0; feverNext = 35; $('combo').classList.remove('on'); } }
  shake = Math.max(0, shake - dt);
  if (!rift) timeLeft -= dt;
  if (bigEaten.length === bigTotal) end(true);
  else if (timeLeft <= 0) { timeLeft = 0; end(false); }
}

const VERBS = ['인수!', '흡수!', '합병!', '삼킴!', '대체!'];
function eat(e, i) {
  ents.splice(i, 1);
  rings.setMatrixAt(e.idx, ZERO);
  P.r = Math.sqrt(P.r * P.r + GROW * e.m * e.r * e.r * (feverT > 0 ? 1.3 : 1) * (1 + .12 * (upg.grow || 0)) * M.gr * (EV.grow || 1) * (1 + G.grow / 100));
  eatenCount++; gainXp(e.co ? e.tier * 2 + 1 : .5);
  if (e.co && (e.tier === 4 || (e.tier === 3 && Math.random() < .25) || (e.uni && Math.random() < .4))) dropLoot(P.x + (Math.random() - .5) * P.r * 3, P.y - P.r * 2.6, e.tier === 4 ? 2 : 0, e.tier === 4 ? 1 : 0);
  if (e.uni) { uniEaten++; for (let i = 0; i < 5 && toks.length < MAXT; i++) { const a = i / 5 * 6.283; toks.push({ x: e.x + Math.cos(a) * e.r * 1.4, y: e.y + Math.sin(a) * e.r * 1.4, t: 0 }); } wave(e.x, e.y, e.r, e.r * 6, '#FFD23F', .7); pop(e.x, e.r * 3.2, e.y, '🦄 유니콘 인수! 성장 1.6배', 'big'); [784, 1046, 1318, 1568].forEach((f, i) => setTimeout(() => blip(f, .12, 'sine', .08), i * 55)); }
  if (mission && mission.e === e) missionEnd(true);
  // 공에 붙이기
  if (e.palm !== undefined) { palmT.setMatrixAt(e.palm, ZERO); palmF.setMatrixAt(e.palm, ZERO); palmT.instanceMatrix.needsUpdate = palmF.instanceMatrix.needsUpdate = true;
    e.obj = buildPalm(); e.obj.position.set(e.x, 0, e.y); e.obj.scale.setScalar(e.r); e.obj.rotation.y = e.ry; entRoot.add(e.obj); }
  e.obj.visible = true; e.obj.rotation.z = 0; e.obj.position.y = 0;
  stickTo(e.obj, e.r, e.palm !== undefined);

  comboN++; comboT = 1.3; if (comboN > maxCombo) maxCombo = comboN;
  if (comboN >= feverNext && feverT <= 0) startFever();
  if (comboN >= 5) { const c = $('combo'); $('combon').textContent = '×' + comboN; c.classList.add('on'); c.style.transform = 'scale(' + Math.min(1.5, 1 + comboN * .012) + ')'; }
  if (e.co && e.tier >= unlocked - 1) pop(e.x, e.r * 2.2, e.y, QUIP[e.name] && Math.random() < .75 ? e.name + ' — ' + QUIP[e.name] : e.name + ' ' + VERBS[(Math.random() * VERBS.length) | 0], e.tier >= 3 ? 'big' : '');
  if (e.co && e.tier >= 2) notable.push(e);
  if (e.co && e.tier === 4) { bigEaten.push(e.name); const q = T4.find(c => c[0] === e.name); banner('MISSION PASSED', e.name + ' 인수 (' + bigEaten.length + '/' + bigTotal + ') · ' + (q ? q[3] : ''), 'gta'); buzz([20, 30, 40]); shake = .3; slowT = .16; wave(e.x, e.y, e.r, e.r * 7, e.color, .8); }
  burst(e);
  blip((330 + e.tier * 90) * Math.pow(1.035, Math.min(comboN, 24)) + Math.random() * 20, 0.09 + e.tier * 0.03, 'triangle', 0.07);
}

/* ================= 결과 · 공유 ================= */
let result = null, cardBlob = null;
const best = (() => { try { return JSON.parse(localStorage.getItem('claudehon_best') || 'null'); } catch (e) { return null; } })();
let bestRec = best;
const scoreOf = r => r ? (r.win ? 1e6 + (GAME_TIME - r.sec) : Math.log10(r.worth) * 100) : -1;
const recText = r => r.win ? r.sec + '초 만에 전부 인수' : '기업가치 ' + fmtMoney(r.worth);
function parseRival() {
  const c = qs.get('c'); if (!c) return null;
  const m = /^([01])\.(\d{1,5})$/.exec(c); if (!m) return null;
  return m[1] === '1' ? { win: true, sec: Math.min(GAME_TIME, +m[2]) } : { win: false, worth: Math.pow(10, Math.min(1500, +m[2]) / 100) };
}
const rival = parseRival();
const baseUrl = () => location.origin + location.pathname;
function shareUrl() { const r = result; return baseUrl() + '?c=' + (r.win ? '1.' + r.sec : '0.' + Math.round(Math.log10(r.worth) * 100)); }
const headline = r => r.win ? `[속보] Claude, ${r.sec}초 만에 빅테크 ${r.bigTotal}곳 전부 인수` : r.names.length ? `[속보] Claude, ${r.names[0]} 등 ${r.count}곳 인수… 해가 져서 중단` : `[속보] Claude, 잡무 ${r.count}건 처리하다 해가 짐`;
function shareText() {
  const r = result, row = ['🚀', '☁️', '🏢', '🏙️', '🌍'].map((e, i) => (i < 4 ? r.unlocked > i : r.win) ? e : '▫️').join('');
  const names = r.names.slice(0, 3).join(', ');
  return r.win
    ? `${headline(r)}\n\n클로드혼 #${DAY} 🟠 ${names} 포함 ${r.count}곳을 굴려 먹음.\n기업가치 ${fmtMoney(r.worth)} · Lv ${r.lvl} · 단속반 ${r.kills}대 격파 · 라이벌 AI ${r.ai}/${AIS.length}\n${row}\n\n너는 몇 초 걸려?`
    : `${headline(r)}\n\n클로드혼 #${DAY} 🟠 기업가치 ${fmtMoney(r.worth)}.\n빅테크 ${r.big}/${r.bigTotal} · 라이벌 AI ${r.ai}/${AIS.length} · ${r.rank}\n${row}\n\n나보다 많이 먹을 수 있어?`;
}
function drawCard() {
  const r = result, c = document.createElement('canvas'); c.width = 1080; c.height = 1350; const x = c.getContext('2d');
  x.fillStyle = '#F0EEE6'; x.fillRect(0, 0, 1080, 1350);
  x.fillStyle = '#E7E2D3'; for (let i = 0; i < 9; i++) for (let j = 0; j < 12; j++) if ((i + j) % 2) x.fillRect(i * 120, j * 120, 120, 120);
  x.fillStyle = '#FAF9F5'; rr(x, 50, 50, 980, 1250, 56); x.fill(); x.strokeStyle = '#DDD9CC'; x.lineWidth = 3; x.stroke();
  x.textAlign = 'left'; x.textBaseline = 'middle';
  x.font = '900 60px ' + FONT; x.fillStyle = '#1F1E1D'; x.fillText('클로드', 100, 130); const tw = x.measureText('클로드').width; x.fillStyle = '#D97757'; x.fillText('혼', 100 + tw, 130);
  x.fillStyle = '#1F1E1D'; rr(x, 760, 98, 220, 64, 32); x.fill(); x.fillStyle = '#fff'; x.font = '800 30px ' + FONT; x.textAlign = 'center'; x.fillText('#' + DAY + ' · ' + r.model, 870, 132);
  // 공 + 붙은 회사들
  const cx = 540, cy = 440, R = 190;
  x.fillStyle = 'rgba(60,40,20,.12)'; x.beginPath(); x.ellipse(cx + 10, cy + R + 26, R * .95, 30, 0, 0, 6.3); x.fill();
  x.fillStyle = '#D97757'; x.beginPath(); x.arc(cx, cy, R, 0, 6.3); x.fill();
  const tiles = r.tiles.slice(-9); const rnd = mulberry(r.count + 5);
  tiles.forEach((t, i) => {
    const a = i / tiles.length * 6.283 - 1.2, d = R * 1.07, s = 60;
    x.save(); x.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d); x.rotate(a + 1.57 + (rnd() - .5) * .16 + (Math.sin(a) > .25 ? Math.PI : 0));
    x.fillStyle = '#fff'; rr(x, -s - 5, -s * .45 - 5, s * 2 + 10, s * .9 + 10, 16); x.fill();
    x.fillStyle = t.color; rr(x, -s, -s * .45, s * 2, s * .9, 12); x.fill();
    const fg = lum(t.color) > .62 ? '#1F1E1D' : '#fff', has = !!LOGOS[t.slug], L = has ? 36 : 0, gap = has ? 8 : 0;
    x.font = '800 100px ' + FONT; const fs = Math.min(s * .5, 100 * (s * 1.76 - L - gap) / x.measureText(t.name).width), tw2 = x.measureText(t.name).width * fs / 100, x0 = -(L + gap + tw2) / 2;
    if (has) drawLogo(x, t.slug, x0, -L / 2, L, fg);
    x.font = '800 ' + fs + 'px ' + FONT; x.fillStyle = fg; x.textAlign = 'left'; x.fillText(t.name, x0 + L + gap, 2); x.restore();
  });
  x.fillStyle = '#D97757'; x.beginPath(); x.arc(cx, cy, R * .5, 0, 6.3); x.fill();
  drawLogo(x, 'claude', cx - R * .4, cy - R * .4, R * .8, '#FAF9F5');
  x.textAlign = 'center';
  x.font = '800 40px ' + FONT; x.fillStyle = '#6B6860'; { const hl = headline(r); x.font = '800 100px ' + FONT; const fs = Math.min(40, 100 * 900 / x.measureText(hl).width); x.font = '800 ' + fs + 'px ' + FONT; x.fillText(hl, 540, 740); }
  x.font = '900 84px ' + FONT; x.fillStyle = '#1F1E1D'; x.fillText(r.rank, 540, 836);
  x.font = '900 150px ' + FONT; x.fillStyle = '#B85C3E'; x.fillText(fmtMoney(r.worth), 540, 990);
  x.font = '700 31px ' + FONT; x.fillStyle = '#6B6860'; x.fillText('Lv ' + r.lvl + '  ·  ' + r.count + '건 인수  ·  단속반 ' + r.kills + '대 격파  ·  라이벌 AI ' + r.ai + '/' + AIS.length, 540, 1078);
  x.font = '700 30px ' + FONT; x.fillStyle = '#1F1E1D'; x.fillText(r.build, 540, 1118);
  if (r.gearTxt) { x.font = '700 100px ' + FONT; const fs = Math.min(26, 100 * 880 / x.measureText('🎒 ' + r.gearTxt).width); x.font = '700 ' + fs + 'px ' + FONT; x.fillStyle = '#B85C3E'; x.fillText('🎒 ' + r.gearTxt, 540, 1154); }
  // 티어 진행
  const labs = ['스타트업', 'SaaS', '엔터프라이즈', '빅테크', '전부'];
  labs.forEach((l, i) => { const on = i < 4 ? r.unlocked > i : r.win, bx = 100 + i * 180; x.fillStyle = on ? '#D97757' : '#E7E2D3'; rr(x, bx, 1178, 164, 50, 25); x.fill(); x.fillStyle = on ? '#fff' : '#A8A397'; x.font = '800 25px ' + FONT; x.fillText(l, bx + 82, 1204); });
  x.font = '700 30px ' + FONT; x.fillStyle = '#9A968B'; x.fillText('너도 굴려봐 → ' + (location.host || 'claudehon') + location.pathname.replace(/index\.html$/, '').replace(/\/$/, ''), 540, 1266);
  return c;
}
function end(win) {
  state = 'over'; up(); musicStop(); finT = 0; boostT = magT = dashT = feverT = 0; mission = null; mark.visible = false; $('levelup').style.display = 'none'; $('dash').style.display = 'none'; $('gear').style.display = 'none'; $('ui').classList.remove('fever'); $('mission').style.display = 'none';
  if (!win) cv.style.filter = 'grayscale(.75) brightness(.8)';
  const r = P.r;
  const rank = win ? '특이점 도달' : r < 40 ? '시드 단계 챗봇' : r < 90 ? '시리즈 A 유망주' : r < 170 ? 'SaaS 포식자' : r < 300 ? '빅테크의 악몽' : '거의 다 먹은 자';
  notable.sort((a, b) => b.r - a.r);
  result = { win, sec: Math.max(1, Math.round(GAME_TIME - timeLeft)), worth: worth(), count: eatenCount, big: bigEaten.length, bigTotal, rank, unlocked, combo: maxCombo, ai: aiEaten.length, lvl, kills, boss: bossKills, uni: uniEaten, evo: (upg.evoOrbit || 0) + (upg.evoPulse || 0) + (upg.evoBolt || 0), dashes, model: M.n, rifts: riftsDone, uniq: SLOTK.filter(k => gear[k] && gear[k].rar === 3).length, set: G.set, gearTxt: SLOTK.filter(k => gear[k]).map(k => gear[k].n).join(' · '), build: UPG.filter(u => upg[u.id]).map(u => u.ic + (u.evo ? '' : upg[u.id])).join(' '),
    names: notable.slice(0, 6).map(e => e.name), tiles: notable.slice(0, 16).reverse().map(e => ({ name: e.name, color: e.color, tier: e.tier, slug: e.slug })) };
  const isBest = scoreOf(result) > scoreOf(bestRec);
  { const fresh = ACH.filter(a => !achGot[a.id] && a.t(result)); for (const a of fresh) achGot[a.id] = 1; try { localStorage.setItem('claudehon_ach', JSON.stringify(achGot)); } catch (e) {}
    const got = ACH.filter(a => achGot[a.id]).length; $('ach').innerHTML = '🏅 업적 ' + got + '/' + ACH.length + (fresh.length ? ' · <b>새로 달성: ' + fresh.map(a => a.n).join(', ') + '</b>' : ''); }
  submitScore(result);
  runs.push({ win, sec: result.sec, worth: result.worth, model: M.n, lvl, day: DAY }); runs.sort((a, b) => scoreOf(b) - scoreOf(a)); runs = runs.slice(0, 10); try { localStorage.setItem('claudehon_runs', JSON.stringify(runs)); } catch (e) {} renderRank();
  if (isBest) { bestCurve = curve.slice(); try { localStorage.setItem('claudehon_curve', JSON.stringify(bestCurve)); } catch (e) {} }
  if (isBest) { bestRec = { win, sec: result.sec, worth: result.worth }; try { localStorage.setItem('claudehon_best', JSON.stringify(bestRec)); } catch (e) {} }
  if (win) [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.3, 'sine', 0.1), i * 130)); else blip(180, .5, 'sawtooth', .05);
  banner(win ? 'MISSION PASSED!' : 'WASTED', win ? '전 산업 인수 완료' + (isBest ? ' · 최고 기록' : '') : '해가 졌습니다', win ? 'gta' : 'wasted');
  const card = drawCard(); cardBlob = null;
  $('cardimg').src = card.toDataURL('image/png');
  card.toBlob(b => { cardBlob = b; }, 'image/png');
  setTimeout(() => { $('hud').style.display = 'none'; $('radar').style.display = 'none'; $('combo').classList.remove('on'); $('over').style.display = 'flex'; if (rival && scoreOf(result) > scoreOf(rival)) toast('친구 기록을 이겼어요 🎉'); }, win ? 3200 : 1500);
}
const cardFile = () => cardBlob ? new File([cardBlob], 'claudehon-' + DAY + '.png', { type: 'image/png' }) : null;
async function copyText(t) { try { await navigator.clipboard.writeText(t); return true; } catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} a.remove(); return ok; } }
function saveImage() { if (!cardBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(cardBlob); a.download = 'claudehon-' + DAY + '.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
$('share').addEventListener('click', async () => {
  const text = shareText(), url = shareUrl(), f = cardFile();
  try {
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: text + '\n' + url }); return; }
    if (navigator.share) { await navigator.share({ text, url }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  toast(await copyText(text + '\n' + url) ? '문구를 복사했어요. 붙여넣기만 하면 돼요' : '복사하지 못했어요');
});
$('sx').addEventListener('click', () => window.open('https://x.com/intent/post?text=' + encodeURIComponent(shareText()) + '&url=' + encodeURIComponent(shareUrl()), '_blank', 'noopener'));
$('sth').addEventListener('click', () => window.open('https://www.threads.net/intent/post?text=' + encodeURIComponent(shareText() + '\n' + shareUrl()), '_blank', 'noopener'));
$('scopy').addEventListener('click', async () => toast(await copyText(shareText() + '\n' + shareUrl()) ? '복사했어요' : '복사하지 못했어요'));
$('ssave').addEventListener('click', saveImage);



/* ================= 공용 랭킹 (Cloudflare Worker) ================= */
const RANK_API = qs.get('api') || 'https://claude-hon-rank.skang1310-336.workers.dev';
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let nick = ''; try { nick = localStorage.getItem('claudehon_nick') || ''; } catch (e) {}
$('nick').value = nick;
$('nick').addEventListener('input', () => { nick = $('nick').value.trim().slice(0, 12); try { localStorage.setItem('claudehon_nick', nick); } catch (e) {} });
function renderTop(el, top, myRank) {
  if (!top || !top.length) { el.innerHTML = '<b>🌍 오늘의 랭킹</b><div><span>아직 기록이 없어요. 첫 번째가 되어 보세요</span></div>'; return; }
  const me = nick || '익명';
  el.innerHTML = '<b>🌍 오늘의 랭킹' + (myRank ? ' · 내 순위 ' + myRank + '위' : '') + '</b>' + top.slice(0, 10).map((r, i) => `<div${r.n === me ? ' class="me"' : ''}><span>${i + 1}. ${esc(r.n)}</span><span>${r.w ? r.s + '초 클리어' : fmtMoney(r.v)} · ${esc(r.m)}</span></div>`).join('');
}
async function loadTop() { try { const r = await fetch(RANK_API + '/top?day=' + DAY, { signal: AbortSignal.timeout(5000) }); const j = await r.json(); renderTop($('grank'), j.top); } catch (e) { $('grank').innerHTML = ''; } }
async function submitScore(res) {
  if (qs.get('seed')) { $('grank2').innerHTML = ''; return; }
  $('grank2').innerHTML = '<b>🌍 오늘의 랭킹</b><div><span>기록 올리는 중…</span></div>';
  try {
    const r = await fetch(RANK_API + '/score', { method: 'POST', headers: { 'content-type': 'application/json' }, signal: AbortSignal.timeout(6000),
      body: JSON.stringify({ day: DAY, name: nick || '익명', model: res.model, win: res.win, sec: res.sec, worth: res.worth, lvl: res.lvl }) });
    const j = await r.json(); if (j.error) throw new Error(j.error); renderTop($('grank2'), j.top, j.rank); renderTop($('grank'), j.top);
  } catch (e) { $('grank2').innerHTML = ''; }
}

/* ================= 프레임 ================= */
function hud() {
  $('worth').textContent = fmtMoney(worth());
  const t = Math.ceil(timeLeft); $('time').textContent = ((t / 60) | 0) + ':' + String(t % 60).padStart(2, '0');
  $('time').classList.toggle('low', t <= 15 && t > 0);
  { let pace = ''; const bi = Math.floor(playT / 5); if (bestCurve && bestCurve[bi]) { const df = Math.round((P.r / bestCurve[bi] - 1) * 100); pace = (df >= 0 ? '▲' : '▼') + Math.abs(df) + '% · '; } $('eaten').textContent = pace + eatenCount + '건 인수'; $('eaten').style.color = pace ? (pace[0] === '▲' ? '#7CFF9B' : '#FF9A8F') : ''; }
  if (unlocked < 4) {
    const need = TIERS[unlocked + 1].rmin / EAT, prev = unlocked === 0 ? R0 : TIERS[unlocked].rmin / EAT;
    $('nextname').textContent = '다음 해금: ' + TIERS[unlocked + 1].name;
    $('barfill').style.width = Math.max(0, Math.min(100, (P.r - prev) / (need - prev) * 100)) + '%';
  } else { $('nextname').textContent = '빅테크 ' + bigEaten.length + '/' + bigTotal + ' 인수'; $('barfill').style.width = (bigEaten.length / bigTotal * 100) + '%'; }
  $('buffs').innerHTML = (boostT > 0 ? '<span style="background:#FFD23F;color:#222">⚡ ' + Math.ceil(boostT) + '</span>' : '') + (magT > 0 ? '<span style="background:#C29BFF;color:#222">🧲 ' + Math.ceil(magT) + '</span>' : '') + (feverT > 0 ? '<span style="background:#FF5A1F;color:#fff">🔥 ' + Math.ceil(feverT) + '</span>' : '');
  $('dash').style.setProperty('--cd', (1 - Math.max(0, dashCd) / dashMax()) * 360 + 'deg'); $('dash').classList.toggle('ready', dashCd <= 0);
  $('ui').classList.toggle('fever', feverT > 0);
  $('lv').textContent = 'Lv ' + lvl; $('xpfill').style.width = Math.min(100, xp / need() * 100) + '%'; { const st = Math.min(5, unlocked + 1); $('stars').textContent = '★'.repeat(st) + '☆'.repeat(5 - st); }
  $('mission').textContent = rift ? (rift.clear ? '⚔️ 균열 정복 · 전리품을 주우세요' : '⚔️ 균열 ' + rift.wave + '/3 · ' + Math.ceil(rift.t) + '초 · 남은 적 ' + cops.length) : mission ? '🎯 긴급 인수: ' + mission.e.name + ' · ' + Math.ceil(mission.t) + '초' : ''; $('mission').style.display = mission || rift ? 'inline-block' : 'none';
  radar();
}
/* 미니맵 */
const rc = $('radar').getContext('2d');
function radar() {
  const S = 220, c = rc, R = 100, range = Math.max(380, camR * 26), k = R / range;
  c.clearRect(0, 0, S, S); c.save(); c.translate(S / 2, S / 2);
  c.beginPath(); c.arc(0, 0, R, 0, 6.3); c.fillStyle = 'rgba(16,18,22,.62)'; c.fill(); c.clip();
  c.strokeStyle = 'rgba(255,255,255,.28)';
  for (const { R: RR, w } of ROADS) { c.lineWidth = Math.max(1.5, w * k); c.beginPath(); c.arc(-P.x * k, -P.y * k, RR * k, 0, 6.3); c.stroke(); }
  for (let s = 0; s < SPOKES; s++) { const a = SPOKE0 + s * 6.283 / SPOKES; c.lineWidth = Math.max(1.5, spokeW(1500) * k); c.beginPath(); c.moveTo((Math.cos(a) * ROADS[0].R - P.x) * k, (Math.sin(a) * ROADS[0].R - P.y) * k); c.lineTo((Math.cos(a) * WORLD_R - P.x) * k, (Math.sin(a) * WORLD_R - P.y) * k); c.stroke(); }
  for (const e of ents) {
    if (!e.co && e.tier < unlocked) continue;
    let dx = (e.x - P.x) * k, dy = (e.y - P.y) * k; const d = Math.hypot(dx, dy), big = e.tier === 4;
    if (d > R - 5) { if (!big) continue; dx *= (R - 7) / d; dy *= (R - 7) / d; }
    const s = big ? 6 : Math.max(1.6, Math.min(5, e.r * k));
    c.fillStyle = e.uni ? '#FFD23F' : !e.co ? 'rgba(255,255,255,.35)' : e.ed ? '#FF8A5C' : big ? '#FFFFFF' : 'rgba(255,255,255,.6)';
    c.beginPath(); c.arc(dx, dy, s, 0, 6.3); c.fill();
    if (big) { c.strokeStyle = e.ed ? '#FF8A5C' : e.color; c.lineWidth = 2.5; c.stroke(); }
  }
  if (mission) { let dx = (mission.e.x - P.x) * k, dy = (mission.e.y - P.y) * k; const d = Math.hypot(dx, dy); if (d > R - 9) { dx *= (R - 9) / d; dy *= (R - 9) / d; } c.strokeStyle = '#FF4B3A'; c.lineWidth = 4; c.beginPath(); c.arc(dx, dy, 9 + 3 * Math.sin(performance.now() / 120), 0, 6.3); c.stroke(); }
  for (const p of portals) { const dx = (p.x - P.x) * k, dy = (p.y - P.y) * k; if (Math.hypot(dx, dy) > R - 6) continue; c.strokeStyle = '#C08BFF'; c.lineWidth = 3; c.beginPath(); c.arc(dx, dy, 6, 0, 6.3); c.stroke(); }
  for (const l of loots) { const dx = (l.x - P.x) * k, dy = (l.y - P.y) * k; if (Math.hypot(dx, dy) > R - 4) continue; c.fillStyle = RAR[l.it.rar][1]; c.fillRect(dx - 3, dy - 3, 6, 6); }
  if (gob) { let dx = (gob.x - P.x) * k, dy = (gob.y - P.y) * k; const d = Math.hypot(dx, dy); if (d > R - 8) { dx *= (R - 8) / d; dy *= (R - 8) / d; } c.fillStyle = '#FFD23F'; c.beginPath(); c.arc(dx, dy, 6, 0, 6.3); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke(); }
  c.fillStyle = '#FF5A4D'; for (const q of cops) { const dx = (q.x - P.x) * k, dy = (q.y - P.y) * k; if (dx * dx + dy * dy > (R - 3) * (R - 3)) continue; c.fillRect(dx - 2, dy - 2, 4, 4); }
  for (const p of pups) { const dx = (p.x - P.x) * k, dy = (p.y - P.y) * k; if (Math.hypot(dx, dy) > R - 4) continue; c.fillStyle = p.T.col; c.beginPath(); c.moveTo(dx, dy - 5); c.lineTo(dx + 4, dy); c.lineTo(dx, dy + 5); c.lineTo(dx - 4, dy); c.fill(); }
  for (const b of bots) { let dx = (b.x - P.x) * k, dy = (b.y - P.y) * k; const d = Math.hypot(dx, dy); if (d > R - 8) { dx *= (R - 8) / d; dy *= (R - 8) / d; }
    const danger = P.r <= b.r * EAT; c.fillStyle = b.color; c.strokeStyle = danger ? '#FF3B30' : '#fff'; c.lineWidth = danger ? 4 : 2.5; c.beginPath(); c.arc(dx, dy, Math.max(6, b.r * k), 0, 6.3); c.fill(); c.stroke(); }
  c.fillStyle = '#FF7A45'; c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, Math.max(5, P.r * k), 0, 6.3); c.fill(); c.stroke();
  c.restore(); c.beginPath(); c.arc(S / 2, S / 2, R, 0, 6.3); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 4; c.stroke();
}

const TAN = Math.tan(FOV * Math.PI / 360), cA = new THREE.Vector3(), cB = new THREE.Vector3(), lA = new THREE.Vector3(), lB = new THREE.Vector3();
let lodT = 0, menuA = 0;
function render(dt, now) {
  camR += (P.r - camR) * (1 - Math.exp(-dt * 2.2));
  const f = 1 - Math.exp(-dt * 8); camX += (P.x - camX) * f; camZ += (P.y - camZ) * f;
  ballPivot.position.set(P.x, P.r, P.y); ballPivot.scale.setScalar(P.r);
  const menu = state === 'menu', ik = menu ? 0 : state === 'intro' ? 1 - Math.pow(Math.max(0, introT) / INTRO, 2.4) : 1, vr = 34 + (camR - 34) * ik;
  applyTod(menu ? .66 : state === 'intro' ? 0 : 1 - timeLeft / GAME_TIME, dt);
  const dist = vr / (0.085 * 2 * TAN * Math.min(camera.aspect, 1));
  const V = 70 * vr + 1700;                       // 가시 거리
  const sh = shake > 0 ? shake * vr * 1.4 : 0, sx = (Math.random() - .5) * sh, sy = (Math.random() - .5) * sh * .6;
  menuA += dt * .06 * (1 - ik);
  cA.set(Math.sin(menuA) * 760, 150, Math.cos(menuA) * 760); lA.set(0, 95, 0);
  const gd = camR / (0.085 * 2 * TAN * Math.min(camera.aspect, 1));
  if (state === 'over' && result && result.win) {
    finT += dt; const fk = Math.min(1, finT / 2.4), fe = 1 - Math.pow(1 - fk, 3), fa = finT * .5;
    ballPivot.position.y = P.r * (1 + fe * 2.6); q4.setFromAxisAngle(v3.set(0, 1, 0), dt * 3); ball.quaternion.premultiply(q4);
    cB.set(camX + Math.sin(fa) * gd * (.91 + fe * .3), gd * (.41 + fe * .1), camZ + Math.cos(fa) * gd * (.91 + fe * .3)); lB.set(camX, P.r * (1 + fe * 2.6), camZ);
    if (Math.random() < .7) { const q = pdata[pcur], a = Math.random() * 6.283, sp2 = P.r * (2 + Math.random() * 5); q.life = 1.1; q.x = P.x; q.z = P.y; q.y = ballPivot.position.y; q.vx = Math.cos(a) * sp2; q.vz = Math.sin(a) * sp2; q.vy = P.r * (4 + Math.random() * 7); q.s = P.r * (.08 + Math.random() * .1); parts.setColorAt(pcur, tmpC.setHSL(Math.random(), .9, .6)); parts.instanceColor.needsUpdate = true; pcur = (pcur + 1) % PN; }
    if (finT - dt < .05 && finT >= .05 || finT - dt < .7 && finT >= .7 || finT - dt < 1.4 && finT >= 1.4) wave(P.x, P.y, P.r, P.r * 16, null, 1.1);
  } else { cB.set(camX + sx, gd * .41 + sy, camZ + gd * .91); lB.set(camX + sx, camR * .8, camZ - camR * 9); }
  camera.position.lerpVectors(cA, cB, ik); lA.lerp(lB, ik); camera.lookAt(lA);
  fovCur += (FOV + Math.min(1.2, spNorm) * 3 + (boostT > 0 || dashT > 0 ? 9 : 0) - fovCur) * (1 - Math.exp(-dt * 4)); camera.fov = menu ? FOV : fovCur;
  ballLamp.position.set(P.x, P.r * 2.6, P.y + P.r * 1.5); ballLamp.distance = camR * 22;
  waterN.offset.x += dt * .012; waterN.offset.y += dt * .007;
  for (let i = tweens.length - 1; i >= 0; i--) { const w = tweens[i]; w.t = Math.min(1, w.t + dt / .22); const e2 = 1 - Math.pow(1 - w.t, 3); w.o.position.lerpVectors(w.p0, w.p1, e2); w.o.quaternion.slerpQuaternions(w.q0, w.q1, e2); w.o.scale.setScalar(w.s0 + (w.s1 - w.s0) * e2); if (w.t >= 1) tweens.splice(i, 1); }
  for (const w of waves) { if (w.t >= 1) continue; w.t = Math.min(1, w.t + dt / w.d); const e2 = 1 - Math.pow(1 - w.t, 2); w.m.scale.setScalar(w.r0 + (w.r1 - w.r0) * e2); w.m.material.opacity = (1 - w.t) * .6; if (w.t >= 1) w.m.visible = false; }
  camera.near = Math.max(.5, dist * .05); camera.far = V * 2.2; camera.updateProjectionMatrix();
  scene.fog.density = 0.55 / V;
  dome.position.copy(camera.position); dome.scale.setScalar(camera.far * .9);
  clouds.position.copy(camera.position); clouds.scale.setScalar(camera.far * .8);
  // 그림자: 공 주변을 따라다니는 태양
  const S = vr * (24 + 6 * ik), tx = camX * ik, tz = (camZ - vr * 8) * ik;
  sun.target.position.set(tx, 0, tz); sun.position.set(tx + LDIR.x * S * 3, LDIR.y * S * 3, tz + LDIR.z * S * 3);
  const sc = sun.shadow.camera; sc.left = -S; sc.right = S; sc.top = S; sc.bottom = -S; sc.near = S * .2; sc.far = S * 7; sc.updateProjectionMatrix();
  sun.shadow.normalBias = S / sun.shadow.mapSize.x * 3;
  // 멀리 있는 작은 물체는 그리지 않음
  lodT -= dt;
  if (lodT <= 0) { lodT = .2; const cx = camera.position.x, cz = camera.position.z; for (const e of ents) if (e.obj) { const lim = e.r * 130; e.obj.visible = e.tier >= 3 || (e.x - cx) ** 2 + (e.y - cz) ** 2 < lim * lim; } }
  // 파티클
  let any = false;
  for (let i = 0; i < PN; i++) {
    const p = pdata[i]; if (p.life <= 0) continue; any = true;
    p.life -= dt; p.vy -= 22 * camR * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; if (p.y < 0) { p.y = 0; p.vy *= -.4; }
    const s = p.life > 0 ? p.s * Math.min(1, p.life * 4) : 0;
    m4.makeRotationY(p.life * 9).scale(s3.set(s, s, s)).setPosition(p.x, p.y + s / 2, p.z); parts.setMatrixAt(i, m4);
  }
  if (any) parts.instanceMatrix.needsUpdate = true;
  ringMat.opacity = .6 + .35 * Math.sin(now / 200);
  xray.visible = !menu;
  if (quality === 2) composer.render(); else renderer.render(scene, camera);
}
let last = 0, hudT = 0, perfN = 0, perfSum = 0;
function frame(now) {
  const raw = (now - last) / 1000 || 0; let dt = Math.min(0.05, raw); last = now;
  if (slowT > 0) { slowT -= dt; dt *= .12; }
  if (state === 'intro') { introT -= dt; if (introT <= 0) { state = 'play'; banner('굴려라!'); $('hint').style.display = 'block'; } }
  if (state === 'play') {
    update(dt); hudT += dt; if (hudT > 0.12 && state === 'play') { hudT = 0; hud(); }
    // 느린 기기에서는 화질을 한 단계씩 낮춤
    if (raw < .2) { perfSum += raw; perfN++; }
    if (perfN >= 90) { const avg = perfSum / perfN; perfN = 0; perfSum = 0; if (avg > 1 / 34 && quality > 0 && !qs.get('q')) setQuality(quality - 1); }
  }
  else if (state === 'menu') { q4.setFromAxisAngle(v3.set(0, 1, 0), dt * .5); ball.quaternion.premultiply(q4); }
  else if (state === 'over') { P.vx *= .92; P.vy *= .92; }
  render(dt, now);
  requestAnimationFrame(frame);
}

function start() {
  audioInit(); build(); state = 'intro'; introT = INTRO; cv.style.filter = ''; up(); popLayer.innerHTML = ''; perfN = 0; perfSum = 0; musicStart();
  $('start').style.display = 'none'; $('over').style.display = 'none'; $('hud').style.display = 'block'; $('radar').style.display = 'block'; $('dash').style.display = 'block'; $('gear').style.display = 'flex'; hud();
  banner('오늘의 맵 #' + DAY, EV.cop || EV.xp || EV.grow || EV.uni ? '오늘의 이벤트: ' + EV.n + ' · ' + EV.d : '해 지기 전에 전부 인수하세요');
}
$('go').addEventListener('click', start); $('again').addEventListener('click', start);

/* 시작 화면 */
$('daytag').textContent = '오늘의 맵 #' + DAY; $('event').innerHTML = '📅 오늘의 이벤트 <b>' + EV.n + '</b> · ' + EV.d; setModel(modelId); renderRank(); loadTop();
{ const got = ACH.filter(a => achGot[a.id]).length; $('achline').textContent = '🏅 업적 ' + got + '/' + ACH.length; $('achline').title = ACH.map(a => (achGot[a.id] ? '✅ ' : '⬜ ') + a.n + ' — ' + a.d).join('\n'); }
if (rival) { const el = $('rival'); el.style.display = 'block'; el.textContent = '🔥 친구 기록: ' + recText(rival) + ' — 이길 수 있어요?'; $('go').textContent = '도전하기'; }
if (bestRec) $('bestline').textContent = '내 최고 기록 · ' + recText(bestRec);
for (let i = 0; i < PN; i++) parts.setMatrixAt(i, ZERO);
if (qs.get('q')) setQuality(+qs.get('q'));
build();
applyTod(.66, 10);
renderer.compile(scene, camera);
$('loading').style.display = 'none';
// 디버그·자동 테스트용
if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__game = { get P() { return P; }, get ents() { return ents; }, get state() { return state; }, input, set time(v) { timeLeft = v; }, get info() { return renderer.info.render; }, get quality() { return quality; }, get bots() { return bots; }, get cam() { return { p: camera.position.toArray().map(Math.round), d: camera.getWorldDirection(new THREE.Vector3()).toArray().map(v => +v.toFixed(2)), fov: camera.fov, intro: introT, camR }; }, frame(dt) { if (state === 'intro') { introT -= dt; if (introT <= 0) state = 'play'; } render(dt, performance.now()); }, get left() { return timeLeft; }, dash, get fever() { return feverT; }, get missions() { return missionsDone; }, get ai() { return aiEaten.length; }, pick, setModel, dropLoot, get gear() { return gear; }, get rift() { return rift; }, get portals() { return portals; }, get res() { return result; }, spawnBoss, get lvl() { return lvl; }, get kills() { return kills; }, get upg() { return upg; }, sim(dt) { if (state === 'levelup') pick((Math.random() * 3) | 0); if (state === 'intro') { introT = 0; state = 'play'; } if (state === 'play') update(dt); }, get tod() { return todCur; },
  shot(w, h) { const pw = W, ph = H; renderer.setPixelRatio(1); renderer.setSize(w, h, false); composer.setPixelRatio(1); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); render(0, performance.now()); const u = cv.toDataURL('image/png'); resize(); return u; } };
requestAnimationFrame(frame);
