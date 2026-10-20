// =========================================================
//   Textos de la página
//   Cada sección es un botón de la barra, en el mismo orden que en index.html.
//   Los textos entre [corchetes] se reemplazan por los datos reales.
//
//   Sección:  slug (su enlace: …/#slug), label, items
//             view (opcional): 'plans' = tarjetas de precios, 'contact' = panel de contacto;
//             sin view, la sección se ve como lista y detalle
//   Ítem:     title, sub, body, points (opcional), cta (opcional)
//   Servicio: además features [{ name, desc }] (qué incluye) y pay (cómo se paga)
//   Plan:     además key, model (tipo de pago), price, packages [{ name, desc, amount }], terms, includes,
//             featured y badge (etiqueta arriba a la derecha). La sección Planes lleva además note (nota al pie)
//   body:     una línea en blanco (\n\n) separa párrafos
//   cta:      { label, section: 'slug' }             lleva a otra sección
//             { label, section: 'slug', item: key }  lleva a un ítem de esa sección
//             { label, href: '…' }                   abre un enlace
// =========================================================

// ---------- Datos de contacto (se llenan una sola vez) ----------
const WHATSAPP = '573123438422';             // solo dígitos, con el 57 adelante
const WHATSAPP_VISIBLE = '+57 312 343 8422';  // como se lee en pantalla
const EMAIL = 'isometricaldevteam@gmail.com';

// Borrador que trae cada correo: el cliente solo completa los espacios
const DRAFT = [
  'Hola, equipo de Isometrical:',
  '',
  'Mi nombre: ',
  'Qué hace mi negocio: ',
  'Qué me quita tiempo hoy: ',
  'Cómo lo resuelvo ahora: ',
  'Para cuándo lo necesito: ',
  '',
  'Gracias.'
].join('\n');

const JOIN_DRAFT = [
  'Hola, equipo de Isometrical:',
  '',
  'Mi nombre: ',
  'Qué estoy estudiando: ',
  'Qué sé hacer hoy: ',
  'Mi usuario de GitHub (si tengo): ',
  '',
  'Gracias.'
].join('\n');

// El correo es el canal principal: cada botón abre un correo con el asunto y el borrador ya escritos
function mail(subject, body = DRAFT) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// WhatsApp es la segunda opción y solo aparece en Contacto cuando WHATSAPP ya tiene un número
function wa(text) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function hasWhatsApp() {
  return !WHATSAPP.startsWith('[');
}

const HELLO = 'Quiero información para mi negocio';

// ---------- Precios (se llenan una sola vez) ----------
// En pesos colombianos, sin puntos: 1200000. Mientras un valor esté en null,
// la página no muestra número y dice "Precio por correo".
const PRICES = {
  paginaBasica: 690000,     // pago único
  paginaNegocio: 1290000,   // pago único
  sistemaInicial: 590000,   // pago inicial del sistema
  sistemaMensual: 149000,   // cuota mensual del sistema
  contratoMeses: 6,         // contrato mínimo del sistema, en meses
  planMensual: 69000        // plan mensual suelto
};

// ---------- Equipo: solo el usuario de GitHub ----------
// Foto, nombre, descripción y actividad llegan del perfil público de GitHub (js/team.js).
// El rol es opcional. Agregue solo a quien esté de acuerdo en aparecer.
const TEAM = [
  { github: 'miguelacaceresrios' },
  { github: 'miguelacaceresr' },
  { github: 'lexmurillo' },
  { github: 'leanf0' },
  { github: 'HugoReynaldo' },
  { github: 'tomatitooou' },
  { github: 'KeynerCaicedo' },
  { github: 'itiel06' }
];

// Cada integrante es un ítem tipo "amigo de consola" en la sección Equipo
function person(member) {
  return { github: member.github, role: member.role, title: member.github, sub: member.role || '', body: '' };
}

