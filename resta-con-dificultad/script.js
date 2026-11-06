// ===================== DATOS: HISTORIAS =====================

const HISTORIAS_SUMA = [
  { emoji: "📚", texto: "Rafael tenía {a} figuritas y compró {b} más. ¿Cuántas figuritas tiene ahora?" },
  { emoji: "📖", texto: "En la biblioteca había {a} libros de cuentos y llegaron {b} nuevos. ¿Cuántos libros hay en total?" },
  { emoji: "🧢", texto: "Mateo juntó {a} tapitas y su hermano le regaló {b}. ¿Cuántas tapitas tiene Mateo?" },
  { emoji: "🌼", texto: "En el jardín había {a} flores y plantaron {b} más. ¿Cuántas flores hay ahora?" },
  { emoji: "✏️", texto: "Sofía tenía {a} lápices de colores y compró {b} más. ¿Cuántos lápices tiene?" },
  { emoji: "🥫", texto: "En la campaña solidaria juntaron {a} alimentos el lunes y {b} el martes. ¿Cuántos alimentos juntaron en total?" },
  { emoji: "🧸", texto: "La fábrica de juguetes armó {a} muñecos y después armó {b} más. ¿Cuántos muñecos armó en total?" },
  { emoji: "✨", texto: "Valentina tenía {a} stickers y le regalaron {b} más. ¿Cuántos stickers tiene ahora?" },
  { emoji: "🍬", texto: "Julián tenía {a} caramelos y compró {b} más. ¿Cuántos caramelos tiene en total?" },
  { emoji: "🔢", texto: "Camila contó {a} cuentas azules y {b} cuentas rojas para hacer un collar. ¿Cuántas cuentas usó en total?" },
  { emoji: "🚗", texto: "Tomás tiene {a} autitos de colección y le regalaron {b} más. ¿Cuántos autitos tiene ahora?" },
  { emoji: "🃏", texto: "En el club había {a} cartas en una caja y agregaron {b} cartas más. ¿Cuántas cartas hay en total?" },
  { emoji: "🌱", texto: "Abril plantó {a} semillas el sábado y {b} semillas el domingo. ¿Cuántas semillas plantó en total?" },
  { emoji: "🔘", texto: "Nicolás juntó {a} botones en una caja y encontró {b} más en otra. ¿Cuántos botones tiene en total?" },
  { emoji: "🪙", texto: "Renata ahorró {a} monedas en su alcancía y agregó {b} monedas más. ¿Cuántas monedas tiene ahora?" },
  { emoji: "🪨", texto: "Benjamín juntó {a} piedritas de colores y encontró {b} piedritas más en el patio. ¿Cuántas piedritas tiene en total?" },
  { emoji: "🐚", texto: "Zoe recolectó {a} conchitas en la playa por la mañana y {b} más por la tarde. ¿Cuántas conchitas recolectó en total?" },
  { emoji: "🍂", texto: "Ian juntó {a} hojas secas para un trabajo de la escuela y su amigo le dio {b} más. ¿Cuántas hojas tiene en total?" },
  { emoji: "📷", texto: "Mía tiene {a} fotos pegadas en su álbum y agregó {b} fotos nuevas. ¿Cuántas fotos tiene en el álbum ahora?" },
  { emoji: "📮", texto: "Julieta coleccionaba {a} sellos postales y le regalaron {b} más. ¿Cuántos sellos tiene en su colección?" }
];

