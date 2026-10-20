// =========================================================
//   La aplicación: estado, navegación, teclado y arranque
//   Se carga al final; usa lo definido en dom, render, plans, contact, team y motion
// =========================================================

// ---------- Estado ----------
let cat = catFromHash();
let item = 0;
let itemBtns = [];

// ---------- Acciones ----------
function selectCat(i, start) {
  if (i === -1) return;
  if (i === cat) {
    if (start !== undefined) selectItem(start);
    return;
  }
  cat = i;
  item = start ?? 0;
  if (CATS[cat].slug === 'equipo') loadTeam();
  syncHash();
  renderCats();
  showSection();
}

// Pinta la sección actual según su vista (content.js → view): tarjetas, panel de contacto o lista y detalle
function showSection() {
  const view = currentView();
  stage.classList.toggle('show-custom', view !== 'list');
  list.hidden = view !== 'list';
  detail.hidden = view !== 'list';
  plansBox.hidden = view !== 'plans';
  contactBox.hidden = view !== 'contact';

  if (view === 'plans') {
    renderPlans();
    replay(plansBox);
    // "Ver precio" desde Servicios: en celular la tarjeta elegida debe quedar a la vista
    if (compact.matches && item > 0) planCards[item].scrollIntoView({ block: 'nearest', behavior: calm.matches ? 'auto' : 'smooth' });
  } else if (view === 'contact') {
    renderContact();
    replay(contactBox);
  } else {
    renderList();
    renderDetail();
    placeDetail();
    replay(list);
    replay(detail);
  }
}

function selectItem(i) {
  if (i === item) return;
  item = i;
  const view = currentView();
  if (view === 'plans') {
    markPlan();
    return;
  }
  if (view === 'contact') return; // el panel de contacto muestra todo a la vez
  markItem();
  renderDetail();
  placeDetail();
  replay(detail);
  // Al cerrarse el detalle de arriba la lista se acorta; el ítem tocado no debe salirse de la pantalla
  if (compact.matches) itemBtns[item].scrollIntoView({ block: 'nearest', behavior: calm.matches ? 'auto' : 'smooth' });
}

// ---------- Enlaces por sección (…/#contacto) ----------
function catFromHash() {
  const i = catIndex(location.hash.slice(1).toLowerCase());
  return i === -1 ? 0 : i;
}

// Inicio deja la dirección limpia; replaceState no llena el historial al navegar con flechas
function syncHash() {
  history.replaceState(null, '', cat === 0 ? location.pathname + location.search : '#' + CATS[cat].slug);
}

window.addEventListener('hashchange', () => selectCat(catFromHash()));

// ---------- Clics y tamaño de pantalla ----------
catBtns.forEach((btn, i) => btn.addEventListener('click', () => {
  cancelDwell(btn);
  selectCat(i);
}));

// ---------- Cursor quieto sobre la barra ----------
// Con mouse, dejar el cursor sobre una sección la abre sin hacer clic, como en la consola.
// La espera evita que cruzar la barra de un lado a otro cambie de sección por el camino.
// Mismo tiempo que --dwell en css/base.css: la línea bajo el nombre se llena mientras tanto
const DWELL_MS = 400;
let dwellTimer = 0;

function cancelDwell(btn) {
  clearTimeout(dwellTimer);
  btn.classList.remove('arming');
}

catBtns.forEach((btn, i) => {
  btn.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || i === cat) return;
    btn.classList.add('arming');
    dwellTimer = setTimeout(() => {
      btn.classList.remove('arming');
      selectCat(i);
    }, DWELL_MS);
  });
  btn.addEventListener('pointerleave', () => cancelDwell(btn));
});

// Los perfiles empiezan a cargar apenas el cursor o el foco llegan a Equipo
const teamBtn = catBtns[catIndex('equipo')];
teamBtn.addEventListener('pointerenter', loadTeam);
teamBtn.addEventListener('focus', loadTeam);
compact.addEventListener('change', placeDetail);

// ---------- Teclado ----------
// Flechas izquierda/derecha en la barra; abajo entra a la lista
bar.addEventListener('keydown', (e) => {
  const last = catBtns.length - 1;
  let n = null;
  if (e.key === 'ArrowRight') n = Math.min(cat + 1, last);
  else if (e.key === 'ArrowLeft') n = Math.max(cat - 1, 0);
  else if (e.key === 'Home') n = 0;
  else if (e.key === 'End') n = last;
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (isPlans()) planCards[item]?.querySelector('.plan-cta').focus();
    else if (currentView() === 'contact') contactBox.querySelector('.cta')?.focus();
    else itemBtns[item]?.focus();
    return;
  }
  if (n === null) return;
  e.preventDefault();
  selectCat(n);
  catBtns[n].focus();
});

// Flechas arriba/abajo en la lista; desde el primero vuelve a la barra
list.addEventListener('keydown', (e) => {
  // En celular el botón del detalle también vive en la lista y conserva su comportamiento
  if (!e.target.classList.contains('item')) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const n = Math.min(item + 1, itemBtns.length - 1);
    selectItem(n);
    itemBtns[n].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (item === 0) {
      catBtns[cat].focus();
      return;
    }
    selectItem(item - 1);
    itemBtns[item].focus();
  }
});

// Tarjetas de Planes: derecha/abajo pasa a la siguiente, izquierda/arriba a la anterior;
// arriba desde la primera vuelve a la barra. Al llegar con Tab, la tarjeta también se ilumina
plansBox.addEventListener('keydown', (e) => {
  const card = e.target.closest('.plan');
  if (!card) return;
  const i = planCards.indexOf(card);
  let n = null;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(i + 1, planCards.length - 1);
  else if (e.key === 'ArrowLeft') n = Math.max(i - 1, 0);
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (i === 0) {
      catBtns[cat].focus();
      return;
    }
    n = i - 1;
  }
  if (n === null) return;
  e.preventDefault();
  selectItem(n);
  planCards[n].querySelector('.plan-cta').focus();
});

// Panel de contacto: arriba vuelve a la barra; Tab recorre sus botones
contactBox.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowUp') return;
  e.preventDefault();
  catBtns[cat].focus();
});

plansBox.addEventListener('focusin', (e) => {
  const card = e.target.closest('.plan');
  if (card) selectItem(planCards.indexOf(card));
});

// ---------- Arranque ----------
if (CATS[cat].slug === 'equipo') loadTeam();
renderCats();
showSection();
