# Isometrical Digital Solutions 

La página con la que conseguimos clientes: 
qué hacemos, cuánto cuesta, quiénes somos y cómo escribirnos. Está inspirada en la interfaz del PSP: una barra de secciones, una lista y un detalle que se deslizan, y ondas de fondo.

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
