'use strict';
/* =====================================================================
   ¡MULTIPLICAMOS! · app.js
   Aplicación para 2.º grado basada en la ejercitación de la docente.

   CONTENIDO
   1. Utilidades
   2. Ayudantes para dibujar (grupos, dados, tablas)
   3. MÓDULOS Y PREGUNTAS  ← acá se editan las actividades
   4. Estado y almacenamiento (localStorage)
   5. Navegación, personaje y ventanas
   6. Mapa y módulos
   7. Motor de actividades (casilleros, opciones, comprobar)
   8. Tipos especiales: agrupar, unir, tabla pitagórica
   9. Recompensas, celebraciones y diploma
   10. Inicio

   CÓMO EDITAR UNA PREGUNTA
   • En los textos de las líneas, [12] crea un casillero cuya respuesta
     correcta es 12.  Ej.: { t: '4 + 4 = [8]' }
   • { mult: [4, 3] } crea «[ ] × [ ] = [ ]» y acepta 4 × 3 o 3 × 4.
   • { choice: { opts: ['a', 'b'], ok: [0] } } crea opciones (la 0 es la
     correcta). Con multi: true se pueden elegir varias.
   • El nivel con hints: true muestra pistas desde el comienzo.
   ===================================================================== */

/* ---------- 1. UTILIDADES ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** "4 + 4 + 4": el número num repetido times veces */
const sumText = (times, num) => Array(times).fill(num).join(' + ');
/** Igual, pero cada sumando es un casillero: "[4] + [4] + [4]" */
const sumBlanks = (times, num) => Array(times).fill(`[${num}]`).join(' + ');

/* ---------- 2. AYUDANTES PARA DIBUJAR ---------- */

// Ícono que acompaña a cada tipo de recipiente
const CONT = {
  caja: '📦', bolsa: '🛍️', paquete: '🎁', bandeja: '🍽️', arbol: '🌳',
  corral: '🪵', mesa: '🪑', plato: '🍽️', florero: '🏺', maceta: '🪴'
};

/** Dibuja g recipientes con c objetos cada uno. showCount muestra la pista con el número. */
function groupsHTML(g, c, emoji, cont, showCount) {
  const cols  = g <= 4 ? g : Math.ceil(g / 2);
  const icols = c <= 3 ? c : Math.ceil(c / 2);
  // tamaño de los dibujos según el espacio disponible (panel de ~760 × 400)
  const rowsCards = Math.ceil(g / cols), irows = Math.ceil(c / icols);
  const cardW = (760 - (cols - 1) * 22) / cols, cardH = (390 - (rowsCards - 1) * 26) / rowsCards;
  const size = Math.floor(Math.min(c <= 2 ? 64 : c <= 4 ? 56 : 46, (cardW - 36) / icols / 1.1, (cardH - 34) / irows / 1.2));
  let h = `<div class="groups" style="grid-template-columns:repeat(${cols},auto)">`;
  for (let i = 0; i < g; i++) {
    h += `<div class="grp grp-${cont}" style="animation-delay:${i * 0.07}s">
            <span class="grp-tag">${CONT[cont] || ''}</span>
            <div class="grp-items" style="grid-template-columns:repeat(${icols},auto);font-size:${size}px">${`<span>${emoji}</span>`.repeat(c)}</div>
            ${showCount ? `<span class="grp-count">${c}</span>` : ''}
          </div>`;
  }
  return h + '</div>';
}

/** Grupos chiquitos en una sola línea (para opciones y lecciones) */
function miniGroups(g, c, emoji) {
  return `<div class="mini">${Array(g).fill(`<span class="mg">${emoji.repeat(c)}</span>`).join('')}</div>`;
}

/** Dados con n puntitos */
const PIPS = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
const DIE_COLORS = ['#ff7a59', '#8e6cf0', '#1fb5a8', '#f5a623', '#ff6fae', '#4aa3ff'];
function diceHTML(g, c, showCount) {
  let h = '<div class="dice">';
  for (let i = 0; i < g; i++) {
    let pips = '';
    for (let p = 1; p <= 9; p++) pips += `<span class="${PIPS[c].includes(p) ? 'pip' : ''}"></span>`;
    h += `<div class="die-wrap" style="animation-delay:${i * 0.08}s">
            <div class="die" style="--dc:${DIE_COLORS[i % 6]}">${pips}</div>
            ${showCount ? `<span class="grp-count">${c}</span>` : ''}
          </div>`;
  }
  return h + '</div>';
}

/** Suma grande con fichas: 3 + 3 + 3 */
function bigSumHTML(times, num) {
  return `<div class="bigsum">${Array(times).fill(`<span class="addend">${num}</span>`).join('<span class="plus">+</span>')}</div>`;
}

/** Tabla pitagórica de 10 × 10 */
function pitaHTML(rows = 10, cols = 10, cls = 'pita') {
  let h = `<table class="${cls}"><tr><th class="corner">×</th>`;
  for (let c = 1; c <= cols; c++) h += `<th data-c="${c}">${c}</th>`;
  h += '</tr>';
  for (let r = 1; r <= rows; r++) {
    h += `<tr><th data-r="${r}">${r}</th>`;
    for (let c = 1; c <= cols; c++) h += `<td data-r="${r}" data-c="${c}">${r * c}</td>`;
    h += '</tr>';
  }
  return h + '</table>';
}

/** Tabla «contar multiplicando» (motos y ruedas, etc.) */
function rowTableHTML(o, showHint) {
  const nums = [...Array(10)].map((_, i) => i + 1);
  return `<div class="rowtab">
    ${showHint ? `<div class="rt-hint">1 ${o.e} → ${o.pe.repeat(o.k)} = ${o.k} ${o.part.toLowerCase()}</div>` : ''}
    <table class="rt">
      <tr><th>${o.e} ${o.obj}</th>${nums.map(n => `<td class="head">${n}</td>`).join('')}</tr>
      <tr><th>${o.pe} ${o.part}</th>${nums.map(n => o.blanks.includes(n)
          ? `<td><span class="blank" data-ans="${n * o.k}"></span></td>`
          : `<td>${n * o.k}</td>`).join('')}</tr>
      <tr><th>✖️ Cuenta</th>${nums.map(n => `<td class="cta">${n}×${o.k}</td>`).join('')}</tr>
    </table></div>`;
}

/** Opciones de suma reiterada: la correcta y dos parecidas */
function sumChoice(g, c) {
  return { opts: [sumText(g, c), sumText(g + 1, c), sumText(g, c + 1)], ok: [0] };
}

/* ---------- 3. MÓDULOS Y PREGUNTAS ---------- */

/* Constructores de preguntas (para no repetir código) */

// Módulo 1 · Nivel 1: cajas de golosinas, sumar los sumandos
function itemCajas(o) {
  return {
    prompt: `${o.text} <b>${o.q}</b>`,
    visual: h => groupsHTML(o.g, o.c, o.e, o.cont, h),
    lines: [{ label: 'Cálculo', t: `${sumBlanks(o.g, o.c)} = [${o.g * o.c}]` }],
    help: `Contá cuántos ${o.n} hay en ${o.una}. ¡Todos tienen la misma cantidad! Escribí ese número en cada casillero y después sumá.`,
    hint: `Cada ${o.cs} tiene ${o.c} ${o.n}. Escribí ${o.c} en cada casillero y sumá contando de ${o.c} en ${o.c}.`
  };
}

