// ============================================================
//  Motor de apps de estudio — genérico, no se edita por tema.
//  Lo propio de cada app vive en config.json y en tema.js.
// ============================================================
const MOTOR_VERSION = '2.0.0';
let CFG = {};        // config.json
let BLOCKS = [];     // TEMA.bloques
let CARDS = [], CARD = {}, CURRICULUM = [];
const INTERVALS = [1, 3, 7, 14, 30, 60]; // días tras cada acierto consecutivo
const DAY_CUTOFF_H = 4; // el día cambia a las 4:00 (guardias)

// ---------- utilidades ----------
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const pick = (a, n) => shuffle(a).slice(0, n);
const uniq = a => [...new Set(a)];
function todayKey(d = new Date()) {
  const t = new Date(d.getTime() - DAY_CUTOFF_H * 3600e3);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(y, m - 1, d + n, 12);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
function daysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number), [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((new Date(y2, m2 - 1, d2, 12) - new Date(y1, m1 - 1, d1, 12)) / 864e5);
}
const fmtRoots = (main, minor = []) => main.join(', ') + (minor.length ? ` (${minor.join(', ')})` : '');

// ---------- almacenamiento (IndexedDB con respaldo) ----------
const Store = {
  db: null,
  async open() {
    if (!('indexedDB' in window)) return;
    this.db = await new Promise((res) => {
      try {
        const r = indexedDB.open(CFG.almacen.db, 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => res(r.result);
        r.onerror = () => res(null);
      } catch (e) { res(null); }
    });
  },
  async get(k) {
    if (this.db) {
      const v = await new Promise(res => {
        const tx = this.db.transaction('kv', 'readonly').objectStore('kv').get(k);
        tx.onsuccess = () => res(tx.result); tx.onerror = () => res(undefined);
      });
      if (v !== undefined) return v;
    }
    try { const s = localStorage.getItem(CFG.almacen.prefijo + k); return s ? JSON.parse(s) : undefined; } catch (e) { return undefined; }
  },
  async set(k, v) {
    if (this.db) {
      await new Promise(res => {
        const tx = this.db.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(v, k); tx.oncomplete = res; tx.onerror = res;
      });
    }
    try { localStorage.setItem(CFG.almacen.prefijo + k, JSON.stringify(v)); } catch (e) { }
  },
};

// ---------- estado ----------
let S = null;
function defaultState() {
  return {
    v: 1, cards: {}, bank: 0, lastGrant: null, history: {},
    settings: { perDay: 10, theme: 'auto', thinkFirst: true, blocks: Object.fromEntries(BLOCKS.map(b => [b.id, true])) },
  };
}
const save = () => Store.set('state', S);

// ---------- generación de tarjetas ----------
// Las tarjetas las construye el tema. Para un banco de preguntas escrito a
// mano (contenido.json), el tema puede limitarse a llamar a esta ayuda.
function tarjetasDesdeBanco(preguntas) {
  return preguntas.map(p => ({
    id: p.id, block: p.bloque || p.block, kind: 'mcq',
    q: p.enunciado, title: p.titulo || '', answer: p.opciones[p.correcta],
    tags: p.etiquetas || [], fig: p.imagen || null, figEnRespuesta: !!p.imagenEnRespuesta,
    teoria: p.teoria || null,
    make: () => ({ options: shuffle(p.opciones), correct: p.opciones[p.correcta], ex: esc(p.explicacion) }),
  }));
}

// Orden de presentación de nuevas: reparto ponderado entre bloques
function curriculum() {
  const lists = {};
  for (const b of BLOCKS) lists[b.id] = CARDS.filter(c => c.block === b.id).map(c => c.id);
  // el tema puede reordenar dentro de un bloque (p. ej. separar las tarjetas
  // que hablan de lo mismo para que no salgan seguidas)
  if (TEMA.ordenarBloque) for (const b of BLOCKS) lists[b.id] = TEMA.ordenarBloque(b.id, lists[b.id]) || lists[b.id];
  const res = [];
  const ptr = Object.fromEntries(BLOCKS.map(b => [b.id, 0]));
  let added = true;
  while (added) {
    added = false;
    for (const b of BLOCKS) {
      for (let k = 0; k < (b.weight || 1); k++) {
        if (ptr[b.id] < lists[b.id].length) { res.push(lists[b.id][ptr[b.id]++]); added = true; }
      }
    }
  }
  return res;
}

// ---------- planificación ----------
const enabled = c => S.settings.blocks[c.block] !== false;
function unseenIds() { return CURRICULUM.filter(id => !S.cards[id] && enabled(CARD[id])); }
function dueIds(day = todayKey()) {
  return CARDS.filter(c => enabled(c) && S.cards[c.id] && S.cards[c.id].due <= day).map(c => c.id);
}
function grantDaily() {
  const t = todayKey();
  if (!S.lastGrant) { S.bank = S.settings.perDay; S.lastGrant = t; return; }
  const d = daysBetween(S.lastGrant, t);
  if (d > 0) { S.bank += S.settings.perDay * d; S.lastGrant = t; }
}
function pendingNew() { return Math.min(S.bank, unseenIds().length); }

function schedule(id, correct) {
  const t = todayKey();
  const st = S.cards[id] || { l: 0, r: 0, w: 0, first: t };
  const isNew = !S.cards[id];
  if (correct) { st.l = Math.min(st.l + 1, INTERVALS.length); st.due = addDays(t, INTERVALS[st.l - 1]); st.r++; }
  else { st.l = 0; st.due = addDays(t, 1); st.w++; }
  st.last = t;
  S.cards[id] = st;
  if (isNew) S.bank = Math.max(0, S.bank - 1);
  const h = S.history[t] || (S.history[t] = { n: 0, ok: 0 });
  h.n++; if (correct) h.ok++;
}

function streak() {
  let d = todayKey(), n = 0;
  if (!S.history[d]) d = addDays(d, -1);
  while (S.history[d] && S.history[d].n > 0) { n++; d = addDays(d, -1); }
  return n;
}

function tagStats() {
  const acc = {};
  for (const c of CARDS) {
    const st = S.cards[c.id];
    if (!st || !c.tags) continue;
    for (const t of c.tags) {
      const a = acc[t] || (acc[t] = { r: 0, w: 0, n: 0 });
      a.r += st.r; a.w += st.w; a.n++;
    }
  }
  return acc;
}

// ---------- sesión ----------
let session = null;
function startSession(extraNew = 0) {
  if (extraNew) { S.bank += extraNew; save(); }
  const due = shuffle(dueIds());
  const fresh = unseenIds().slice(0, pendingNew());
  // intercalar nuevas entre repasos
  const q = [];
  const step = fresh.length ? Math.max(1, Math.floor((due.length + fresh.length) / fresh.length)) : 1;
  let fi = 0, di = 0;
  while (di < due.length || fi < fresh.length) {
    for (let k = 0; k < step - 1 && di < due.length; k++) q.push(due[di++]);
    if (fi < fresh.length) q.push(fresh[fi++]); else if (di < due.length) q.push(due[di++]);
  }
  if (!q.length) return render();
  session = { queue: q, idx: 0, firstOk: 0, firstN: 0, seen: new Set(), retries: {}, total: q.length };
  showCard();
}

function showCard() {
  const id = session.queue[session.idx];
  const card = CARD[id];
  session.cur = { id, card, inst: card.make(), selected: new Set(), answered: false, revealed: !S.settings.thinkFirst };
  render();
}

function answer(value) {
  const cur = session.cur;
  if (cur.answered) return;
  let ok;
  if (cur.card.kind === 'multi') {
    const sel = cur.selected, c = cur.card;
    ok = c.main.every(r => sel.has(r)) && [...sel].every(r => c.main.includes(r) || c.minor.includes(r));
  } else {
    cur.choice = value;
    ok = value === cur.inst.correct;
  }
  cur.answered = true; cur.ok = ok;
  const first = !session.seen.has(cur.id);
  session.seen.add(cur.id);
  if (first) {
    schedule(cur.id, ok);
    session.firstN++; if (ok) session.firstOk++;
    save();
  }
  if (!ok) {
    const n = session.retries[cur.id] = (session.retries[cur.id] || 0) + 1;
    if (n <= 2) { session.queue.push(cur.id); session.total++; }
  }
  render();
  requestAnimationFrame(() => { const f = $('.feedback'); if (f) f.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); });
}

