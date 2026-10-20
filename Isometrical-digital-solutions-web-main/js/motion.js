// =========================================================
//   Movimiento: el título y lo que sigue al cursor
//   Todo se apaga si el sistema pide movimiento reducido (calm) o no hay mouse
// =========================================================

// ---------- Título ----------
// ISOMETRICAL DIGITAL SOLUTIONS letra por letra: entra en cascada (primero el nombre, luego el resto)
// y cada letra se levanta y brilla cerca del cursor
const letters = [];
document.querySelectorAll('.brand-name, .brand-sub').forEach((part) => {
  const spans = [...part.textContent].map((char) => {
    // El espacio va como no separable: un bloque con un espacio normal quedaría sin ancho
    const span = el('span', 'ch', char === ' ' ? ' ' : char);
    span.style.setProperty('--n', letters.length);
    letters.push(span);
    return span;
  });
  part.replaceChildren(...spans);
});
document.querySelector('.brand').classList.add('intro');

function liftLetters(x) {
  letters.forEach((span) => {
    const r = span.getBoundingClientRect();
    const near = Math.max(0, 1 - Math.abs(x - (r.left + r.width / 2)) / 110);
    span.style.setProperty('--lift', near.toFixed(2));
  });
}

const header = document.querySelector('.top');
header.addEventListener('pointermove', (e) => {
  if (!calm.matches && mouse.matches) liftLetters(e.clientX);
});
header.addEventListener('pointerleave', () => letters.forEach((span) => span.style.setProperty('--lift', '0')));

// ---------- Íconos y botones ----------
// Se corren unos píxeles hacia el cursor (css: --mx / --my)
let magnetEl = null;

function release(node) {
  node.style.setProperty('--mx', '0px');
  node.style.setProperty('--my', '0px');
}

function magnet(e) {
  const target = e.target.closest?.('.cat, .cta') || null;
  if (magnetEl && magnetEl !== target) release(magnetEl);
  magnetEl = target;
  if (!target) return;
  const r = target.getBoundingClientRect();
  const isCta = target.classList.contains('cta');
  const pull = isCta ? 0.12 : 0.18;
  const max = isCta ? 5 : 7;
  const clamp = (v) => Math.max(-max, Math.min(max, v));
  target.style.setProperty('--mx', clamp((e.clientX - (r.left + r.width / 2)) * pull).toFixed(1) + 'px');
  target.style.setProperty('--my', clamp((e.clientY - (r.top + r.height / 2)) * pull).toFixed(1) + 'px');
}

// ---------- Ondas ----------
// Se corren apenas hacia el lado contrario del cursor, con retraso suave
let waveX = 0;
let waveTarget = 0;
let waveFrame = 0;

function waveStep() {
  waveX += (waveTarget - waveX) * 0.06;
  waves.style.setProperty('--wx', waveX.toFixed(2) + 'px');
  waveFrame = Math.abs(waveTarget - waveX) > 0.05 ? requestAnimationFrame(waveStep) : 0;
}

document.addEventListener('pointermove', (e) => {
  if (calm.matches || !mouse.matches) return;
  magnet(e);
  waveTarget = (0.5 - e.clientX / innerWidth) * 28;
  if (!waveFrame) waveFrame = requestAnimationFrame(waveStep);
});

document.documentElement.addEventListener('pointerleave', () => {
  if (magnetEl) release(magnetEl);
  magnetEl = null;
});