// Módulo 1 · Nivel 2: agrupar tocando
function itemAgrupar(o) {
  const g = o.total / o.size;
  return {
    type: 'group',
    group: { size: o.size },
    prompt: `Agrupá los ${o.n} de a <b>${o.size}</b>. Tocalos uno por uno y se van armando los grupos.`,
    visual: () => {
      let h = '<div class="grouping"><div class="mesa">';
      for (let i = 0; i < o.total; i++) h += `<button class="candy" style="--r:${Math.round(Math.random() * 30 - 15)}deg">${o.e}</button>`;
      return h + '</div><div class="gbins"></div><button class="btn small ghost regroup">↺ Empezar de nuevo</button></div>';
    },
    lines: [
      { t: `¿Cuántos ${o.n} hay en total? [${o.total}]` },
      { t: `¿Cuántos grupos formaste? [${g}]` },
      { t: `¿Cuántos hay en cada grupo? [${o.size}]` },
      { label: 'Completá la suma', t: `${sumText(g, o.size)} = [${o.total}]` }
    ],
    hint: `Contá los grupos que armaste. En cada grupo hay ${o.size} ${o.n}.`
  };
}

// Módulo 1 · Nivel 3: elegir la suma reiterada
function itemQueSuma(o) {
  return {
    prompt: `${o.text} <b>¿Qué suma reiterada lo muestra?</b>`,
    visual: () => groupsHTML(o.g, o.c, o.e, o.cont, false),
    lines: [
      { label: 'Elegí la suma', choice: sumChoice(o.g, o.c) },
      { t: `En total hay [${o.g * o.c}] ${o.n}.` }
    ],
    hint: `El número que se repite es la cantidad de ${o.n} de ${o.una}. Se repite una vez por cada ${o.cs}.`
  };
}

// Módulo 2 · Nivel 1: dados
function itemDados(g, c) {
  return {
    prompt: 'Mirá los dados. <b>Escribí la suma y la multiplicación.</b>',
    visual: h => diceHTML(g, c, h),
    lines: [
      { label: 'Suma reiterada', t: `${sumBlanks(g, c)} = [${g * c}]` },
      { label: '¿Cuántas veces?', t: `[${g}] veces [${c}]` },
      { label: 'Multiplicación', mult: [g, c] }
    ],
    help: 'Contá los puntitos de un dado: ese número se repite. Contá cuántos dados hay: esas son las veces. Por ejemplo, «5 veces 2» se escribe 5 × 2.',
    hint: `Hay ${g} dados: son las veces. Cada dado tiene ${c} puntitos: ese es el número que se repite.`
  };
}

// Módulo 2 · Nivel 3: escribir la multiplicación de una suma
function itemEscribir(g, c) {
  return {
    prompt: '<b>Escribí en forma de multiplicación</b> esta suma.',
    visual: () => bigSumHTML(g, c),
    lines: [
      { label: '¿Cuántas veces se repite?', t: `[${g}] veces [${c}]` },
      { label: 'Multiplicación', mult: [g, c] }
    ],
    hint: `Contá cuántas veces aparece el ${c} en la suma. Ese número va en las «veces».`
  };
}

// Módulo 3 · Nivel 1: tabla para contar multiplicando
function itemFila(o) {
  return {
    prompt: `Contamos multiplicando. <b>¿Cuántas ${o.part.toLowerCase()} hay?</b>`,
    visual: h => rowTableHTML(o, h),
    note: `Completá los casilleros vacíos de la fila de <b>${o.part.toLowerCase()}</b>. La fila de abajo te muestra la cuenta.`,
    lines: [],
    help: `Cada ${o.uno} tiene ${o.k} ${o.part.toLowerCase()}. Cada vez que agregás uno, sumás ${o.k}. ¡Contá de ${o.k} en ${o.k}!`,
    hint: `Mirá la cuenta de abajo, por ejemplo 5 × ${o.k}. Podés sumar ${o.k} al casillero anterior.`
  };
}

// Módulo 3 · Nivel 2: tabla pitagórica
function itemPita(a, b) {
  return {
    type: 'tabla',
    tabla: [a, b],
    prompt: `Usá la tabla pitagórica para resolver <b>${a} × ${b}</b>.`,
    visual: () => pitaHTML(),
    note: `Buscá el <b>${a}</b> en la columna de la izquierda y el <b>${b}</b> en la fila de arriba. Tocá el casillero donde se cruzan.`,
    lines: [{ t: `${a} × ${b} = [${a * b}]` }],
    hint: `Te pinté la fila del ${a} y la columna del ${b}. El resultado está donde se cruzan.`
  };
}

// Módulo 3 · Nivel 3: una multiplicación, dos sumas (4 × 5 = 4+4+4+4+4 y 5+5+5+5)
function itemDosSumas(a, b) {
  return {
    prompt: `<b>${a} × ${b}</b> se puede escribir con dos sumas distintas. ¡Encontralas!`,
    visual: () => `<div class="vis-col">
        <div class="bigmul">${a} × ${b}</div>
        <div class="example"><small>Ejemplo</small>4 × 5 = 4 + 4 + 4 + 4 + 4 &nbsp;y&nbsp; 5 + 5 + 5 + 5</div>
      </div>`,
    lines: [
      { label: 'Elegí las DOS sumas correctas', choice: { multi: true, ok: [0, 1],
        opts: [sumText(b, a), sumText(a, b), sumText(b + 1, a), sumText(a === 2 ? 3 : a - 1, b)] } },
      { label: 'Resultado', t: `${a} × ${b} = [${a * b}]` }
    ],
    hint: `Podés repetir el ${a} ${b} veces, o repetir el ${b} ${a} veces. Contá cuántos números tiene cada suma.`
  };
}

// Módulo 4: problemas
function itemProblema(o, mode) {
  const lines = [];
  if (mode === 'suma') lines.push({ label: 'Suma reiterada', choice: sumChoice(o.g, o.c) });
  if (mode === 'veces') lines.push({ label: 'Veces', t: `[${o.g}] veces [${o.c}] = [${o.g * o.c}]` });
  lines.push({ label: 'Multiplicación', mult: [o.g, o.c] });
  lines.push({ label: 'Respuesta', t: o.ans });
  return {
    prompt: o.text,
    visual: h => groupsHTML(o.g, o.c, o.e, o.cont, h),
    lines,
    help: 'Primero contá cuántos grupos hay. Después mirá cuántos hay en cada grupo (el número de la etiqueta te ayuda).',
    hint: `Hay ${o.g} ${o.cp}: son los grupos. En cada ${o.cs} hay ${o.c}.`
  };
}

// Módulo 4 · Nivel 3: ¿qué dibujo muestra la multiplicación?
function itemDibujo(g, c, e) {
  return {
    prompt: `¿Qué dibujo muestra <b>${g} × ${c}</b>? Tocalo.`,
    // las opciones con dibujos van en el panel grande
    visual: () => `<div class="vis-col"><div class="bigmul small">${g} × ${c}</div>
      ${lineHTML({ choice: { pics: true, ok: [0],
        opts: [miniGroups(g, c, e), miniGroups(g, c + 1, e), miniGroups(g + 1, c, e)] } })}</div>`,
    note: `<b>Recordá:</b> ${g} × ${c} es «${g} veces ${c}»: ${g} grupos con ${c} en cada uno.`,
    lines: [{ label: 'Resultado', t: `${g} × ${c} = [${g * c}]` }],
    hint: `Buscá el dibujo que tiene ${g} grupos y ${c} en cada grupo.`
  };
}

