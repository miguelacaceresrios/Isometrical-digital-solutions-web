// =========================================================
//   Contacto: el correo en grande para copiar o escribir (con borrador listo),
//   qué contarnos para empezar y la ubicación. WhatsApp aparece solo si ya hay número
//   Los textos salen de la sección Contacto en content.js
// =========================================================

function renderContact() {
  const section = CATS[cat];
  const byKey = (key) => section.items.find((it) => it.key === key);
  const mailItem = byKey('correo');
  const waItem = byKey('whatsapp');
  const place = byKey('ubicacion');

  // Columna principal: invitación, correo y botones
  const main = el('div', 'contact-main');
  main.append(el('p', 'contact-eyebrow', mailItem.title), el('h2', 'contact-heading', section.heading), el('p', 'contact-intro', section.intro));
  main.append(emailBox(mailItem.sub));

  const actions = el('div', 'contact-actions');
  const write = el('a', 'cta contact-email-cta', mailItem.cta.label);
  write.href = mailItem.cta.href;
  actions.append(write);
  if (hasWhatsApp()) {
    const chat = el('a', 'cta contact-whatsapp-cta', waItem.cta.label);
    chat.href = waItem.cta.href;
    chat.target = '_blank';
    chat.rel = 'noopener';
    actions.append(chat);
  }
  main.append(actions, el('p', 'contact-note', mailItem.body));

  // Columna lateral: qué contarnos y dónde estamos
  const side = el('aside', 'contact-side');
  const topics = el('ul', 'contact-topics');
  topics.append(...section.topics.map((t) => el('li', '', t)));
  side.append(el('p', 'contact-eyebrow', 'Para empezar, cuéntenos'), topics);
  const where = el('div', 'contact-place');
  where.append(el('p', 'contact-eyebrow', place.title), el('p', 'contact-place-name', place.sub), el('p', 'contact-place-note', place.body));
  side.append(where);

  contactBox.replaceChildren(main, side);
}

// La dirección se puede leer, seleccionar y copiar: "Escribir correo" no abre nada
// en equipos sin programa de correo (por ejemplo, quien usa Gmail en el navegador)
function emailBox(address) {
  const box = el('div', 'contact-email');
  const text = el('span', 'ce-address', address);
  const copy = el('button', 'ce-copy', 'Copiar');
  copy.type = 'button';
  copy.addEventListener('click', () => copyAddress(address, text, copy));
  box.append(text, copy);
  return box;
}

function copyAddress(address, text, button) {
  const say = (label) => {
    button.textContent = label;
    clearTimeout(button.resetTimer);
    button.resetTimer = setTimeout(() => (button.textContent = 'Copiar'), 2200);
  };
  // Si el navegador no deja copiar, se selecciona la dirección para copiarla a mano
  const selectIt = () => {
    const range = document.createRange();
    range.selectNodeContents(text);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    say('Selecciónela y cópiela');
  };
  if (!navigator.clipboard) return selectIt();
  navigator.clipboard.writeText(address).then(() => say('Copiado'), selectIt);
}