const HISTORIAS_RESTA = [
  { emoji: "🍫", texto: "La fábrica tenía {a} chocolates y vendió {b}. ¿Cuántos chocolates le quedan?" },
  { emoji: "🎈", texto: "En el cumpleaños había {a} globos y se explotaron {b}. ¿Cuántos globos quedan?" },
  { emoji: "🧃", texto: "El kiosco tenía {a} jugos y vendió {b} durante el recreo. ¿Cuántos jugos le quedan?" },
  { emoji: "🪁", texto: "La jugetería tenía {a} barriletes y vendió {b}. ¿Cuántos barriletes le quedan?" },
  { emoji: "🐟", texto: "En la pecera había {a} peces y se regalaron {b} a otra familia. ¿Cuántos peces quedan en la pecera?" },
  { emoji: "🍎", texto: "La verdulería tenía {a} manzanas y vendió {b} en la mañana. ¿Cuántas manzanas le quedan?" },
  { emoji: "🚌", texto: "En la plaza había {a} personas y se fueron {b}. ¿Cuántas personas quedan en la plaza?" },
  { emoji: "🧁", texto: "La pastelería horneó {a} magdalenas y vendió {b} en el día. ¿Cuántas magdalenas le quedan?" },
  { emoji: "🪀", texto: "El bazar tenía {a} juguetes y vendió {b}. ¿Cuántos juguetes le quedan en el estante?" },
  { emoji: "🎟️", texto: "Para la kermés imprimieron {a} entradas y ya se vendieron {b}. ¿Cuántas entradas quedan?" },
  { emoji: "🧵", texto: "La mercería tenía {a} metros de hilo y usó {b} metros para los trabajos. ¿Cuántos metros de hilo le quedan?" },
  { emoji: "🪆", texto: "El museo tenía {a} figuras en exhibición y guardó {b} en el depósito. ¿Cuántas figuras quedan exhibidas?" },
  { emoji: "🍊", texto: "La frutería recibió {a} naranjas y vendió {b} durante la mañana. ¿Cuántas naranjas le quedan?" },
  { emoji: "📦", texto: "En el depósito había {a} cajas y se despacharon {b}. ¿Cuántas cajas quedan en el depósito?" },
  { emoji: "🎨", texto: "La librería tenía {a} cajas de témperas y vendió {b}. ¿Cuántas cajas de témperas le quedan?" },
  { emoji: "🐝", texto: "En la colmena había {a} abejas y {b} se fueron a otra colmena. ¿Cuántas abejas quedan?" },
  { emoji: "🪵", texto: "El carpintero tenía {a} tablas de madera y usó {b} para un mueble. ¿Cuántas tablas le quedan?" },
  { emoji: "🧮", texto: "En la juguetería había {a} ábacos y se vendieron {b}. ¿Cuántos ábacos quedan en el local?" },
  { emoji: "🍞", texto: "La panadería horneó {a} panes y vendió {b} por la mañana. ¿Cuántos panes le quedan?" },
  { emoji: "🧦", texto: "El local de ropa tenía {a} pares de medias y vendió {b}. ¿Cuántos pares de medias le quedan?" }
];

// ===================== CONFIGURACIÓN DE MODOS =====================

const MODOS = {
  "suma-facil": {
    operacion: "+",
    dificultad: false,
    titulo: "➕ Suma sin dificultad",
    historias: HISTORIAS_SUMA,
    generar: generarNumerosSuma
  },
  "suma-dificil": {
    operacion: "+",
    dificultad: true,
    titulo: "➕🔥 Suma con dificultad",
    historias: HISTORIAS_SUMA,
    generar: generarNumerosSuma
  },
  "resta-facil": {
    operacion: "-",
    dificultad: false,
    titulo: "➖ Resta sin dificultad",
    historias: HISTORIAS_RESTA,
    generar: generarNumerosResta
  },
  "resta-dificil": {
    operacion: "-",
    dificultad: true,
    titulo: "➖🔥 Resta con dificultad",
    historias: HISTORIAS_RESTA,
    generar: generarNumerosResta
  }
};

const TOTAL_EJERCICIOS = 20;

// ===================== ESTADO =====================

var modoActual = null;
var ejercicios = [];
var indiceActual = 0;
var estrellas = 0;

// ===================== GENERACIÓN DE NÚMEROS =====================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function digitos(n) {
  const C = Math.floor(n / 100) % 10;
  const D = Math.floor(n / 10) % 10;
  const U = n % 10;
  return { C, D, U };
}