const MODULES = [
  /* ===== MÓDULO 1 ===== */
  {
    id: 'm1', name: 'Agrupamos y sumamos', icon: '🍬', color: '#ff7a59',
    badge: { icon: '🌟', name: 'Estrella de los grupos' },
    lesson: {
      title: '¡Descubrimos algo nuevo!',
      html: () => `<div class="lesson">
        <p>Cuando sumamos varias veces <b>el mismo número</b>, hacemos una <b class="hlw">suma reiterada</b>.</p>
        <div class="lesson-ex">${miniGroups(4, 3, '🍬')}</div>
        <p class="lesson-big">3 + 3 + 3 + 3 = 12</p>
        <p>Son <b>4 grupos de 3</b> caramelos.</p></div>`
    },
    acts: [
      { id: 'm1a1', title: 'Cajas de golosinas', icon: '📦', hints: true, items: [
        itemCajas({ g: 4, c: 3, e: '🍫', cont: 'caja', n: 'turrones', una: 'una caja', cs: 'caja',
          text: 'Leo, el kiosquero, recibió 4 cajas con 3 turrones cada una.', q: '¿Cuántos turrones tiene?' }),
        itemCajas({ g: 4, c: 5, e: '🍭', cont: 'caja', n: 'chupetines', una: 'una caja', cs: 'caja',
          text: 'Luego recibió 4 cajas con 5 chupetines cada una.', q: '¿Cuántos chupetines tiene?' }),
        itemCajas({ g: 3, c: 2, e: '🍬', cont: 'caja', n: 'caramelos', una: 'una caja', cs: 'caja',
          text: 'Llegaron 3 cajas con 2 caramelos cada una.', q: '¿Cuántos caramelos hay?' }),
        itemCajas({ g: 5, c: 2, e: '🧃', cont: 'caja', n: 'jugos', una: 'una caja', cs: 'caja',
          text: 'Leo acomoda 5 cajas con 2 jugos cada una.', q: '¿Cuántos jugos hay?' }),
        itemCajas({ g: 2, c: 4, e: '🍪', cont: 'paquete', n: 'galletitas', una: 'un paquete', cs: 'paquete',
          text: 'Hay 2 paquetes con 4 galletitas cada uno.', q: '¿Cuántas galletitas hay?' })
      ]},
      { id: 'm1a2', title: 'Hacemos grupos', icon: '⭕', hints: false, items: [
        itemAgrupar({ total: 12, size: 3, e: '🍬', n: 'caramelos' }),
        itemAgrupar({ total: 10, size: 2, e: '🍭', n: 'chupetines' }),
        itemAgrupar({ total: 15, size: 5, e: '🍓', n: 'frutillas' }),
        itemAgrupar({ total: 8, size: 4, e: '🍩', n: 'donas' })
      ]},
      { id: 'm1a3', title: '¿Qué suma es?', icon: '🤔', hints: false, items: [
        itemQueSuma({ g: 3, c: 4, e: '🍎', cont: 'bolsa', n: 'manzanas', una: 'una bolsa', cs: 'bolsa',
          text: 'Hay 3 bolsas con 4 manzanas cada una.' }),
        itemQueSuma({ g: 5, c: 3, e: '⚽', cont: 'caja', n: 'pelotas', una: 'una caja', cs: 'caja',
          text: 'Hay 5 cajas con 3 pelotas cada una.' }),
        itemQueSuma({ g: 2, c: 6, e: '🥚', cont: 'caja', n: 'huevos', una: 'una caja', cs: 'caja',
          text: 'Hay 2 cajas con 6 huevos cada una.' }),
        itemQueSuma({ g: 4, c: 2, e: '🧦', cont: 'paquete', n: 'medias', una: 'un paquete', cs: 'paquete',
          text: 'Hay 4 paquetes con 2 medias cada uno.' }),
        itemQueSuma({ g: 3, c: 5, e: '🌸', cont: 'maceta', n: 'flores', una: 'una maceta', cs: 'maceta',
          text: 'Hay 3 macetas con 5 flores cada una.' })
      ]}
    ]
  },

  /* ===== MÓDULO 2 ===== */
  {
    id: 'm2', name: 'De la suma a la multiplicación', icon: '✖️', color: '#8e6cf0',
    badge: { icon: '🪄', name: 'Varita del por' },
    lesson: {
      title: 'Aprendemos un poquito más…',
      html: () => `<div class="lesson">
        <p>Una <b class="hlw">multiplicación</b> es una forma corta de escribir una suma de números iguales.</p>
        <div class="lesson-ex">${miniGroups(5, 4, '🔵')}</div>
        <p class="lesson-big">4 + 4 + 4 + 4 + 4 = 5 × 4 = 20</p>
        <p>El 4 se repite <b>5 veces</b>: «5 veces 4» se escribe <b>5 × 4</b>. ¡También se puede escribir 4 × 5, da lo mismo!</p>
        <p>El signo <b>×</b> se lee <b>«por»</b>: 5 × 4 → «cinco por cuatro».</p></div>`
    },
    acts: [
      { id: 'm2a1', title: 'Grupos de dados', icon: '🎲', hints: true, items: [
        itemDados(3, 4), itemDados(2, 5), itemDados(3, 2), itemDados(2, 6), itemDados(4, 3)
      ]},
      { id: 'm2a2', title: 'Unimos suma y multiplicación', icon: '🔗', hints: false, items: [
        { type: 'match', prompt: '<b>Uní cada suma con su multiplicación.</b>',
          note: 'Tocá una suma y después la multiplicación que le corresponde.',
          pairs: [[sumText(4, 3), '4 × 3'], [sumText(6, 2), '6 × 2'], [sumText(5, 4), '5 × 4'], [sumText(3, 5), '3 × 5']],
          hint: 'Contá cuántas veces se repite el número en la suma.' },
        { type: 'match', prompt: '<b>Uní cada suma con su multiplicación.</b>',
          note: 'Tocá una suma y después la multiplicación que le corresponde.',
          pairs: [[sumText(6, 6), '6 × 6'], [sumText(4, 7), '4 × 7'], [sumText(2, 9), '2 × 9'], [sumText(3, 8), '3 × 8']],
          hint: 'Contá cuántas veces se repite el número en la suma.' }
      ]},
      { id: 'm2a3', title: 'Escribimos la multiplicación', icon: '✏️', hints: false, items: [
        itemEscribir(7, 2), itemEscribir(6, 5), itemEscribir(5, 7),
        itemEscribir(4, 9), itemEscribir(8, 3), itemEscribir(3, 6)
      ]}
    ]
  },

  /* ===== MÓDULO 3 ===== */
  {
    id: 'm3', name: 'Contamos multiplicando', icon: '🔢', color: '#1fb5a8',
    badge: { icon: '🧭', name: 'Brújula de las tablas' },
    lesson: {
      title: 'Contar multiplicando',
      html: () => `<div class="lesson">
        <p>Para contar más rápido podemos <b class="hlw">contar multiplicando</b>: 1 moto tiene 2 ruedas, 2 motos tienen 4, 3 motos tienen 6…</p>
        <p>La <b>tabla pitagórica</b> nos ayuda a multiplicar: buscamos un número en la columna de la izquierda y otro en la fila de arriba. ¡Donde se cruzan está el resultado!</p>
        ${pitaHTML(4, 5, 'pita mini-pita').replace('data-r="3" data-c="4">', 'data-r="3" data-c="4" class="sel">')}
        <p style="text-align:center"><b>3 × 4 = 12</b></p></div>`
    },
    acts: [
      { id: 'm3a1', title: 'Ruedas, asientos y hojas', icon: '🏍️', hints: true, items: [
        itemFila({ obj: 'Motos', e: '🏍️', part: 'Ruedas', pe: '🛞', k: 2, uno: 'moto', blanks: [4, 5, 7, 9] }),
        itemFila({ obj: 'Hamacas', e: '🎠', part: 'Asientos', pe: '🪑', k: 3, uno: 'hamaca', blanks: [3, 5, 6, 8] }),
        itemFila({ obj: 'Anafes', e: '🍳', part: 'Hornallas', pe: '🔥', k: 4, uno: 'anafe', blanks: [3, 4, 6, 10] }),
        itemFila({ obj: 'Macetas', e: '🪴', part: 'Hojas', pe: '🍃', k: 5, uno: 'maceta', blanks: [3, 5, 7, 8] })
      ]},
      { id: 'm3a2', title: 'La tabla pitagórica', icon: '🧮', hints: false, items: [
        itemPita(3, 4), itemPita(2, 7), itemPita(5, 6), itemPita(8, 3), itemPita(9, 4), itemPita(6, 6)
      ]},
      { id: 'm3a3', title: 'Una multiplicación, dos sumas', icon: '🔄', hints: false, items: [
        itemDosSumas(3, 7), itemDosSumas(9, 2), itemDosSumas(8, 6),
        itemDosSumas(5, 3), itemDosSumas(2, 6), itemDosSumas(4, 6)
      ]}
    ]
  },

  /* ===== MÓDULO 4 ===== */
  {
    id: 'm4', name: 'Resolvemos problemas', icon: '🧩', color: '#f5a623',
    badge: { icon: '🔍', name: 'Lupa de los problemas' },
    lesson: {
      title: '¡A resolver problemas!',
      html: () => `<div class="lesson"><p>Para resolver un problema de multiplicación:</p>
        <ol class="steps">
          <li>👀 Contá <b>cuántos grupos</b> hay (bolsitas, cajas, mesas…).</li>
          <li>🔢 Contá <b>cuántos hay en cada grupo</b>.</li>
          <li>➕ Escribí la <b>suma reiterada</b>.</li>
          <li>✖️ Escribí la <b>multiplicación</b>.</li>
          <li>💬 Escribí la <b>respuesta</b> completa.</li>
        </ol></div>`
    },
    acts: [
      { id: 'm4a1', title: 'Problemas con pistas', icon: '🛍️', hints: true, items: [
        itemProblema({ g: 3, c: 4, e: '🍬', cont: 'bolsa', cp: 'bolsitas', cs: 'bolsita',
          text: 'Martina tiene 3 bolsitas con 4 caramelos en cada una. <b>¿Cuántos caramelos tiene en total?</b>',
          ans: 'Martina tiene [12] caramelos.' }, 'suma'),
        itemProblema({ g: 5, c: 2, e: '🐰', cont: 'corral', cp: 'corrales', cs: 'corral',
          text: 'En una granja hay 5 corrales con 2 conejos en cada uno. <b>¿Cuántos conejos hay en total?</b>',
          ans: 'En la granja hay [10] conejos.' }, 'suma'),
        itemProblema({ g: 4, c: 3, e: '🧒', cont: 'mesa', cp: 'mesas', cs: 'mesa',
          text: 'En el aula hay 4 mesas con 3 alumnos sentados en cada una. <b>¿Cuántos alumnos hay en total?</b>',
          ans: 'En el aula hay [12] alumnos.' }, 'suma'),
        itemProblema({ g: 2, c: 6, e: '🃏', cont: 'paquete', cp: 'paquetes', cs: 'paquete',
          text: 'Tomás compró 2 paquetes de figuritas. Cada paquete tiene 6 figuritas. <b>¿Cuántas figuritas compró en total?</b>',
          ans: 'Tomás compró [12] figuritas.' }, 'suma')
      ]},
      { id: 'm4a2', title: 'Veces y multiplicación', icon: '🍎', hints: false, items: [
        itemProblema({ g: 4, c: 3, e: '🥪', cont: 'bandeja', cp: 'bandejas', cs: 'bandeja',
          text: 'Luis tiene 4 bandejas con 3 sándwiches en cada una. <b>¿Cuántos sándwiches tiene en total?</b>',
          ans: 'Luis tiene [12] sándwiches.' }, 'veces'),
        itemProblema({ g: 6, c: 5, e: '🍎', cont: 'arbol', cp: 'árboles', cs: 'árbol',
          text: 'Hay 6 árboles y cada árbol tiene 5 manzanas. <b>¿Cuántas manzanas hay en total?</b>',
          ans: 'Hay [30] manzanas.' }, 'veces'),
        itemProblema({ g: 2, c: 6, e: '🍅', cont: 'caja', cp: 'cajas', cs: 'caja',
          text: 'Hay 2 cajas de tomates y en cada una caben 6 tomates. <b>¿Cuántos tomates hay en total?</b>',
          ans: 'Hay [12] tomates.' }, 'veces'),
        itemProblema({ g: 2, c: 5, e: '🥖', cont: 'bolsa', cp: 'bolsas', cs: 'bolsa',
          text: 'Compré 2 bolsas con 5 panes cada una. <b>¿Cuántos panes compré?</b>',
          ans: 'Compré [10] panes.' }, 'veces'),
        itemProblema({ g: 3, c: 2, e: '🍬', cont: 'bolsa', cp: 'bolsas', cs: 'bolsa',
          text: 'Compré 3 bolsas con 2 dulces cada una. <b>¿Cuántos dulces compré?</b>',
          ans: 'Compré [6] dulces.' }, 'veces'),
        itemProblema({ g: 2, c: 3, e: '🥚', cont: 'bolsa', cp: 'bolsas', cs: 'bolsa',
          text: 'Compré 2 bolsas con 3 huevos cada una. <b>¿Cuántos huevos compré?</b>',
          ans: 'Compré [6] huevos.' }, 'veces')
      ]},
      { id: 'm4a3', title: 'Gran desafío final', icon: '🏆', hints: false, items: [
        itemDibujo(3, 5, '⭐'),
        itemProblema({ g: 3, c: 5, e: '✏️', cont: 'caja', cp: 'cajas', cs: 'caja',
          text: 'Hay 3 cajas con 5 lápices cada una. <b>¿Cuántos lápices hay?</b>',
          ans: 'Hay [15] lápices.' }, 'mult'),
        itemProblema({ g: 4, c: 2, e: '🍪', cont: 'plato', cp: 'platos', cs: 'plato',
          text: 'Hay 4 platos con 2 galletitas cada uno. <b>¿Cuántas galletitas hay?</b>',
          ans: 'Hay [8] galletitas.' }, 'mult'),
        itemDibujo(4, 3, '🐟'),
        itemProblema({ g: 5, c: 3, e: '🌷', cont: 'florero', cp: 'floreros', cs: 'florero',
          text: 'Hay 5 floreros con 3 flores cada uno. <b>¿Cuántas flores hay?</b>',
          ans: 'Hay [15] flores.' }, 'mult'),
        itemProblema({ g: 2, c: 6, e: '🍊', cont: 'bolsa', cp: 'bolsas', cs: 'bolsa',
          text: 'Hay 2 bolsas con 6 naranjas cada una. <b>¿Cuántas naranjas hay?</b>',
          ans: 'Hay [12] naranjas.' }, 'mult')
      ]}
    ]
  }
];