// Sin jerarquía: el orden se mezcla en cada visita, así nadie aparece siempre de primero
function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------- Secciones ----------
const CATS = [
  {
    // Lo que gana el cliente y por qué elegirnos
    slug: 'inicio',
    label: 'Inicio',
    items: [
      {
        title: 'Software para su negocio',
        sub: 'Qué hacemos',
        body: 'Pasamos sus ventas, inventario y citas del cuaderno o el WhatsApp a un sistema hecho para su negocio.',
        cta: { label: 'Escríbanos', href: mail(HELLO) }
      },
      {
        title: 'Precios claros',
        sub: 'Cómo cobramos',
        body: 'Páginas web a precio fijo. Sistemas con un pago inicial bajo y una cuota mensual.',
        cta: { label: 'Ver planes', section: 'planes' }
      },
      {
        title: 'Más rápido y más barato',
        sub: 'Base probada',
        body: 'No empezamos de cero: adaptamos a su negocio una base que ya funciona.'
      },
      {
        title: 'Trato directo',
        sub: 'Sin intermediarios',
        body: 'Usted habla con quien hace su sistema, y se lo explicamos sin palabras técnicas.',
        cta: { label: 'Cómo trabajamos', section: 'como-trabajamos' }
      },
      {
        title: 'Un equipo joven',
        sub: 'Por qué existimos',
        body: 'Cada proyecto le da trabajo a programadores jóvenes que formamos. Siempre lo revisa alguien con experiencia antes de entregarlo.',
        cta: { label: 'Conocer el equipo', section: 'equipo' }
      }
    ]
  },
  {
    // Los cuatro servicios. El cliente suele comprar uno solo, así que cada uno se lee como una
    // oferta completa: para quién es, qué incluye (features) y cómo se paga (pay). El precio va en Planes
    slug: 'servicios',
    label: 'Servicios',
    items: [
      {
        title: 'Sistema para su negocio',
        sub: 'Nuestro servicio principal',
        body: 'Para el negocio que hoy lleva todo en cuadernos, hojas de cálculo o WhatsApp. Lo adaptamos a cómo trabaja usted.',
        features: [
          { name: 'Ventas y caja', desc: 'Registre ventas y cuadre la caja.' },
          { name: 'Inventario', desc: 'Sepa qué tiene y qué le falta.' },
          { name: 'Clientes y citas', desc: 'Clientes y agenda en un solo lugar.' },
          { name: 'Reportes', desc: 'Sus números claros, sin sumar a mano.' },
          { name: 'Capacitación', desc: 'Le enseñamos a usarlo a su equipo.' }
        ],
        pay: 'Pago inicial bajo y cuota mensual',
        cta: { label: 'Ver precio', section: 'planes', item: 'sistema' }
      },
      {
        title: 'Página web',
        sub: 'Presencia en internet',
        body: 'Para que sus clientes lo encuentren, sepan qué ofrece y le escriban.',
        features: [
          { name: 'Diseño propio', desc: 'Hecha para su negocio, sin plantillas.' },
          { name: 'Adaptada al celular', desc: 'Se ve bien en cualquier pantalla.' },
          { name: 'Botón de WhatsApp', desc: 'Para que le escriban con un toque.' },
          { name: 'Dos paquetes', desc: 'Básica, de una sola página, o Negocio, con catálogo.' }
        ],
        pay: 'Pago único, a precio fijo',
        cta: { label: 'Ver precio', section: 'planes', item: 'pagina' }
      },
      {
        title: 'Plan mensual',
        sub: 'Para quien ya tiene página o sistema',
        body: 'Nos encargamos de que su página o sistema siga funcionando y al día.',
        features: [
          { name: 'Alojamiento', desc: 'Su página o sistema siempre en línea.' },
          { name: 'Copias de seguridad', desc: 'Su información respaldada.' },
          { name: 'Soporte', desc: 'Nos escribe cuando lo necesite.' },
          { name: 'Cambios pequeños', desc: 'Los ajustes del día a día.' },
          { name: 'Revisión de seguridad básica', desc: 'Para prevenir fallas comunes.' }
        ],
        pay: 'Cuota mensual',
        cta: { label: 'Ver precio', section: 'planes', item: 'plan-mensual' }
      },
      {
        title: 'Revisión de seguridad',
        sub: 'Para empresas medianas',
        body: 'Revisamos su página o sistema y le decimos qué fallas tiene y cuáles corregir primero.',
        features: [
          { name: 'Revisión completa', desc: 'De su página o de su sistema.' },
          { name: 'Fallas comunes', desc: 'Las encontramos a tiempo.' },
          { name: 'Prioridades claras', desc: 'Qué corregir primero, sin tecnicismos.' }
        ],
        pay: 'Se cotiza según su caso',
        cta: { label: 'Cotizar por correo', href: mail('Cotizar una revisión de seguridad') }
      }
    ]
  },
  {
    // Cuánto cuesta y qué incluye. Los valores salen de PRICES (arriba)
    slug: 'planes',
    label: 'Planes',
    view: 'plans',
    note: 'Precios en pesos colombianos. El valor de su caso queda por escrito en la propuesta, antes de empezar.',
    items: [
      {
        key: 'pagina',
        model: 'Pago único',
        title: 'Página web',
        sub: 'Pago único',
        body: 'Elija el paquete y pague una sola vez.',
        price: { amount: PRICES.paginaBasica, unit: 'pago único', from: true },
        packages: [
          { name: 'Página Básica', desc: 'Una sola página con lo esencial', amount: PRICES.paginaBasica },
          { name: 'Página Negocio', desc: 'Hasta 5 secciones, catálogo y mapa', amount: PRICES.paginaNegocio }
        ],
        includes: ['Diseño propio', 'Adaptada al celular', 'Botón de WhatsApp'],
        cta: { label: 'Pedir por correo', href: mail('Quiero una página web') }
      },
      {
        key: 'sistema',
        model: 'Inicial + mensual',
        featured: true,   // el producto principal: su tarjeta se destaca un poco
        badge: 'Recomendado',
        title: 'Sistema para su negocio',
        sub: 'Pago inicial bajo y cuota mensual',
        body: 'Ventas, inventario, clientes y reportes en un solo lugar, sobre una base que ya funciona.',
        price: { amount: PRICES.sistemaMensual, unit: 'al mes', from: true },
        terms: { initial: PRICES.sistemaInicial, months: PRICES.contratoMeses },
        includes: ['Ventas y caja', 'Inventario', 'Clientes y citas', 'Reportes', 'Capacitación para su equipo'],
        cta: { label: 'Cotizar por correo', href: mail('Cotizar un sistema para mi negocio') }
      },
      {
        key: 'plan-mensual',
        model: 'Mensual',
        title: 'Plan mensual',
        sub: 'Para quien ya tiene página o sistema',
        body: 'Nos encargamos de que todo siga funcionando.',
        price: { amount: PRICES.planMensual, unit: 'al mes' },
        includes: ['Alojamiento', 'Copias de seguridad', 'Soporte', 'Cambios pequeños', 'Revisión de seguridad básica'],
        cta: { label: 'Preguntar por correo', href: mail('Información del plan mensual') }
      }
    ]
  },
  {
    // Portafolio; cierra invitando a escribir
    slug: 'proyectos',
    label: 'Proyectos',
    items: [
      {
        title: '[Nombre de la tiquetera]',
        sub: 'Plataforma de eventos',
        body: 'Plataforma para publicar eventos, vender boletas y controlar el ingreso.\n[Cifra real: eventos publicados o boletas vendidas]'
      },
      {
        title: '[Proyecto 2]',
        sub: '[Tipo de negocio]',
        body: '[Qué problema tenía el cliente y qué cambió con el sistema, en dos frases.]'
      },
      {
        title: '[Proyecto 3]',
        sub: '[Tipo de negocio]',
        body: '[Si el cliente prefiere no aparecer, describa el sector y el resultado sin nombrarlo.]'
      },
      {
        title: 'Su negocio',
        sub: 'El próximo proyecto',
        body: 'Cuéntenos qué le quita tiempo hoy.',
        cta: { label: 'Escríbanos', href: mail(HELLO) }
      }
    ]
  },
  {
    // Cuatro pasos, sin sorpresas para el cliente
    slug: 'como-trabajamos',
    label: 'Cómo trabajamos',
    items: [
      {
        title: 'Conversamos',
        sub: 'Paso 1 de 4',
        body: 'Nos cuenta cómo funciona su negocio, por correo, llamada o videollamada.',
        cta: { label: 'Escríbanos', href: mail(HELLO) }
      },
      {
        title: 'Propuesta por escrito',
        sub: 'Paso 2 de 4',
        body: 'Qué incluye, cuánto cuesta, cómo se paga y cuándo se entrega.'
      },
      {
        title: 'Desarrollo por etapas',
        sub: 'Paso 3 de 4',
        body: 'Le mostramos los avances para que los pruebe.'
      },
      {
        title: 'Entrega',
        sub: 'Paso 4 de 4',
        body: 'Funcionando, documentado y con capacitación. Si quiere, seguimos con el plan mensual.',
        cta: { label: 'Empecemos', href: mail(HELLO) }
      }
    ]
  },
  {
    // Lista de amigos (perfiles de GitHub), la regla de revisión y la invitación a unirse
    slug: 'equipo',
    label: 'Equipo',
    items: [
      ...shuffled(TEAM).map(person),
      {
        title: 'Revisado antes de entregar',
        sub: 'Nuestra regla',
        body: 'Todo proyecto lo dirige y lo revisa alguien con experiencia antes de llegar a usted.'
      },
      {
        title: '¿Estudia programación?',
        sub: 'Trabaje con nosotros',
        body: 'Lo formamos y lo sumamos a proyectos reales según su nivel.',
        points: ['Aprendiz', 'Junior', 'Desarrollador', 'Líder'],
        cta: { label: 'Quiero unirme', href: mail('Quiero unirme a Isometrical', JOIN_DRAFT) }
      }
    ]
  },
  {
    // Panel propio (js/contact.js): correo grande para copiar o escribir, y qué contarnos
    slug: 'contacto',
    label: 'Contacto',
    view: 'contact',
    heading: 'Cuéntenos qué necesita',
    intro: 'Escríbanos con sus propias palabras. No necesita saber de tecnología.',
    topics: ['Qué hace su negocio', 'Qué le quita tiempo hoy', 'Cómo lo resuelve ahora', 'Para cuándo lo necesita'],
    items: [
      {
        key: 'correo',
        title: 'Correo',
        sub: EMAIL,
        body: 'El correo se abre con un borrador listo para completar.',
        cta: { label: 'Escribir correo', href: mail(HELLO) }
      },
      {
        key: 'whatsapp',
        title: 'WhatsApp',
        sub: WHATSAPP_VISIBLE,
        body: 'Si lo prefiere, también le respondemos por aquí.',
        cta: { label: 'Escribir por WhatsApp', href: wa('Hola, quiero información para mi negocio.') }
      },
      {
        key: 'ubicacion',
        title: 'Ubicación',
        sub: 'Colombia',
        body: 'Atendemos negocios de todo el país, a distancia.'
      }
    ]
  }
];
