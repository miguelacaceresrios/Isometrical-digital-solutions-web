// =========================================================
//   Elementos de la página y utilidades compartidas
//   Orden de carga (index.html): content → dom → render → team → motion → app
// =========================================================

// ---------- Elementos ----------
const bar = document.querySelector('.bar');
const catBtns = Array.from(bar.querySelectorAll('.cat'));
const stage = document.querySelector('.stage');
const list = document.querySelector('.list');
const detail = document.querySelector('.detail');
const dAvatar = document.getElementById('dAvatar');
const dSub = document.getElementById('dSub');
const dTitle = document.getElementById('dTitle');
const dBody = document.getElementById('dBody');
const dFeatures = document.getElementById('dFeatures');
const dPay = document.getElementById('dPay');
const dStatus = document.getElementById('dStatus');
const dPoints = document.getElementById('dPoints');
const dCta = document.getElementById('dCta');
const plansBox = document.getElementById('plans');
const contactBox = document.getElementById('contact');

const waves = document.querySelector('.waves');

// Mismo corte que en css/responsive.css: por debajo, el detalle se abre dentro de la lista
const compact = matchMedia('(max-width: 860px)');
// Quien pide movimiento reducido en su sistema ve la página quieta
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const mouse = matchMedia('(hover: hover) and (pointer: fine)');

// ---------- Utilidades ----------
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Reinicia la animación de entrada en cada cambio
function replay(node) {
  node.classList.remove('enter');
  void node.offsetWidth;
  node.classList.add('enter');
}

function catIndex(slug) {
  return CATS.findIndex((c) => c.slug === slug);
}

function itemIndex(slug, key) {
  const ci = catIndex(slug);
  return ci === -1 ? 0 : Math.max(0, CATS[ci].items.findIndex((it) => it.key === key));
}

// Pesos colombianos sin decimales: $ 1.200.000
// minimumFractionDigits va explícito: Safari viejo falla si solo se da el máximo
const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

// Cada sección elige cómo se ve (content.js → view): 'plans' tarjetas de precios,
// 'contact' panel de contacto; sin view, lista y detalle
function currentView() {
  return CATS[cat].view || 'list';
}

function isPlans() {
  return currentView() === 'plans';
}