/* Mensajes del personaje */
const PRAISE = ['¡Excelente! 🌟', '¡Muy bien! 👏', '¡Genial! Sos un crack de los números. 🎉',
  '¡Bravo! Lo resolviste. 🙌', '¡Increíble! Seguí así. 🚀', '¡Perfecto! ⭐'];
const PAIR_OK = ['¡Esa pareja va! 👏', '¡Correcto! 🌟', '¡Muy bien unidas! 🎯'];
const RETRY = ['¡Casi! 🙂', '¡Buen intento!', 'Mmm… pensemos juntos.'];
const START = ['¡Vamos! Leé con atención y resolvé. 💪', 'Tomate tu tiempo. ¡Vos podés! 🙂',
  '¡A pensar! Mirá bien el dibujo. 👀'];
const MEDALS = ['🥉', '🥈', '🥇'];   // medalla de cada nivel

/* ---------- 4. ESTADO Y ALMACENAMIENTO ---------- */
const STORE_KEY = 'multiplicamos-2grado-v1';

function freshState() {
  // stars: estrellas · prog: preguntas resueltas por actividad · done: actividades completas
  // badges: insignias por módulo · lessons: lecciones vistas · name: nombre para el diploma
  return { stars: 0, prog: {}, done: {}, badges: {}, lessons: {}, name: '' };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? Object.assign(freshState(), JSON.parse(raw)) : freshState();
  } catch (e) { return freshState(); }
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* sin almacenamiento */ }
}
let state = loadState();

