// =========================================================
//   Pintar: barra, lista y detalle (incluye las fotos del equipo)
//   Lee el estado (cat, item, itemBtns) que vive en app.js. Los planes van en plans.js
// =========================================================

function renderCats() {
  catBtns.forEach((btn, i) => {
    btn.classList.toggle('on', i === cat);
    btn.setAttribute('aria-pressed', String(i === cat));
  });
  list.setAttribute('aria-label', CATS[cat].label);
}

function renderList() {
  itemBtns = CATS[cat].items.map((it, i) => {
    const btn = el('button', 'item');
    btn.type = 'button';
    btn.style.setProperty('--i', i); // orden de llegada en la cascada
    fillRow(btn, it);
    btn.addEventListener('click', () => selectItem(i));
    return btn;
  });
  list.replaceChildren(...itemBtns);
  markItem();
}

// Contenido de una fila: punto y textos, o foto y estado si es un integrante del equipo
function fillRow(btn, it) {
  const view = it.github ? friendView(it) : it;
  const text = el('span', 'itx');
  text.append(el('span', 'it-t', view.title), el('span', 'it-s', view.sub));
  btn.classList.toggle('friend', Boolean(it.github));
  btn.replaceChildren(it.github ? avatar(view) : el('span', 'dot'), text);
}

function avatar(view) {
  const box = el('span', 'avatar');
  if (view.avatar) {
    const img = el('img');
    img.alt = '';
    img.loading = 'lazy';
    img.addEventListener('error', () => img.remove()); // usuario inexistente: queda el recuadro gris
    img.src = view.avatar;
    box.append(img);
  }
  box.append(el('i', view.online ? 'presence on' : 'presence'));
  return box;
}

function markItem() {
  itemBtns.forEach((btn, i) => {
    btn.classList.toggle('on', i === item);
    btn.setAttribute('aria-pressed', String(i === item));
  });
}

function renderDetail() {
  const it = CATS[cat].items[item];
  const view = it.github ? friendView(it) : it;
  renderAvatar(view);
  dSub.textContent = it.github ? view.detailSub : view.sub;
  dTitle.textContent = view.title;
  dBody.replaceChildren(...view.body.split('\n\n').map((text) => el('p', '', text)));
  renderService(it);

  dStatus.hidden = !view.status;
  if (view.status) {
    dStatus.textContent = view.status.text;
    dStatus.classList.toggle('on', view.status.online);
  }

  const points = view.points || [];
  dPoints.replaceChildren(...points.map((x) => el('li', '', x)));
  dPoints.hidden = points.length === 0;

  dCta.replaceChildren();
  if (view.cta) dCta.append(renderCta(view.cta));
}

// Ficha del servicio: qué incluye (nombre y para qué sirve) y cómo se paga
function renderService(it) {
  const features = it.features || [];
  detail.classList.toggle('service', features.length > 0);
  dFeatures.hidden = features.length === 0;
  dFeatures.replaceChildren(...features.map((f) => {
    const row = el('li');
    row.append(el('span', 'f-name', f.name), el('span', 'f-desc', f.desc));
    return row;
  }));

  dPay.hidden = !it.pay;
  if (it.pay) dPay.replaceChildren(el('span', 'pay-label', 'Cómo se paga'), el('span', 'pay-value', it.pay));
}

// Foto grande del integrante; en los demás ítems no se muestra
function renderAvatar(view) {
  const show = Boolean(view.avatar);
  detail.classList.toggle('person', show);
  dAvatar.hidden = !show;
  if (!show) return;
  const img = dAvatar.querySelector('img');
  if (img.getAttribute('src') !== view.avatar) {
    img.style.visibility = '';
    img.src = view.avatar;
  }
  dAvatar.querySelector('.presence').className = view.online ? 'presence on' : 'presence';
}

// Si la foto no existe se oculta y queda el recuadro gris
dAvatar.querySelector('img').addEventListener('error', (e) => {
  e.target.style.visibility = 'hidden';
});

function renderCta(cta) {
  if (cta.href) {
    const link = el('a', 'cta', cta.label);
    link.href = cta.href;
    if (cta.href.startsWith('http')) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    return link;
  }
  const btn = el('button', 'cta', cta.label);
  btn.type = 'button';
  // Con item, abre directo ese plan o ítem: "Ver precio" de Página web cae en Página web
  btn.addEventListener('click', () => selectCat(catIndex(cta.section), cta.item ? itemIndex(cta.section, cta.item) : undefined));
  return btn;
}

// En celular y tablet el detalle va justo debajo del ítem activo (Planes y Contacto no tienen lista ni detalle)
function placeDetail() {
  if (currentView() !== 'list') return;
  if (compact.matches) itemBtns[item].after(detail);
  else if (detail.parentNode !== stage) stage.append(detail);
}