function generarNumerosSuma(dificultad) {
  for (let intento = 0; intento < 400; intento++) {
    const C1 = rand(1, 4);
    const D1 = rand(0, 9);
    const U1 = rand(0, 9);
    const maxC2 = Math.max(1, 9 - C1);
    const C2 = rand(1, Math.min(9, maxC2 + 3)); // algo de margen, se filtra abajo
    const D2 = rand(0, 9);
    const U2 = rand(0, 9);

    const a = C1 * 100 + D1 * 10 + U1;
    const b = C2 * 100 + D2 * 10 + U2;
    const suma = a + b;
    if (suma >= 1000 || suma < 100) continue;

    const carryU = (U1 + U2) >= 10;
    const carryD = (D1 + D2 + (carryU ? 1 : 0)) >= 10;

    if (dificultad) {
      if (carryU || carryD) return { a, b };
    } else {
      if (!carryU && !carryD) return { a, b };
    }
  }
  // Respaldo por si el azar no encontró un caso válido
  return dificultad ? { a: 156, b: 277 } : { a: 123, b: 241 };
}

function generarNumerosResta(dificultad) {
  for (let intento = 0; intento < 400; intento++) {
    const C1 = rand(2, 9);
    const D1 = rand(1, 9);
    const U1 = rand(0, 8);

    let C2, D2, U2;

    if (dificultad) {
      // Se fuerza un "préstamo" en las unidades
      C2 = rand(1, C1);
      U2 = rand(U1 + 1, 9);
      D2 = rand(0, D1 - 1);
    } else {
      // Sin préstamos: cada cifra de b es menor o igual que la de a
      C2 = rand(1, C1);
      D2 = rand(0, D1);
      U2 = rand(0, U1);
    }

    const a = C1 * 100 + D1 * 10 + U1;
    const b = C2 * 100 + D2 * 10 + U2;
    if (b >= 100 && a > b && a < 1000) {
      return { a, b };
    }
  }
  return dificultad ? { a: 742, b: 328 } : { a: 487, b: 253 };
}

// ===================== CÁLCULO DEL RESULTADO =====================

function calcularResultado(a, b, operacion) {
  const total = operacion === "+" ? a + b : a - b;
  return digitos(total);
}

// ===================== CONSTRUCCIÓN DE EJERCICIOS =====================

function construirEjercicios(modoKey) {
  const modo = MODOS[modoKey];
  const historiasElegidas = [...modo.historias].sort(() => Math.random() - 0.5).slice(0, TOTAL_EJERCICIOS);
  const lista = [];
  for (let i = 0; i < TOTAL_EJERCICIOS; i++) {
    const { a, b } = modo.generar(modo.dificultad);
    const historia = historiasElegidas[i % historiasElegidas.length];
    lista.push({
      a, b,
      operacion: modo.operacion,
      emoji: historia.emoji,
      texto: historia.texto.replace("{a}", a).replace("{b}", b),
      esperado: calcularResultado(a, b, modo.operacion)
    });
  }
  return lista;
}

// ===================== NAVEGACIÓN DE PANTALLAS =====================

function irAMenu() {
  document.getElementById("pantalla-menu").classList.remove("oculto");
  document.getElementById("pantalla-juego").classList.add("oculto");
  document.getElementById("pantalla-final").classList.add("oculto");
}