const ALL_ACTS    = MODULES.flatMap(m => m.acts);
const TOTAL_ACTS  = ALL_ACTS.length;
const TOTAL_ITEMS = ALL_ACTS.reduce((s, a) => s + a.items.length, 0);
const actsDone    = () => ALL_ACTS.filter(a => state.done[a.id]).length;
const itemsDone   = () => ALL_ACTS.reduce((s, a) => s + Math.min(state.prog[a.id] || 0, a.items.length), 0);
const moduleDone  = mi => MODULES[mi].acts.every(a => state.done[a.id]);
const moduleOpen  = mi => mi === 0 || moduleDone(mi - 1);
const actOpen     = (mi, ai) => moduleOpen(mi) && (ai === 0 || !!state.done[MODULES[mi].acts[ai - 1].id]);
const allDone     = () => MODULES.every((m, i) => moduleDone(i));
const hasProgress = () => state.stars > 0 || actsDone() > 0;

/* ---------- 5. NAVEGACIÓN, PERSONAJE Y VENTANAS ---------- */
let screen = 'home';

function show(id) {
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === 'scr-' + id));
  screen = id;
  const slot = $(`#scr-${id} .mascot-slot`);
  if (slot) slot.appendChild($('#mascot'));
}

/** Lechu habla. mood: 'happy' (salta) o 'think' (inclina la cabeza) */
function say(html, mood) {
  const b = $('#bubble');
  b.innerHTML = html;
  b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  const m = $('#mascot');
  m.classList.remove('happy', 'think');
  if (mood) { void m.offsetWidth; m.classList.add(mood); }
}

function modal({ title, html, buttons }) {
  $('#modal-title').innerHTML = title;
  $('#modal-body').innerHTML = html;
  const box = $('#modal-btns');
  box.innerHTML = '';
  buttons.forEach(b => {
    const el = document.createElement('button');
    el.className = 'btn ' + (b.cls || '');
    el.innerHTML = b.label;
    el.onclick = () => { closeModal(); if (b.fn) b.fn(); };
    box.appendChild(el);
  });
  $('#modal').classList.add('open');
}
function closeModal() { $('#modal').classList.remove('open'); }
const modalOpen = () => $('#modal').classList.contains('open');

/** Escala el escenario 1366 × 768 para que entre en la ventana sin scroll */
function fitStage() {
  const s = Math.min(window.innerWidth / 1366, window.innerHeight / 768);
  $('#stage').style.transform = `scale(${s})`;
}

/* ---------- 6. PORTADA, MAPA Y MÓDULOS ---------- */
function openHome() {
  show('home');
  $('#btn-start').innerHTML = hasProgress() ? 'Continuar la aventura ▶' : '¡Empezar! ▶';
  $('#home-stats').innerHTML = hasProgress()
    ? `<span class="chip">⭐ ${state.stars}</span><span class="chip">🏅 ${actsDone()} medallas</span><span class="chip">${Object.keys(state.badges).length} insignias</span>`
    : '';
}

const STATIONS = [[250, 445], [530, 262], [810, 445], [1090, 262], [1245, 470]];

function openMap() {
  show('map');
  renderMap();
  if (allDone()) say('¡Completaste toda la aventura! 🎉 Tocá el trofeo para ver tu diploma.', 'happy');
  else if (!hasProgress()) say('¡Hola! Soy <b>Lechu</b> 🦉. Vamos a aprender a multiplicar. Tocá la primera estación del mapa.');
  else {
    const mi = MODULES.findIndex((m, i) => !moduleDone(i));
    say(`¡Qué bueno verte! Seguimos en el <b>módulo ${mi + 1}: ${MODULES[mi].name}</b>. Tocá la estación que brilla.`);
  }
}

function renderMap() {
  $('#st-stars').textContent = state.stars;
  $('#st-medals').textContent = actsDone();
  $('#st-acts').textContent = `${actsDone()} de ${TOTAL_ACTS}`;
  const pct = Math.round(itemsDone() / TOTAL_ITEMS * 100);
  $('#progress-fill').style.width = pct + '%';
  $('#progress-label').textContent = pct + '%';

  // Camino punteado entre estaciones
  let d = `M ${STATIONS[0][0]} ${STATIONS[0][1] - 40}`;
  for (let i = 1; i < STATIONS.length; i++) {
    const [x0, y0] = STATIONS[i - 1], [x1, y1] = STATIONS[i];
    d += ` C ${x0 + 150} ${y0 - 40}, ${x1 - 150} ${y1 - 40}, ${x1} ${y1 - 40}`;
  }
  $('#map-path').setAttribute('d', d);
  $('#map-path-bg').setAttribute('d', d);

  const wrap = $('#stations');
  wrap.innerHTML = '';
  MODULES.forEach((m, mi) => {
    const [x, y] = STATIONS[mi];
    const open = moduleOpen(mi), done = moduleDone(mi);
    const el = document.createElement('button');
    el.className = `station ${open ? '' : 'locked'} ${done ? 'done' : ''} ${open && !done ? 'current' : ''}`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--c', m.color);
    el.innerHTML = `<span class="orb">${open ? m.icon : '🔒'}${done ? `<span class="orb-badge">${m.badge.icon}</span>` : ''}</span>
      <span class="st-label"><small>Módulo ${mi + 1}</small>${m.name}
        <span class="st-medals">${m.acts.map((a, ai) => state.done[a.id] ? MEDALS[ai] : '⚪').join('')}</span></span>`;
    el.onclick = () => open ? openModule(mi)
      : say('Este módulo todavía está cerrado 🔒. Terminá el anterior para abrirlo.', 'think');
    wrap.appendChild(el);
  });

  // Estación final: diploma
  const [fx, fy] = STATIONS[4];
  const fin = document.createElement('button');
  fin.className = `station final ${allDone() ? 'current' : 'locked'}`;
  fin.style.left = fx + 'px';
  fin.style.top = fy + 'px';
  fin.innerHTML = `<span class="orb">${allDone() ? '🏆' : '🔒'}</span>
    <span class="st-label"><small>¡Meta!</small>Diploma</span>`;
  fin.onclick = () => allDone() ? openDiploma()
    : say('Completá los 4 módulos para ganar tu diploma de <b>EXPERTO MATEMÁTICO</b>. 🎓', 'think');
  wrap.appendChild(fin);

  $('#badges').innerHTML = MODULES.map(m =>
    `<div class="badge ${state.badges[m.id] ? 'got' : ''}"><span>${m.badge.icon}</span><small>${m.badge.name}</small></div>`).join('');
}