function next() {
  session.idx++;
  if (session.idx >= session.queue.length) { session.done = true; render(); return; }
  showCard();
  window.scrollTo(0, 0);
}

// ---------- vistas ----------
let tab = 'hoy';
let consultaTab = null, consultaBlock = null, segSel = null;
let TEORIA = null;   // teoria.json, si el tema lo usa
let TEMA = null;     // lo define tema.js

function render() {
  applyTheme();
  const app = $('#app');
  if (session && !session.done) { app.innerHTML = viewSession(); bindSession(); return; }
  if (session && session.done) { app.innerHTML = viewSummary(); bindSummary(); return; }
  const views = { hoy: viewHome, consulta: viewConsulta, progreso: viewProgress, ajustes: viewSettings };
  app.innerHTML = `<main class="page">${views[tab]()}</main>${viewNav()}`;
  bindCommon();
}

function viewNav() {
  const items = [['hoy', 'Hoy', 'M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1z'],
    ['consulta', 'Consulta', 'M5 4h10l4 4v12H5zM15 4v4h4M8 12h8M8 16h6'],
    ['progreso', 'Progreso', 'M5 20V10M10 20V4M15 20v-7M20 20v-4'],
    ['ajustes', 'Ajustes', 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 13a7.5 7.5 0 000-2l2-1.5-2-3.4-2.4 1a7.4 7.4 0 00-1.7-1L15 3.5h-4l-.3 2.6a7.4 7.4 0 00-1.7 1l-2.4-1-2 3.4 2 1.5a7.5 7.5 0 000 2l-2 1.5 2 3.4 2.4-1a7.4 7.4 0 001.7 1l.3 2.6h4l.3-2.6a7.4 7.4 0 001.7-1l2.4 1 2-3.4z']];
  return `<nav class="tabbar">${items.map(([k, l, d]) => `<button class="tab ${tab === k ? 'on' : ''}" data-tab="${k}" aria-current="${tab === k}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg><span>${l}</span></button>`).join('')}</nav>`;
}

// ---- Hoy ----
function viewHome() {
  const due = dueIds().length, nw = pendingNew(), total = due + nw;
  const unseen = unseenIds().length;
  const seen = Object.keys(S.cards).length;
  const dateStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const parts = [];
  if (due) parts.push(`${due} ${due === 1 ? 'repaso' : 'repasos'}`);
  if (nw) parts.push(`${nw} ${nw === 1 ? 'nueva' : 'nuevas'}`);
  return `
  <header class="home-head"><p class="date">${dateStr}</p><h1 class="brand">${esc(CFG.nombre)}</h1></header>
  <section class="today">
    ${total ? `<div class="today-count"><span class="big">${total}</span><span class="lbl">${total === 1 ? 'tarjeta pendiente' : 'tarjetas pendientes'}</span></div>
      <p class="today-split">${parts.join(' y ')}${nw && S.bank > S.settings.perDay ? ' (incluye nuevas acumuladas)' : ''}</p>
      <button class="btn primary big-btn" id="start">Empezar</button>`
    : `<div class="today-count"><span class="big done">0</span><span class="lbl">pendientes</span></div>
      <p class="today-split">${unseen ? 'Has terminado lo de hoy. Mañana vuelven los repasos que tocan.' : 'Has visto todas las tarjetas activas. Solo quedan repasos.'}</p>
      ${unseen ? `<button class="btn ghost" id="more">Estudiar 10 nuevas más</button>` : ''}`}
  </section>
  ${viewMapa()}
  <section class="mini-stats">
    <div><span class="n">${streak()}</span><span class="l">${streak() === 1 ? 'día seguido' : 'días seguidos'}</span></div>
    <div><span class="n">${seen}</span><span class="l">de ${CARDS.length} tarjetas vistas</span></div>
    <div><span class="n">${CARDS.filter(c => enabled(c) && S.cards[c.id] && S.cards[c.id].due === addDays(todayKey(), 1)).length}</span><span class="l">repasos mañana</span></div>
  </section>`;
}

function viewMapa() {
  const st = tagStats();
  if (!Object.keys(st).length && !TEMA.mapa) return '';
  const cls = a => {
    if (!a || a.r + a.w === 0) return 'u';
    const p = a.r / (a.r + a.w);
    return p >= 0.85 ? 'g' : p >= 0.6 ? 'y' : 'r';
  };
  const info = sel => {
    const a = st[sel];
    return a && a.r + a.w ? `<strong>${esc(sel)}</strong>: ${a.n} ${a.n === 1 ? 'tarjeta vista' : 'tarjetas vistas'}, ${Math.round(100 * a.r / (a.r + a.w))} % de aciertos.`
      : `<strong>${esc(sel)}</strong>: aún no has visto tarjetas de aquí.`;
  };
  const leyenda = '<p class="seg-legend"><i class="g"></i>≥85 %<i class="y"></i>60–84 %<i class="r"></i>&lt;60 %<i class="u"></i>sin datos</p>';
  const pie = `<p class="seg-info">${segSel ? info(segSel) : 'Toca una casilla para ver cómo lo llevas.'}</p>${leyenda}`;
  // mapa propio del tema (mapa segmentario, territorios…), o rejilla por etiqueta
  if (TEMA.mapa) return `<section class="segmap" aria-label="${esc(TEMA.mapa.titulo)}">
    <h2 class="sec-title">${esc(TEMA.mapa.titulo)}</h2>${TEMA.mapa.render(st, segSel, cls)}${pie}</section>`;
  const claves = Object.keys(st);
  if (!claves.length) return '';
  return `<section class="segmap" aria-label="Aciertos">
    <h2 class="sec-title">${esc(CFG.mapa?.titulo || 'Cómo lo llevas')}</h2>
    <div class="seg-row"><div class="seg-cells wrap">
      ${claves.map(k => `<button class="seg ancha ${cls(st[k])} ${segSel === k ? 'sel' : ''}" data-seg="${esc(k)}">${esc(k)}</button>`).join('')}
    </div></div>${pie}</section>`;
}
// ---- Sesión ----
function viewSession() {
  const { card, inst, answered, ok } = session.cur;
  const block = BLOCKS.find(b => b.id === card.block);
  const pct = Math.round(100 * session.idx / session.queue.length);
  const isNew = !session.seen.has(card.id) && !S.cards[card.id];
  let body = '';
  if (!session.cur.revealed) {
    body = `<div class="think"><p>Piensa la respuesta antes de ver las opciones.</p>
      <button class="btn primary" id="reveal">Mostrar opciones</button></div>`;
  } else if (card.kind === 'multi') {
    const sel = session.cur.selected;
    body = `<div class="chips" role="group" aria-label="Raíces">${card.chips.map(r => {
      let c = sel.has(r) ? 'on' : '';
      if (answered) {
        const main = card.main.includes(r), minor = card.minor.includes(r), s = sel.has(r);
        c = main && s ? 'ok' : main ? 'miss' : minor && s ? 'ok minor' : minor ? 'minor-hint' : s ? 'bad' : 'off';
      }
      return `<button class="chip ${c}" data-chip="${r}" ${answered ? 'disabled' : ''} aria-pressed="${sel.has(r)}">${r}</button>`;
    }).join('')}</div>
    ${!answered ? `<button class="btn primary" id="check" ${sel.size ? '' : 'disabled'}>Comprobar</button>` : ''}`;
  } else {
    body = `<div class="options">${inst.options.map((o, i) => {
      let c = '';
      if (answered) c = o === inst.correct ? 'ok' : o === session.cur.choice ? 'bad' : 'off';
      return `<button class="opt ${c}" data-opt="${i}" ${answered ? 'disabled' : ''}>${esc(o)}</button>`;
    }).join('')}</div>`;
  }
  const fb = answered ? `<section class="feedback ${ok ? 'is-ok' : 'is-bad'}" aria-live="polite">
      <p class="verdict">${ok ? 'Correcto' : 'Incorrecto'}</p>
      ${!ok ? `<p class="right-answer">Respuesta: <strong>${esc(card.kind === 'multi' ? card.answer : inst.correct)}</strong></p>` : ''}
      ${card.fig && card.figEnRespuesta ? `<div class="fig-wrap">${figura(card.fig)}</div>` : ''}
      <div class="ex">${inst.ex}</div>
      ${!ok ? `<p class="again">Volverá a salir al final de esta sesión y mañana.</p>` : ''}
      <button class="btn primary" id="next">${session.idx + 1 >= session.queue.length ? 'Terminar' : 'Siguiente'}</button>
    </section>` : '';
  return `<main class="page session">
    <header class="s-head">
      <button class="icon-btn" id="quit" aria-label="Salir de la sesión"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <span class="count">${session.idx + 1}/${session.queue.length}</span>
    </header>
    <p class="s-meta"><span class="blk">${esc(block.name)}</span>${isNew ? '<span class="new-tag">Nueva</span>' : ''}</p>
    ${card.fig && !card.figEnRespuesta ? `<div class="fig-wrap">${figura(card.fig)}</div>` : ''}
    ${card.title ? `<h2 class="q-title">${esc(card.title)}</h2>` : ''}
    <p class="q ${card.title ? '' : 'q-big'}">${esc(card.q)}</p>
    ${card.hint && !answered && session.cur.revealed ? `<p class="hint">${esc(card.hint)}</p>` : ''}
    ${body}${fb}
  </main>`;
}

function bindSession() {
  $('#quit').onclick = () => { session = null; tab = 'hoy'; render(); };
  document.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => answer(session.cur.inst.options[+b.dataset.opt]));
  document.querySelectorAll('[data-chip]').forEach(b => b.onclick = () => {
    const s = session.cur.selected, r = b.dataset.chip;
    s.has(r) ? s.delete(r) : s.add(r);
    b.classList.toggle('on'); b.setAttribute('aria-pressed', s.has(r));
    $('#check').disabled = !s.size;
  });
  const rv = $('#reveal');
  if (rv) {
    rv.onclick = () => { session.cur.revealed = true; render(); const f = $('.opt, .chip'); if (f) f.focus({ preventScroll: true }); };
    rv.focus({ preventScroll: true });
  }
  const ck = $('#check'); if (ck) ck.onclick = () => answer();
  const nx = $('#next'); if (nx) { nx.onclick = next; nx.focus({ preventScroll: true }); }
}

function viewSummary() {
  const p = session.firstN ? Math.round(100 * session.firstOk / session.firstN) : 0;
  const unseen = unseenIds().length;
  const tomorrow = dueIds(addDays(todayKey(), 1)).length;
  return `<main class="page summary">
    <h1 class="sum-title">Sesión terminada</h1>
    <div class="sum-score"><span class="big">${session.firstOk}<small>/${session.firstN}</small></span><span class="lbl">acertadas a la primera (${p} %)</span></div>
    <p class="sum-line">Mañana te esperan ${tomorrow} ${tomorrow === 1 ? 'repaso' : 'repasos'} y ${S.settings.perDay} nuevas.</p>
    <div class="sum-actions">
      <button class="btn primary" id="home">Volver al inicio</button>
      ${unseen ? `<button class="btn ghost" id="more">Estudiar 10 nuevas más</button>` : ''}
    </div>
  </main>`;
}
function bindSummary() {
  $('#home').onclick = () => { session = null; tab = 'hoy'; render(); };
  const m = $('#more'); if (m) m.onclick = () => { session = null; startSession(10); };
}

function pestanasConsulta() {
  const p = (TEMA.consulta?.pestanas || []).map(x => [x.id, x.etiqueta]);
  if (TEORIA) p.push(['teoria', CFG.tituloTeoria || 'Teoría']);
  p.push(['tarjetas', 'Tarjetas']);
  return p;
}

function viewConsulta() {
  const tabs = pestanasConsulta();
  if (!consultaTab || !tabs.some(t => t[0] === consultaTab)) consultaTab = tabs[0][0];
  const propia = (TEMA.consulta?.pestanas || []).find(x => x.id === consultaTab);
  let body = '';
  if (propia) body = propia.render();
  else if (consultaTab === 'teoria') body = viewTeoria();
  else body = viewListaTarjetas();
  return `<h1 class="page-title">Consulta</h1>
    <div class="seg-ctrl" role="tablist">${tabs.map(([k, l]) => `<button role="tab" class="${consultaTab === k ? 'on' : ''}" data-ctab="${k}" aria-selected="${consultaTab === k}">${esc(l)}</button>`).join('')}</div>
    ${body}`;
}

function viewTeoria() {
  return `<ul class="clist">${TEORIA.secciones.map(s => {
    const suyas = CARDS.filter(c => c.teoria === s.id);
    return `<li><details><summary>${esc(s.titulo)}</summary>
      ${s.imagen ? `<div class="fig-wrap small">${figura(s.imagen)}</div>` : ''}
      <div class="teoria">${md(s.contenido)}</div>
      ${suyas.length ? `<button class="btn ghost" data-practicar="${esc(s.id)}">Practicar estas ${suyas.length}</button>` : ''}
    </details></li>`;
  }).join('')}</ul>`;
}

function viewListaTarjetas() {
  if (!consultaBlock || !BLOCKS.some(b => b.id === consultaBlock)) consultaBlock = BLOCKS[0].id;
  const b = BLOCKS.find(x => x.id === consultaBlock);
  const cards = CARDS.filter(c => c.block === consultaBlock);
  return `<label class="sel-label">${esc(CFG.etiquetaBloque || 'Bloque')} <select id="cblock">${BLOCKS.map(x => `<option value="${x.id}" ${x.id === consultaBlock ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label>
    <p class="count-line">${cards.length} tarjetas en ${esc(b.name.toLowerCase())}</p>
    <ul class="clist">${cards.map(c => {
      const st = S.cards[c.id];
      const q = c.fig ? `${c.q} (con imagen)` : (c.title ? `${c.title}: ${c.q}` : c.q);
      return `<li><details><summary>${esc(q)}${st ? `<span class="lvl" title="Nivel de repaso">${st.l}</span>` : ''}</summary>
        ${c.fig ? `<div class="fig-wrap small">${figura(c.fig)}</div>` : ''}<p class="ans">${esc(c.answer)}</p></details></li>`;
    }).join('')}</ul>`;
}

// ---- utilidades de presentación compartidas con el tema ----
function legend(items) { return `<p class="legend">${items.map(([c, t]) => `<span><i class="${c}"></i>${t}</span>`).join('')}</p>`; }

function figura(spec) {
  if (TEMA.figura) { const html = TEMA.figura(spec); if (html) return html; }
  if (typeof spec === 'string') return `<button class="mimg-btn" data-zoom="${esc(spec)}" aria-label="Ampliar imagen"><img src="${esc(spec)}" alt="" loading="lazy"></button>`;
  return '';
}

function md(txt) {
  const lineas = String(txt || '').split('\n');
  let html = '', lista = null;
  const enLinea = t => esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>');
  const cerrar = () => { if (lista) { html += `</${lista}>`; lista = null; } };
  for (const ln of lineas) {
    const l = ln.trim();
    if (!l) { cerrar(); continue; }
    if (/^##\s+/.test(l)) { cerrar(); html += `<h3>${enLinea(l.replace(/^##\s+/, ''))}</h3>`; }
    else if (/^[-\u2022]\s+/.test(l)) { if (lista !== 'ul') { cerrar(); html += '<ul>'; lista = 'ul'; } html += `<li>${enLinea(l.replace(/^[-\u2022]\s+/, ''))}</li>`; }
    else if (/^\d+[.)]\s+/.test(l)) { if (lista !== 'ol') { cerrar(); html += '<ol>'; lista = 'ol'; } html += `<li>${enLinea(l.replace(/^\d+[.)]\s+/, ''))}</li>`; }
    else { cerrar(); html += `<p>${enLinea(l)}</p>`; }
  }
  cerrar();
  return html;
}
// ---- Progreso ----
function viewProgress() {
  const t = todayKey();
  const days = [...Array(14)].map((_, i) => addDays(t, i - 13));
  const maxN = Math.max(10, ...days.map(d => (S.history[d] || {}).n || 0));
  const fc = [...Array(7)].map((_, i) => {
    const d = addDays(t, i + 1);
    return [d, CARDS.filter(c => enabled(c) && S.cards[c.id] && S.cards[c.id].due === d).length];
  });
  const maxF = Math.max(5, ...fc.map(x => x[1]));
  const wd = d => new Date(d + 'T12:00').toLocaleDateString('es-ES', { weekday: 'narrow' });
  let R = 0, W = 0;
  Object.values(S.cards).forEach(s => { R += s.r; W += s.w; });
  const failed = Object.entries(S.cards).filter(([id, s]) => s.w > 0 && CARD[id]).sort((a, b) => b[1].w - a[1].w || a[1].l - b[1].l).slice(0, 12);
  return `<h1 class="page-title">Progreso</h1>
  <section class="kpis">
    <div><span class="n">${streak()}</span><span class="l">racha (días)</span></div>
    <div><span class="n">${Object.keys(S.cards).length}</span><span class="l">tarjetas vistas</span></div>
    <div><span class="n">${R + W ? Math.round(100 * R / (R + W)) : 0} %</span><span class="l">aciertos totales</span></div>
  </section>
  <section class="card-sec"><h2 class="sec-title">Últimos 14 días</h2>
    <div class="bars">${days.map(d => { const h = S.history[d] || { n: 0, ok: 0 }; return `<div class="bar" title="${d}: ${h.n} respondidas"><span class="b-all" style="height:${100 * h.n / maxN}%"><span class="b-ok" style="height:${h.n ? 100 * h.ok / h.n : 0}%"></span></span><i>${wd(d)}</i></div>`; }).join('')}</div>
    <p class="note">Altura: tarjetas respondidas. Parte oscura: acertadas a la primera.</p></section>
  <section class="card-sec"><h2 class="sec-title">Repasos de los próximos 7 días</h2>
    <div class="bars">${fc.map(([d, n]) => `<div class="bar" title="${d}: ${n}"><em>${n || ''}</em><span class="b-fc" style="height:${85 * n / maxF}%"></span><i>${wd(d)}</i></div>`).join('')}</div></section>
  <section class="card-sec"><h2 class="sec-title">Por bloque</h2>
    <ul class="blocks">${BLOCKS.map(b => {
      const cs = CARDS.filter(c => c.block === b.id);
      const seen = cs.filter(c => S.cards[c.id]);
      let r = 0, w = 0; seen.forEach(c => { r += S.cards[c.id].r; w += S.cards[c.id].w; });
      const p = r + w ? Math.round(100 * r / (r + w)) : null;
      return `<li class="${S.settings.blocks[b.id] === false ? 'off' : ''}"><div class="b-top"><span>${b.name}</span><span class="b-num">${seen.length}/${cs.length}${p !== null ? `, ${p} %` : ''}</span></div>
        <div class="meter"><span style="width:${100 * seen.length / cs.length}%" class="${p === null ? '' : p >= 85 ? 'g' : p >= 60 ? 'y' : 'r'}"></span></div></li>`;
    }).join('')}</ul></section>
  <section class="card-sec"><h2 class="sec-title">Las que más fallas</h2>
    ${failed.length ? `<ul class="clist">${failed.map(([id, s]) => { const c = CARD[id]; return `<li><details><summary>${esc(c.title ? `${c.title}: ${c.q}` : c.q)}<span class="fails">${s.w}×</span></summary>${c.fig ? `<div class="fig-wrap small">${figura(c.fig)}</div>` : ''}<p class="ans">${esc(c.answer)}</p></details></li>`; }).join('')}</ul>`
      : '<p class="note">Aquí aparecerán las tarjetas que falles, para repasarlas de un vistazo.</p>'}</section>`;
}

// ---- Ajustes ----
function viewSettings() {
  return `<h1 class="page-title">Ajustes</h1>
  <section class="card-sec"><h2 class="sec-title">Tarjetas nuevas por día</h2>
    <div class="stepper"><button class="icon-btn" id="pd-" aria-label="Menos">−</button><span class="pd">${S.settings.perDay}</span><button class="icon-btn" id="pd+" aria-label="Más">+</button></div>
    <p class="note">Si un día no estudias, las nuevas de ese día se suman al siguiente. Los repasos que tocan se añaden siempre. El día cambia a las 4:00.</p></section>
  <section class="card-sec"><h2 class="sec-title">Forma de responder</h2>
    <ul class="toggles"><li><label><span>Pensar antes de ver las opciones</span>
      <input type="checkbox" id="think" ${S.settings.thinkFirst ? 'checked' : ''}><i class="sw"></i></label></li></ul>
    <p class="note">Las opciones aparecen al pulsar «Mostrar opciones».</p></section>
  <section class="card-sec"><h2 class="sec-title">Bloques activos</h2>
    <ul class="toggles">${BLOCKS.map(b => `<li><label><span>${b.name} <small>${CARDS.filter(c => c.block === b.id).length}</small></span>
      <input type="checkbox" data-blk="${b.id}" ${S.settings.blocks[b.id] !== false ? 'checked' : ''}><i class="sw"></i></label></li>`).join('')}</ul>
    <p class="note">Desactivar un bloque lo retira de las sesiones sin borrar tu progreso.</p></section>
  <section class="card-sec"><h2 class="sec-title">Apariencia</h2>
    <div class="seg-ctrl">${[['auto', 'Automática'], ['light', 'Clara'], ['dark', 'Oscura']].map(([k, l]) => `<button data-theme-set="${k}" class="${S.settings.theme === k ? 'on' : ''}">${l}</button>`).join('')}</div></section>
  <section class="card-sec"><h2 class="sec-title">Copia de seguridad</h2>
    <p class="note">Tu progreso solo se guarda en este dispositivo. Exporta una copia de vez en cuando o antes de cambiar de móvil.</p>
    <div class="row-btns"><button class="btn ghost" id="exp">Exportar progreso</button><label class="btn ghost file">Importar progreso<input type="file" id="imp" accept="application/json,.json"></label></div>
    <p class="msg" id="msg" role="status"></p></section>
  <section class="card-sec"><h2 class="sec-title">Reiniciar</h2>
    <button class="btn danger" id="reset">Borrar todo el progreso</button></section>
  <section class="card-sec about"><h2 class="sec-title">Fuentes</h2>
    ${(CFG.fuentes || []).map(f => `<p class="note">${md(f).replace(/^<p>|<\/p>$/g, '')}</p>`).join('')}
    <p class="note">${CARDS.length} tarjetas. Versión ${esc(CFG.version || '1.0')}.</p></section>`;
}

function bindCommon() {
  document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); window.scrollTo(0, 0); });
  const st = $('#start'); if (st) st.onclick = () => startSession();
  const mo = $('#more'); if (mo) mo.onclick = () => startSession(10);
  document.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => { segSel = segSel === b.dataset.seg ? null : b.dataset.seg; render(); });
  // consulta
  document.querySelectorAll('[data-ctab]').forEach(b => b.onclick = () => { consultaTab = b.dataset.ctab; render(); });
  const cb = $('#cblock'); if (cb) cb.onchange = () => { consultaBlock = cb.value; render(); };
  document.querySelectorAll('[data-practicar]').forEach(b => b.onclick = () => {
    const ids = CARDS.filter(c => c.teoria === b.dataset.practicar).map(c => c.id);
    if (ids.length) { session = { queue: shuffle(ids), idx: 0, firstOk: 0, firstN: 0, seen: new Set(), retries: {}, total: ids.length, suelta: true }; showCard(); }
  });
  if (TEMA.consulta?.bind) TEMA.consulta.bind(render);
  // ajustes
  const pdm = $('#pd-'), pdp = $('#pd\\+');
  if (pdm) pdm.onclick = () => { S.settings.perDay = Math.max(1, S.settings.perDay - 1); save(); render(); };
  if (pdp) pdp.onclick = () => { S.settings.perDay = Math.min(50, S.settings.perDay + 1); save(); render(); };
  document.querySelectorAll('[data-blk]').forEach(i => i.onchange = () => { S.settings.blocks[i.dataset.blk] = i.checked; save(); });
  const th = $('#think'); if (th) th.onchange = () => { S.settings.thinkFirst = th.checked; save(); };
  document.querySelectorAll('[data-theme-set]').forEach(b => b.onclick = () => { S.settings.theme = b.dataset.themeSet; save(); render(); });
  const ex = $('#exp');
  if (ex) ex.onclick = () => {
    const blob = new Blob([JSON.stringify({ app: CFG.id, exported: new Date().toISOString(), state: S }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `${CFG.id}-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    $('#msg').textContent = 'Copia exportada.';
  };
  const im = $('#imp');
  if (im) im.onchange = async () => {
    const f = im.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const st = data.state || data;
      if (!st.cards || !st.settings) throw new Error();
      if (!confirm('Se sustituirá el progreso actual por el de la copia. ¿Continuar?')) return;
      S = Object.assign(defaultState(), st);
      S.settings = Object.assign(defaultState().settings, st.settings);
      await save(); render(); $('#msg').textContent = 'Progreso importado.';
    } catch (e) { $('#msg').textContent = `El archivo no es una copia válida de ${CFG.nombre}.`; }
  };
  const rs = $('#reset');
  if (rs) rs.onclick = async () => {
    if (!confirm('Se borrará todo tu progreso. Esta acción no se puede deshacer. ¿Continuar?')) return;
    const theme = S.settings.theme;
    S = defaultState(); S.settings.theme = theme; grantDaily(); await save(); render();
  };
}

function applyTheme() {
  const t = S.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = dark ? (CFG.colores?.papelOscuro || '#101827') : (CFG.colores?.papel || '#F1F4F7');
}

// ---------- arranque ----------
// Ampliar imagen
document.addEventListener('click', e => {
  const b = e.target.closest('[data-zoom]');
  if (b) {
    const ov = document.createElement('div');
    ov.className = 'lightbox';
    ov.innerHTML = `<button class="icon-btn lb-close" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="lb-scroll"><img src="${b.dataset.zoom}" alt=""></div>`;
    ov.onclick = ev => { if (ev.target === ov || ev.target.closest('.lb-close')) ov.remove(); };
    document.body.appendChild(ov);
    ov.querySelector('.lb-close').focus();
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('.lightbox')?.remove(); });

async function cargarJSON(ruta) {
  const r = await fetch(ruta, { cache: 'no-cache' });
  if (!r.ok) throw new Error('No se pudo cargar ' + ruta);
  return r.json();
}

// tema.js llama a esto al final
async function iniciar(tema) {
  TEMA = tema;
  CFG = await cargarJSON('config.json');
  CFG.almacen = CFG.almacen || { db: CFG.id, prefijo: CFG.id + ':' };
  document.title = CFG.nombre;
  for (const [k, v] of Object.entries(CFG.colores || {})) {
    const varName = { papel: '--paper', tinta: '--ink', acento: '--accent', acentoSuave: '--accent-soft', azul: '--blue' }[k];
    if (varName) document.documentElement.style.setProperty(varName, v);
  }
  BLOCKS = TEMA.bloques || CFG.bloques;   // un tema simple los declara en config.json
  if (CFG.modulos?.teoria) { try { TEORIA = await cargarJSON('teoria.json'); } catch (e) { TEORIA = null; } }
  if (TEMA.preparar) await TEMA.preparar({ cargarJSON });
  CARDS = await TEMA.construirTarjetas({ cargarJSON, tarjetasDesdeBanco });
  CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));
  CURRICULUM = curriculum();
  await arrancar();
}

async function arrancar() {
  await Store.open();
  const loaded = await Store.get('state');
  S = Object.assign(defaultState(), loaded || {});
  S.settings = Object.assign(defaultState().settings, (loaded || {}).settings || {});
  S.settings.blocks = Object.assign(defaultState().settings.blocks, S.settings.blocks || {});
  grantDaily();
  await save();
  render();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => render());
  // al volver a la app otro día, recalcular
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !session) { grantDaily(); save(); render(); }
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
}
