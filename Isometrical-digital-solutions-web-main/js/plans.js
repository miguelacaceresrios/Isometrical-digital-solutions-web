// =========================================================
//   Planes: tarjetas de precios lado a lado
//   Cada tarjeta sale de un ítem de la sección Planes en content.js;
//   los precios vienen de PRICES y, mientras estén en null, se ofrecen por correo
// =========================================================

let planCards = [];

function renderPlans() {
  const section = CATS[cat];
  planCards = section.items.map((it, i) => planCard(it, i));
  plansBox.replaceChildren(...planCards);
  if (section.note) plansBox.append(el('p', 'plans-note', section.note));
  markPlan();
}

function planCard(it, i) {
  const card = el('article', it.featured ? 'plan featured' : 'plan');
  card.style.setProperty('--i', i); // orden de llegada en la cascada
  card.addEventListener('pointerenter', () => selectItem(i));

  // Tipo de pago a la izquierda y, si la hay, la etiqueta ("Recomendado") a la derecha
  const head = el('div', 'plan-head');
  head.append(el('p', 'plan-model', it.model));
  if (it.badge) head.append(el('span', 'plan-badge', it.badge));

  card.append(head, el('h2', 'plan-name', it.title), planPrice(it.price));
  const terms = planTerms(it.terms);
  if (terms) card.append(el('p', 'plan-terms', terms));
  card.append(el('p', 'plan-desc', it.body));
  if (it.packages) card.append(planPackages(it.packages));
  card.append(planIncludes(it.includes || []));

  const cta = el('a', 'plan-cta', it.cta.label);
  cta.href = it.cta.href;
  card.append(cta);
  return card;
}

// "desde $ 1.200.000 pago único", o "Precio por correo" mientras no haya número
function planPrice({ amount, unit, from }) {
  const box = el('p', 'plan-price');
  if (amount == null) {
    box.classList.add('ask');
    box.append(el('span', 'pp-ask', 'Precio por correo'));
    return box;
  }
  if (from) box.append(el('span', 'pp-from', 'desde'));
  box.append(el('span', 'pp-amount', money.format(amount)), el('span', 'pp-unit', unit));
  return box;
}

// "Pago inicial de $ 300.000 · contrato mínimo de 12 meses", solo con los datos que existan
function planTerms(terms) {
  if (!terms) return '';
  const parts = [];
  if (terms.initial != null) parts.push(`Pago inicial de ${money.format(terms.initial)}`);
  if (terms.months != null) parts.push(`contrato mínimo de ${terms.months} meses`); // "6 meses" nunca se parte
  return parts.join(' · ');
}

// Paquetes: el nombre con lo que lo diferencia y, cuando exista, su precio
function planPackages(packages) {
  const rows = el('ul', 'plan-packages');
  packages.forEach((p) => {
    const row = el('li');
    const name = el('span', 'pk-name', p.name);
    if (p.desc) name.append(el('span', 'pk-desc', p.desc));
    row.append(name);
    if (p.amount != null) row.append(el('span', 'pk-price', money.format(p.amount)));
    rows.append(row);
  });
  return rows;
}

function planIncludes(list) {
  const rows = el('ul', 'plan-includes');
  rows.append(...list.map((x) => el('li', '', x)));
  return rows;
}

// La tarjeta elegida (cursor, teclado o "Ver precio" desde Servicios) se ilumina
function markPlan() {
  planCards.forEach((card, i) => card.classList.toggle('on', i === item));
}