let curModule = 0;

function openModule(mi, skipLesson) {
  curModule = mi;
  const m = MODULES[mi];
  show('module');
  renderModule();
  if (!skipLesson && !state.lessons[m.id]) {
    state.lessons[m.id] = true;
    saveState();
    showLesson(mi);
  }
  const next = m.acts.findIndex(a => !state.done[a.id]);
  if (next === -1) say(`¡Completaste este módulo! Ganaste la insignia <b>${m.badge.icon} ${m.badge.name}</b>. Podés repasar cuando quieras.`, 'happy');
  else if (next === 0) say('El <b>nivel 1</b> tiene pistas 💡 para ayudarte. Los otros niveles son sin ayuda. ¡Vamos!');
  else say(`¡Muy bien! Ahora te espera el <b>nivel ${next + 1}</b>. 💪`);
}

function renderModule() {
  const mi = curModule, m = MODULES[mi];
  $('#scr-module').style.setProperty('--c', m.color);
  $('#mod-title').innerHTML = `<span class="mod-icon">${m.icon}</span> Módulo ${mi + 1}: ${m.name}`;
  const box = $('#levels');
  box.innerHTML = '';
  m.acts.forEach((a, ai) => {
    const open = actOpen(mi, ai), done = !!state.done[a.id];
    const n = a.items.length, p = Math.min(state.prog[a.id] || 0, n);
    const card = document.createElement('div');
    card.className = `level ${open ? '' : 'locked'} ${done ? 'done' : ''}`;
    card.innerHTML = `
      <div class="lv-top">Nivel ${ai + 1}<span class="tag">${a.hints ? '💡 Con pistas' : '🚀 Sin ayuda'}</span></div>
      <div class="lv-icon">${open ? a.icon : '🔒'}</div>
      <h3>${a.title}</h3>
      <div class="lv-bar"><i style="width:${p / n * 100}%"></i></div>
      <div class="lv-count">${done ? MEDALS[ai] + ' ¡Completado!' : `${p} de ${n} preguntas`}</div>
      <button class="btn" ${open ? '' : 'disabled'}>${!open ? 'Bloqueado' : done ? 'Repasar ↻' : p > 0 ? 'Continuar ▶' : 'Jugar ▶'}</button>`;
    $('button', card).onclick = () => open && openActivity(mi, ai);
    box.appendChild(card);
  });
}

function showLesson(mi) {
  const m = MODULES[mi];
  modal({ title: m.lesson.title, html: m.lesson.html(), buttons: [{ label: '¡Entendí! ▶' }] });
  $('.modal-card').style.setProperty('--c', m.color);
}

/* ---------- 7. MOTOR DE ACTIVIDADES ---------- */
let cur = null;   // sesión de juego actual

function openActivity(mi, ai) {
  const act = MODULES[mi].acts[ai];
  const replay = !!state.done[act.id];   // si ya estaba completa, es un repaso
  cur = { mi, ai, act, replay, idx: replay ? 0 : Math.min(state.prog[act.id] || 0, act.items.length - 1) };
  show('act');
  renderItem();
}

function renderItem() {
  const { act, idx } = cur;
  const item = act.items[idx];
  const m = MODULES[cur.mi];
  Object.assign(cur, { item, solved: false, active: null, multGroups: [], extra: {}, blanks: [] });

  $('#scr-act').style.setProperty('--c', m.color);
  $('#act-title').innerHTML = `<small>Módulo ${cur.mi + 1} · Nivel ${cur.ai + 1}${act.hints ? ' · 💡 con pistas' : ''}${cur.replay ? ' · repaso' : ''}</small>${act.title}`;
  $('#act-dots').innerHTML = act.items.map((_, i) => `<i class="${i < idx ? 'ok' : i === idx ? 'now' : ''}"></i>`).join('');
  $('#act-stars').textContent = state.stars;
  $('#act-prompt').innerHTML = item.prompt;

  const vis = $('#act-visual');
  vis.innerHTML = item.type === 'match' ? matchHTML(item) : (item.visual ? item.visual(act.hints) : '');

  $('#act-questions').innerHTML =
    (item.note ? `<p class="qnote">${item.note}</p>` : '') + (item.lines || []).map(lineHTML).join('');

  registerBlanks();
  bindChoices();
  if (item.type === 'group') setupGroup(item);
  if (item.type === 'match') setupMatch(item);
  if (item.type === 'tabla') setupTabla();

  const hasBlanks = cur.blanks.length > 0;
  $('#keypad').classList.toggle('hidden', !hasBlanks);
  const btn = $('#btn-check');
  btn.classList.remove('next');
  btn.classList.toggle('hidden', item.type === 'match');
  btn.textContent = 'Comprobar ✔';
  if (hasBlanks) focusBlank(cur.blanks[0]);

  if (act.hints && item.help) say('💡 <b>Pista:</b> ' + item.help);
  else say(pick(START));
}

/** Convierte una línea de datos en HTML con casilleros u opciones */
function lineHTML(line) {
  const label = line.label ? `<span class="qlabel">${line.label}</span>` : '';
  if (line.choice) {
    const ch = line.choice;
    const order = shuffle(ch.opts.map((_, i) => i));
    return `<div class="qline">${label}
      <div class="choices ${ch.multi ? 'multi' : ''} ${ch.pics ? 'pics' : ''}" data-ok="${ch.ok.slice().sort().join(',')}">
        ${order.map(i => `<button class="opt" data-i="${i}">${ch.opts[i]}</button>`).join('')}
      </div></div>`;
  }
  if (line.mult) {
    const [g, c] = line.mult;
    const k = cur.multGroups.push({ g, c }) - 1;
    const len = Math.max(String(g).length, String(c).length);
    return `<div class="qline">${label}<div class="qexp">
      <span class="blank" data-mg="${k}" data-role="a" data-len="${len}"></span><span class="op">×</span>
      <span class="blank" data-mg="${k}" data-role="b" data-len="${len}"></span><span class="op">=</span>
      <span class="blank" data-ans="${g * c}"></span></div></div>`;
  }
  return `<div class="qline">${label}<div class="qexp">${parseBlanks(line.t)}</div></div>`;
}

function parseBlanks(text) {
  return text
    .replace(/ ([+×=]) /g, ' <span class="op">$1</span> ')
    .replace(/\[(\d+)\]/g, (_, n) => `<span class="blank" data-ans="${n}"></span>`);
}

function registerBlanks() {
  cur.blanks = $$('#scr-act .blank');
  cur.blanks.forEach(b => {
    b.dataset.val = '';
    if (!b.dataset.len) b.dataset.len = b.dataset.ans.length;
    b.onclick = () => focusBlank(b);
  });
}

function bindChoices() {
  $$('#scr-act .choices').forEach(box => {
    const multi = box.classList.contains('multi');
    $$('.opt', box).forEach(o => o.onclick = () => {
      if (cur.solved) return;
      box.classList.remove('wrong');
      $$('.opt', box).forEach(x => x.classList.remove('bad'));
      if (multi) o.classList.toggle('sel');
      else { $$('.opt', box).forEach(x => x.classList.remove('sel')); o.classList.add('sel'); }
    });
  });
}