function iniciarModo(modoKey) {
  modoActual = modoKey;
  ejercicios = construirEjercicios(modoKey);
  indiceActual = 0;
  estrellas = 0;

  document.getElementById("titulo-modo").textContent = MODOS[modoKey].titulo;
  document.getElementById("operador-signo").textContent = MODOS[modoKey].operacion;

  const filaLlevadas = document.getElementById("fila-llevadas");
  const celdaLlevadaC = document.getElementById("celda-llevada-c");
  const celdaLlevadaD = document.getElementById("celda-llevada-d");
  const celdaLlevadaU = document.getElementById("celda-llevada-u");
  const aD = document.getElementById("a-d");

  const esRestaDificil = MODOS[modoKey].dificultad && MODOS[modoKey].operacion === "-";

  if (MODOS[modoKey].dificultad) {
    filaLlevadas.classList.remove("oculto");
    if (esRestaDificil) {
      // Resta con dificultad: sólo el cuadradito del "1 prestado" arriba de las unidades
      celdaLlevadaC.classList.add("oculto-celda");
      celdaLlevadaD.classList.add("oculto-celda");
      celdaLlevadaU.classList.remove("oculto-celda");
    } else {
      // Suma con dificultad: cuadraditos de "me llevo" arriba de decenas y centenas
      celdaLlevadaC.classList.remove("oculto-celda");
      celdaLlevadaD.classList.remove("oculto-celda");
      celdaLlevadaU.classList.add("oculto-celda");
    }
  } else {
    filaLlevadas.classList.add("oculto");
  }

  // Permitir tachar la cifra de las decenas que "presta" sólo en resta con dificultad
  aD.classList.toggle("tachable", esRestaDificil);

  document.getElementById("pantalla-menu").classList.add("oculto");
  document.getElementById("pantalla-final").classList.add("oculto");
  document.getElementById("pantalla-juego").classList.remove("oculto");

  cargarEjercicio(indiceActual);
}

// ===================== CARGA Y VALIDACIÓN DE EJERCICIOS =====================

function cargarEjercicio(indice) {
  const ej = ejercicios[indice];

  document.getElementById("emoji-personaje").textContent = ej.emoji;
  document.getElementById("texto-problema").textContent = ej.texto;

  const da = digitos(ej.a);
  const db = digitos(ej.b);

  document.getElementById("a-c").textContent = da.C;
  document.getElementById("a-d").textContent = da.D;
  document.getElementById("a-u").textContent = da.U;

  document.getElementById("b-c").textContent = db.C;
  document.getElementById("b-d").textContent = db.D;
  document.getElementById("b-u").textContent = db.U;

  const inputU = document.getElementById("input-u");
  const inputD = document.getElementById("input-d");
  const inputC = document.getElementById("input-c");

  [inputU, inputD, inputC].forEach(inp => {
    inp.value = "";
    inp.classList.remove("correcto", "error");
    inp.readOnly = false;
  });

  inputU.disabled = false;
  inputD.disabled = false;
  inputC.disabled = false;

  const llevadaC = document.getElementById("llevada-c");
  const llevadaD = document.getElementById("llevada-d");
  const llevadaU = document.getElementById("llevada-u");
  if (llevadaC) llevadaC.value = "";
  if (llevadaD) llevadaD.value = "";
  if (llevadaU) llevadaU.value = "";

  const aD = document.getElementById("a-d");
  aD.classList.remove("tachado");

  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";

  document.getElementById("contador").textContent = `Ejercicio ${indice + 1} de ${TOTAL_EJERCICIOS}`;
  document.getElementById("estrellas").textContent = `⭐ ${estrellas}`;
  document.getElementById("barra-relleno").style.width = `${(indice / TOTAL_EJERCICIOS) * 100}%`;

  setTimeout(() => inputU.focus(), 50);
}

var verificando = false;

function configurarEntradaResultado() {
  const orden = ["input-u", "input-d", "input-c"];
  orden.forEach((id, i) => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      if (verificando) return;
      input.classList.remove("error", "correcto");
      input.value = input.value.replace(/[^0-9]/g, "");

      // Al escribir una cifra, pasa al casillero de la izquierda (sin verificar)
      if (input.value !== "" && i < orden.length - 1) {
        document.getElementById(orden[i + 1]).focus();
      }
      verificarSiCompleto();
    });
    input.addEventListener("keydown", (ev) => {
      // Borrar en un casillero vacío vuelve al de la derecha
      if (ev.key === "Backspace" && input.value === "" && i > 0) {
        document.getElementById(orden[i - 1]).focus();
      }
    });
  });
}

