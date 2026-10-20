# Isometrical Digital Solutions · sitio web

La página con la que conseguimos clientes: qué hacemos, cuánto cuesta, quiénes somos y cómo escribirnos. Está inspirada en la interfaz del PSP: una barra de secciones, una lista y un detalle que se deslizan, y ondas de fondo.

Es HTML, CSS y JavaScript sin frameworks, sin librerías y sin paso de compilación. Lo que ve en los archivos es lo que se publica.

## Verla en su computador

Abra `index.html` en el navegador. No hace falta servidor.

- La sección **Equipo** necesita internet: los perfiles se traen de GitHub.
- Para verla en el celular, sírvala en su red local, por ejemplo con la extensión *Live Server* de VS Code, y abra la dirección que le muestre.

## Dónde se cambia cada cosa

Casi todo está en `js/content.js`. Si solo va a cambiar textos o datos, no necesita tocar nada más.

| Quiero cambiar… | Dónde | Cómo |
|---|---|---|
| Un texto de cualquier sección | `js/content.js` → `CATS` | Cada sección tiene sus ítems con `title`, `sub` y `body`. |
| Los precios | `js/content.js` → `PRICES` | En pesos, sin puntos: `1200000`. Si queda en `null`, la página dice "Precio por correo". |
| El equipo | `js/content.js` → `TEAM` | Solo el usuario de GitHub. Foto, nombre y descripción salen de su perfil. El orden se mezcla en cada visita. |
| El correo | `js/content.js` → `EMAIL` | Todos los botones de correo lo usan. |
| WhatsApp | `js/content.js` → `WHATSAPP` y `WHATSAPP_VISIBLE` | El primero solo con dígitos y el 57 adelante; el segundo como se lee. Mientras siga entre corchetes, WhatsApp no aparece. |
| El borrador que trae cada correo | `js/content.js` → `DRAFT` y `JOIN_DRAFT` | Son las preguntas que el cliente solo tiene que completar. |
| Colores, espacios y fuentes | `css/base.css` → `:root` | Use siempre las variables (`--space-4`, `--muted`…), no números sueltos. |

Los textos entre `[corchetes]` son datos pendientes. La página los muestra tal cual, así que hay que reemplazarlos antes de publicar.

## Cómo está organizado

```
index.html          estructura de la página
favicon.svg         ícono de la pestaña
css/                el orden de carga importa: cada archivo puede ajustar a los anteriores
  base.css          variables, página, ondas y título
  nav.css           barra de secciones
  list.css          lista de ítems
  plans.css         tarjetas de precios (Planes)
  contact.css       panel de contacto
  team.css          lista de amigos (Equipo)
  detail.css        detalle, botón y animaciones de entrada
  responsive.css    mouse, pantallas bajas, tablet, celular y movimiento reducido
js/                 se cargan en este orden
  content.js        textos y datos
  dom.js            elementos de la página y utilidades
  render.js         pinta la barra, la lista y el detalle
  plans.js          pinta las tarjetas de Planes
  contact.js        pinta el panel de Contacto
  team.js           trae los perfiles de GitHub
  motion.js         título, ondas y lo que sigue al cursor
  app.js            estado, navegación, teclado y arranque
.github/workflows/  aviso en Discord en cada push a main
```

### Cómo se ve cada sección

Cada sección de `CATS` puede tener un campo `view`:

- sin `view`: lista a la izquierda y detalle a la derecha (Inicio, Servicios, Proyectos, Cómo trabajamos, Equipo);
- `view: 'plans'`: las tarjetas de precios lado a lado;
- `view: 'contact'`: el panel de contacto.

### Cosas que conviene saber

- **Enlaces por sección:** `…/#planes`, `…/#contacto`, etc. abren directamente esa sección. Sirven para compartir por WhatsApp o redes.
- **Teclado:** izquierda y derecha recorren la barra; abajo entra a la lista o a las tarjetas; arriba desde el primer ítem vuelve a la barra.
- **GitHub permite 60 consultas por hora sin cuenta.** Cada integrante usa 2, así que los perfiles se guardan 3 horas en el navegador del visitante. Si GitHub no responde, se ve el usuario y un recuadro gris en lugar de la foto.
- **Fuentes:** Michroma solo para el título, Outfit para nombres y precios de los planes, e Inter para todo lo demás.
- **Movimiento reducido:** si el sistema del visitante lo pide, la página queda quieta. Respete esto en todo lo nuevo que se mueva.

## Reglas para escribir textos

- Español de Colombia, tratando al cliente de **usted**.
- Frases cortas y directas, sin eslóganes ni frases de publicidad.
- Sin tecnicismos: diga qué gana el negocio, no qué tecnología usamos.
- No prometa nada que no ofrezcamos. Los precios van solo en `PRICES`, y la facturación electrónica no se menciona hasta que esté lista.
- Antes de agregar a alguien a `TEAM`, pídale permiso.

## Reglas del código

- Sin frameworks, librerías ni paso de compilación.
- Nombres en inglés; comentarios breves en español, solo cuando el porqué no sea obvio.
- Si un junior no lo entiende al leerlo, se simplifica.
- Cada commit lo firma la persona que hizo el cambio, sin co-autoría ni mención de IA.

## Antes de publicar

- [x] Llenar `PRICES` (y el mínimo de meses del contrato).
- [x] Definir qué agrega la Página Negocio frente a la Básica (`desc` de cada paquete en Planes).
- [x] Poner el número de WhatsApp.
- [ ] Decidir si la Página web incluye alojamiento o si se paga aparte con el Plan mensual.
- [ ] Llenar los `[corchetes]` de Proyectos o quitar esos ítems.
- [ ] Revisar la página en un celular y en un portátil.