/* Teclado numérico (en pantalla y físico) */
function focusBlank(b) {
  if (!b || cur.solved) return;
  cur.blanks.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  cur.active = b;
}
function setVal(b, v) {
  b.dataset.val = v;
  b.textContent = v;
  b.classList.remove('wrong', 'right');
}
function typeDigit(d) {
  if (!cur || cur.solved) return;
  const b = cur.active || cur.blanks.find(x => !x.dataset.val);
  if (!b) return;
  const len = +b.dataset.len;
  const old = b.dataset.val || '';
  const v = old.length >= len ? d : old + d;      // si ya estaba lleno, empieza de nuevo
  setVal(b, v);
  if (v.length >= len) {                          // pasa solo al siguiente casillero vacío
    const i = cur.blanks.indexOf(b);
    const nxt = cur.blanks.slice(i + 1).find(x => !x.dataset.val) || cur.blanks.find(x => !x.dataset.val);
    if (nxt) focusBlank(nxt);
  }
}
function backspace() {
  if (!cur || cur.solved || !cur.active) return;
  setVal(cur.active, (cur.active.dataset.val || '').slice(0, -1));
}
function moveFocus(step) {
  if (!cur || !cur.blanks.length) return;
  const i = cur.blanks.indexOf(cur.active);
  focusBlank(cur.blanks[(i + step + cur.blanks.length) % cur.blanks.length]);
}

/** Botón Comprobar: revisa todo. Nunca resta puntos: marca y da una pista. */
function check() {
  if (!cur) return;
  if (cur.solved) return nextItem();
  const item = cur.item;

  if (item.type === 'group' && !cur.extra.done) {
    say('Primero tocá todos los dibujos de la mesa para armar los grupos. 👆', 'think'); return;
  }
  if (item.type === 'tabla' && !cur.extra.cell) {
    say('Tocá en la tabla el casillero donde se cruzan los dos números. 👆', 'think'); return;
  }
  const empty = cur.blanks.filter(b => !b.dataset.val);
  const boxes = $$('#scr-act .choices');
  if (empty.length || boxes.some(bx => !$('.opt.sel', bx))) {
    say('Todavía faltan respuestas. ¡Completá todo y volvé a comprobar! ✏️', 'think');
    if (empty[0]) focusBlank(empty[0]);
    return;
  }

  let allOk = true;
  const mark = (el, ok) => {
    el.classList.remove('wrong', 'right');
    void el.offsetWidth;
    el.classList.add(ok ? 'right' : 'wrong');
    if (!ok) allOk = false;
  };

  // Casilleros con respuesta fija
  cur.blanks.filter(b => b.dataset.ans !== undefined).forEach(b => mark(b, +b.dataset.val === +b.dataset.ans));
  // Multiplicaciones: se acepta 4 × 3 o 3 × 4
  cur.multGroups.forEach((mg, k) => {
    const a = $(`#scr-act .blank[data-mg="${k}"][data-role="a"]`);
    const b = $(`#scr-act .blank[data-mg="${k}"][data-role="b"]`);
    const va = +a.dataset.val, vb = +b.dataset.val;
    const ok = (va === mg.g && vb === mg.c) || (va === mg.c && vb === mg.g);
    mark(a, ok); mark(b, ok);
  });
  // Opciones
  boxes.forEach(bx => {
    const sel = $$('.opt.sel', bx).map(o => o.dataset.i).sort().join(',');
    if (sel === bx.dataset.ok) bx.classList.add('right');
    else {
      allOk = false;
      $$('.opt.sel', bx).forEach(o => { o.classList.add('bad'); o.classList.remove('sel'); });
    }
  });
  // Tabla pitagórica
  if (item.type === 'tabla') {
    const { r, c } = cur.extra.cell, [a, b] = item.tabla;
    const ok = (r === a && c === b) || (r === b && c === a);
    mark(cur.extra.cellEl, ok);
    if (!ok) $$(`#act-visual [data-r="${a}"], #act-visual [data-c="${b}"]`).forEach(el => el.classList.add('hl'));
  }

  if (allOk) solved();
  else {
    say(`${pick(RETRY)} 💡 <b>Pista:</b> ${item.hint || 'Revisá los casilleros en rojo.'} ¡Probá otra vez!`, 'think');
    const w = cur.blanks.find(b => b.classList.contains('wrong'));
    if (w) focusBlank(w);
  }
}

function solved() {
  cur.solved = true;
  cur.blanks.forEach(b => b.classList.remove('active'));
  if (!cur.replay) {
    if (cur.item.type !== 'match') addStar();          // en «unir» las estrellas se dan por pareja
    state.prog[cur.act.id] = Math.max(state.prog[cur.act.id] || 0, cur.idx + 1);
    saveState();
  }
  say(pick(PRAISE), 'happy');
  confetti(36);
  const btn = $('#btn-check');
  btn.classList.remove('hidden');
  btn.classList.add('next');
  btn.textContent = cur.idx === cur.act.items.length - 1 ? '¡Terminar! 🏁' : 'Siguiente ▶';
  const dot = $$('#act-dots i')[cur.idx];
  if (dot) dot.className = 'ok';
}

function nextItem() {
  if (cur.idx < cur.act.items.length - 1) { cur.idx++; renderItem(); }
  else finishActivity();
}

/* ---------- 8. TIPOS ESPECIALES ---------- */

/* Agrupar tocando: cada toque lleva el dibujo al grupo que se está armando */
function setupGroup(item) {
  const size = item.group.size;
  cur.extra = { done: false, gi: 0, cnt: 0 };
  const bins = $('#act-visual .gbins');
  let bin = null;
  $$('#act-visual .candy').forEach(cdy => cdy.onclick = () => {
    if (cur.solved || cur.extra.done || cdy.parentElement.classList.contains('gbin-items')) return;
    if (cur.extra.cnt === 0) {
      bin = document.createElement('div');
      bin.className = 'gbin col' + (cur.extra.gi % 6);
      bin.innerHTML = `<div class="gbin-items"></div><span class="gbin-label">Grupo ${cur.extra.gi + 1}</span>`;
      bins.appendChild(bin);
    }
    $('.gbin-items', bin).appendChild(cdy);
    cur.extra.cnt++;
    if (cur.extra.cnt === size) { cur.extra.cnt = 0; cur.extra.gi++; bin.classList.add('full'); }
    if (!$('#act-visual .mesa .candy')) {
      cur.extra.done = true;
      say('¡Listo! Ya están todos agrupados. Ahora respondé las preguntas. ✏️', 'happy');
    }
  });
  $('#act-visual .regroup').onclick = () => { if (!cur.solved) renderItem(); };
}

/* Unir suma con multiplicación */
function matchHTML(item) {
  const L = shuffle(item.pairs.map((p, k) => ({ t: p[0], k })));
  const R = shuffle(item.pairs.map((p, k) => ({ t: p[1], k })));
  return `<div class="match">
    <div class="mcol">${L.map(o => `<button class="mcard left" data-k="${o.k}">${o.t}</button>`).join('')}</div>
    <div class="mlink">🔗</div>
    <div class="mcol">${R.map(o => `<button class="mcard right" data-k="${o.k}">${o.t}</button>`).join('')}</div>
  </div>`;
}
function setupMatch(item) {
  let selL = null, selR = null, made = 0;
  const tryPair = () => {
    if (!selL || !selR) return;
    if (selL.dataset.k === selR.dataset.k) {
      [selL, selR].forEach(x => { x.classList.remove('sel'); x.classList.add('paired', 'p' + made % 6); x.disabled = true; });
      made++;
      if (!cur.replay) addStar();
      if (made === item.pairs.length) solved();
      else say(pick(PAIR_OK), 'happy');
    } else {
      [selL, selR].forEach(x => {
        x.classList.remove('sel'); x.classList.add('shake');
        setTimeout(() => x.classList.remove('shake'), 500);
      });
      say(`${pick(RETRY)} 💡 <b>Pista:</b> ${item.hint} ¡Probá otra vez!`, 'think');
    }
    selL = selR = null;
  };
  $$('#act-visual .mcard').forEach(b => b.onclick = () => {
    if (b.classList.contains('paired')) return;
    const side = b.classList.contains('left') ? 'left' : 'right';
    $$(`#act-visual .mcard.${side}`).forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    if (side === 'left') selL = b; else selR = b;
    tryPair();
  });
}