function verificarSiCompleto() {
  const inputs = ["input-c", "input-d", "input-u"].map(id => document.getElementById(id));
  if (inputs.some(inp => inp.value === "")) return;

  const ej = ejercicios[indiceActual];
  const ingresado = inputs.map(inp => inp.value).join("");
  const esperado = `${ej.esperado.C}${ej.esperado.D}${ej.esperado.U}`;
  verificando = true;

  if (ingresado === esperado) {
    inputs.forEach(inp => { inp.classList.add("correcto"); inp.readOnly = true; });
    setTimeout(() => { verificando = false; ejercicioCompletado(); }, 350);
  } else {
    inputs.forEach(inp => inp.classList.add("error"));
    document.getElementById("feedback").textContent = "Revisá la cuenta e intentá de nuevo 💪";
    document.getElementById("feedback").className = "feedback incorrecto";
    setTimeout(() => {
      inputs.forEach(inp => { inp.classList.remove("error"); inp.value = ""; });
      document.getElementById("feedback").textContent = "";
      document.getElementById("feedback").className = "feedback";
      verificando = false;
      document.getElementById("input-u").focus();
    }, 700);
  }
}

function ejercicioCompletado() {
  estrellas++;
  document.getElementById("estrellas").textContent = `⭐ ${estrellas}`;
  document.getElementById("feedback").textContent = "¡Muy bien! 🎉";
  document.getElementById("feedback").className = "feedback correcto";
  lanzarConfeti(16);

  setTimeout(() => {
    indiceActual++;
    if (indiceActual < TOTAL_EJERCICIOS) {
      cargarEjercicio(indiceActual);
    } else {
      mostrarPantallaFinal();
    }
  }, 1000);
}

// ===================== PANTALLA FINAL =====================

function mostrarPantallaFinal() {
  document.getElementById("barra-relleno").style.width = "100%";
  document.getElementById("resumen-modo").textContent =
    `Resolviste las ${TOTAL_EJERCICIOS} cuentas de "${MODOS[modoActual].titulo.replace(/^[^\s]+\s/, "")}".`;
  document.getElementById("resumen-estrellas").textContent = `⭐ ${estrellas} de ${TOTAL_EJERCICIOS}`;
  document.getElementById("pantalla-final").classList.remove("oculto");
  lanzarConfeti(40);
}

// ===================== CONFETI =====================

function lanzarConfeti(cantidad) {
  const contenedor = document.getElementById("confetti-container");
  const emojis = ["🎉", "⭐", "🎊", "✨", "🏆"];
  for (let i = 0; i < cantidad; i++) {
    const span = document.createElement("span");
    span.className = "confeti";
    span.textContent = emojis[rand(0, emojis.length - 1)];
    span.style.left = `${rand(0, 100)}%`;
    span.style.fontSize = `${rand(14, 30)}px`;
    span.style.animationDuration = `${rand(1400, 2600)}ms`;
    contenedor.appendChild(span);
    setTimeout(() => span.remove(), 2700);
  }
}

// ===================== INICIALIZACIÓN =====================

document.addEventListener("DOMContentLoaded", () => {
  configurarEntradaResultado();

  document.getElementById("a-d").addEventListener("click", (ev) => {
    if (ev.currentTarget.classList.contains("tachable")) {
      ev.currentTarget.classList.toggle("tachado");
    }
  });

  document.querySelectorAll(".tarjeta-modo").forEach(boton => {
    boton.addEventListener("click", () => {
      iniciarModo(boton.dataset.modo);
    });
  });

  document.getElementById("btn-volver-menu").addEventListener("click", irAMenu);
  document.getElementById("btn-ir-menu").addEventListener("click", irAMenu);
  document.getElementById("btn-jugar-de-nuevo").addEventListener("click", () => {
    iniciarModo(modoActual);
  });
});
