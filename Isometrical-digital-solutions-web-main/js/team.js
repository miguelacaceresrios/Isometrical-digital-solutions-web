// =========================================================
//   Equipo desde GitHub
//   En content.js solo va el usuario; foto, nombre, descripción y actividad salen del perfil público.
//   GitHub permite 60 consultas por hora sin cuenta y cada integrante usa 2, por eso el resultado se guarda 3 horas
// =========================================================

const TEAM_CACHE_KEY = 'ids-team-v1';
const TEAM_CACHE_MS = 3 * 60 * 60 * 1000;
const teamProfiles = new Map(); // usuario → perfil, o null si GitHub no respondió
const relative = new Intl.RelativeTimeFormat('es-CO', { numeric: 'auto' });
let teamRequested = false;

function isPlaceholder(login) {
  return login.startsWith('[');
}

function githubJson(path) {
  return fetch(`https://api.github.com/${path}`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`GitHub ${r.status}`))));
}

async function fetchProfile(login) {
  const name = encodeURIComponent(login);
  const [user, events] = await Promise.all([
    githubJson(`users/${name}`),
    githubJson(`users/${name}/events/public?per_page=1`).catch(() => [])
  ]);
  const last = events[0];
  return {
    name: (user.name || '').trim() || user.login,
    login: user.login,
    avatar: user.avatar_url,
    bio: user.bio,
    url: user.html_url,
    repos: user.public_repos,
    followers: user.followers,
    location: user.location,
    lastAt: last ? last.created_at : null,
    lastRepo: last ? last.repo.name.split('/')[1] : null
  };
}

// Caché por usuario: { usuario: { at, profile } }. Solo se guardan los perfiles que sí cargaron
function readTeamCache() {
  try {
    return JSON.parse(localStorage.getItem(TEAM_CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeTeamCache(entries) {
  try {
    localStorage.setItem(TEAM_CACHE_KEY, JSON.stringify(entries));
  } catch {
    // Sin almacenamiento disponible: la próxima visita vuelve a consultar
  }
}

// Se llama al abrir Equipo o al acercarse a su botón; consulta una sola vez por visita
function loadTeam() {
  if (teamRequested) return;
  teamRequested = true;
  const logins = [...new Set(TEAM.map((m) => m.github).filter((l) => !isPlaceholder(l)))];
  const cache = readTeamCache();
  const fresh = (l) => cache[l] && Date.now() - cache[l].at < TEAM_CACHE_MS;
  logins.filter(fresh).forEach((l) => teamProfiles.set(l, cache[l].profile));
  const missing = logins.filter((l) => !fresh(l));
  if (missing.length === 0) return;

  Promise.all(missing.map((l) => fetchProfile(l).catch(() => null))).then((profiles) => {
    missing.forEach((l, i) => {
      teamProfiles.set(l, profiles[i]);
      if (profiles[i]) cache[l] = { at: Date.now(), profile: profiles[i] };
    });
    writeTeamCache(cache);
    refreshTeam();
  });
}

// Actualiza las filas y el detalle en su sitio, sin repetir la entrada ni perder el foco
function refreshTeam() {
  if (CATS[cat].slug !== 'equipo') return;
  CATS[cat].items.forEach((it, i) => {
    if (it.github) fillRow(itemBtns[i], it);
  });
  renderDetail();
}

// "Activo hace 2 horas": verde si hubo actividad pública en las últimas 24 horas, como en la consola
function presence(profile) {
  if (!profile.lastAt) return { online: false, text: 'Sin actividad pública reciente' };
  const minutes = Math.max(1, Math.round((Date.now() - Date.parse(profile.lastAt)) / 60000));
  let when = relative.format(-Math.round(minutes / 1440), 'day');
  if (minutes < 60) when = relative.format(-minutes, 'minute');
  else if (minutes < 1440) when = relative.format(-Math.round(minutes / 60), 'hour');
  return { online: minutes < 1440, text: `Activo ${when}` };
}

// Foto a 160 px: nítida tanto en la lista como en el detalle
function sized(url) {
  const u = new URL(url);
  u.searchParams.set('s', '160');
  return u.href;
}

function count(n, one, many) {
  return `${n.toLocaleString('es-CO')} ${n === 1 ? one : many}`;
}

// Cómo se ve un integrante: con su perfil, mientras carga o si GitHub no respondió
function friendView(it) {
  const login = it.github;
  const profile = teamProfiles.get(login);
  const status = profile ? presence(profile) : null;
  const placeholder = isPlaceholder(login);

  let body = 'Cargando su perfil de GitHub…';
  if (placeholder) body = '[Perfil de GitHub]';
  else if (profile) body = profile.bio || 'Todavía no tiene descripción en su perfil de GitHub.';
  else if (teamProfiles.has(login)) body = 'No pudimos cargar su perfil de GitHub en este momento.';

  return {
    title: profile ? profile.name : login,
    sub: status ? status.text : it.role || 'GitHub',
    detailSub: [placeholder ? login : `@${login}`, it.role].filter(Boolean).join(' · '),
    body,
    online: Boolean(status && status.online),
    status: status && { online: status.online, text: status.text + (profile.lastRepo ? ` en ${profile.lastRepo}` : '') },
    points: profile
      ? [count(profile.repos, 'repositorio público', 'repositorios públicos'), count(profile.followers, 'seguidor', 'seguidores'), profile.location].filter(Boolean)
      : [],
    cta: placeholder ? null : { label: 'Ver perfil en GitHub', href: profile ? profile.url : `https://github.com/${encodeURIComponent(login)}` },
    // La foto también se ve aunque la consulta falle: github.com/usuario.png no cuenta en el límite
    avatar: placeholder ? null : profile ? sized(profile.avatar) : `https://github.com/${encodeURIComponent(login)}.png?size=160`
  };
}