/* Tabla pitagórica: elegir el casillero */
function setupTabla() {
  $$('#act-visual td').forEach(td => td.onclick = () => {
    if (cur.solved) return;
    $$('#act-visual td').forEach(x => x.classList.remove('sel', 'wrong', 'right'));
    td.classList.add('sel');
    cur.extra.cell = { r: +td.dataset.r, c: +td.dataset.c };
    cur.extra.cellEl = td;
  });
}

/* ---------- 9. RECOMPENSAS, CELEBRACIONES Y DIPLOMA ---------- */
function addStar() {
  state.stars++;
  saveState();
  $('#act-stars').textContent = state.stars;
  const chip = $('#scr-act .star-chip');
  chip.classList.remove('bump'); void chip.offsetWidth; chip.classList.add('bump');
  const f = document.createElement('div');
  f.className = 'float-txt';
  f.textContent = '+1 ⭐';
  f.style.right = '60px';
  f.style.top = '70px';
  $('#fx').appendChild(f);
  setTimeout(() => f.remove(), 1200);
}

function confetti(n) {
  const colors = ['#ff7a59', '#8e6cf0', '#1fb5a8', '#f5a623', '#ff6fae', '#4aa3ff', '#ffc53d'];
  const fx = $('#fx');
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'cf';
    p.style.left = Math.random() * 1366 + 'px';
    p.style.background = pick(colors);
    p.style.animationDuration = (1.8 + Math.random() * 1.8) + 's';
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    p.style.borderRadius = Math.random() < 0.4 ? '50%' : '3px';
    fx.appendChild(p);
    setTimeout(() => p.remove(), 4300);
  }
}

function finishActivity() {
  const { act, mi, ai } = cur;
  const m = MODULES[mi];
  const first = !state.done[act.id];
  state.done[act.id] = true;
  state.prog[act.id] = act.items.length;
  let newBadge = false;
  if (moduleDone(mi) && !state.badges[m.id]) { state.badges[m.id] = true; newBadge = true; }
  saveState();
  confetti(150);

  let html = `<div class="big-emoji">${MEDALS[ai]}</div>
    <p>${first ? '¡Ganaste una medalla por completar' : '¡Terminaste el repaso de'} <b>${act.title}</b>!</p>
    <p class="muted">⭐ Ya tenés ${state.stars} estrellas · ✅ ${actsDone()} de ${TOTAL_ACTS} actividades</p>`;
  if (newBadge) {
    html += `<div class="badge-win"><span>${m.badge.icon}</span><div><small>¡Nueva insignia!</small>
      <b>${m.badge.name}</b><br>Superaste el módulo ${mi + 1}${mi < MODULES.length - 1 ? ' y se abrió el siguiente en el mapa.' : '.'}</div></div>`;
  }
  const finished = newBadge && allDone();
  if (finished) html += '<p><b>🎓 ¡Completaste TODOS los módulos!</b></p>';

  cur = null;
  modal({
    title: first ? '¡Medalla nueva!' : '¡Muy bien!',
    html,
    buttons: finished ? [{ label: '🎓 Ver mi diploma', fn: openDiploma }]
      : newBadge ? [{ label: '🗺️ Ir al mapa', fn: openMap }]
      : [{ label: 'Seguir ▶', fn: () => openModule(mi, true) }]
  });
}

function openDiploma() {
  show('diploma');
  $('#dip-name').value = state.name || '';
  $('#dip-date').textContent = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#dip-stars').textContent = state.stars;
  $('#dip-badges').innerHTML = MODULES.map(m =>
    `<span class="dbadge"><b>${m.badge.icon}</b><small>${m.badge.name}</small></span>`).join('');
  confetti(160);
  say('¡Felicitaciones! 🎉 Escribí tu nombre en el diploma y pedile a tu seño que lo imprima.', 'happy');
}

function confirmReset() {
  modal({
    title: '¿Reiniciar el progreso?',
    html: '<p>Se van a borrar las estrellas, medallas, insignias y el diploma de esta computadora.</p><p class="muted">Esto no se puede deshacer.</p>',
    buttons: [
      { label: 'No, volver', cls: 'ghost' },
      { label: 'Sí, borrar todo', cls: 'danger', fn: () => {
        state = freshState();
        saveState();
        renderMap();
        say('Listo, empezamos de nuevo. ¡A jugar! 🦉');
      } }
    ]
  });
}

/* ---------- 10. INICIO ---------- */
function decorateBackground() {
  const symbols = ['×', '+', '=', '2', '3', '4', '5', '6', '7', '8', '9', '×', '×', '10'];
  const colors = ['#ff7a59', '#8e6cf0', '#1fb5a8', '#f5a623', '#4aa3ff'];
  let h = '';
  for (let i = 0; i < 28; i++) {
    h += `<span style="left:${Math.random() * 96}%;top:${Math.random() * 92}%;font-size:${30 + Math.random() * 50}px;color:${pick(colors)};animation-delay:-${Math.random() * 9}s">${pick(symbols)}</span>`;
  }
  $('.bg-math').innerHTML = h;
}

function init() {
  fitStage();
  window.addEventListener('resize', fitStage);
  decorateBackground();
  $('#home-owl').innerHTML = $('#mascot .owl').outerHTML;

  $('#btn-start').onclick = openMap;
  $('#btn-home').onclick = openHome;
  $('#btn-reset').onclick = confirmReset;
  $('#btn-mod-back').onclick = openMap;
  $('#btn-lesson').onclick = () => showLesson(curModule);
  $('#btn-act-back').onclick = () => { const mi = cur ? cur.mi : curModule; cur = null; openModule(mi, true); };
  $('#btn-check').onclick = check;
  $('#btn-dip-back').onclick = openMap;
  $('#btn-print').onclick = () => window.print();
  $('#dip-name').addEventListener('input', e => { state.name = e.target.value; saveState(); });
  $$('#keypad .key').forEach(k => k.onclick = () => k.dataset.k === 'del' ? backspace() : typeDigit(k.dataset.k));

  document.addEventListener('keydown', e => {
    if (modalOpen()) {
      if (e.key === 'Enter') { e.preventDefault(); const b = $('#modal-btns .btn'); if (b) b.click(); }   // el primero (nunca «borrar»)
      return;
    }
    if (screen !== 'act' || !cur || (e.target && e.target.tagName === 'INPUT')) return;
    if (/^[0-9]$/.test(e.key)) typeDigit(e.key);
    else if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
    else if (e.key === 'Enter') { e.preventDefault(); check(); }
    else if (e.key === 'Tab' || e.key === 'ArrowRight') { e.preventDefault(); moveFocus(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveFocus(-1); }
  });

  openHome();
}

document.addEventListener('DOMContentLoaded', init);
