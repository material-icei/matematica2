/* =========================================================
   Restas con dificultad - 2° grado
   Esquema de resolución por descomposición (decenas / unidades)
   ========================================================= */

const TOTAL_EJERCICIOS = 20;

/* ---------- Historias / personajes ---------- */
const HISTORIAS = [
  { nombre: "Juan",      emoji: "🍫", objeto: "chocolates",         accion: "se comió",                          genero: "m" },
  { nombre: "Martina",   emoji: "🪆", objeto: "muñecas",             accion: "le regaló a su hermana",            genero: "f" },
  { nombre: "Fede",      emoji: "🎴", objeto: "figuritas",           accion: "perdió en el recreo",                genero: "f" },
  { nombre: "Sofía",     emoji: "🍬", objeto: "caramelos",           accion: "repartió entre sus amigas",         genero: "m" },
  { nombre: "Lucas",     emoji: "🔵", objeto: "canicas",             accion: "perdió jugando",                     genero: "f" },
  { nombre: "Valentina", emoji: "✏️", objeto: "lápices",             accion: "prestó a sus compañeros",            genero: "m" },
  { nombre: "Tomás",     emoji: "🚗", objeto: "autitos",             accion: "le regaló a su primo",               genero: "m" },
  { nombre: "Camila",    emoji: "🎈", objeto: "globos",              accion: "dejó que se le escaparan",           genero: "m" },
  { nombre: "Mateo",     emoji: "🍪", objeto: "galletitas",          accion: "comió en la merienda",               genero: "f" },
  { nombre: "Julieta",   emoji: "📓", objeto: "cuadernos",           accion: "donó a la biblioteca",               genero: "m" },
  { nombre: "Bruno",     emoji: "🌸", objeto: "flores",              accion: "regaló a su mamá",                   genero: "f" },
  { nombre: "Emma",      emoji: "🍎", objeto: "manzanas",            accion: "usó para hacer una torta",           genero: "f" },
  { nombre: "Nico",      emoji: "🔘", objeto: "botones",             accion: "perdió de su colección",             genero: "m" },
  { nombre: "Abril",     emoji: "🪙", objeto: "monedas",             accion: "gastó en el kiosco",                 genero: "f" },
  { nombre: "Santino",   emoji: "📚", objeto: "libros",              accion: "prestó a la biblioteca",             genero: "m" },
  { nombre: "Mía",       emoji: "⛵", objeto: "barquitos de papel",  accion: "vio hundirse en el río",             genero: "m" },
  { nombre: "Benja",     emoji: "🐟", objeto: "peces",               accion: "devolvió al río",                    genero: "m" },
  { nombre: "Renata",    emoji: "⭐", objeto: "estrellitas doradas", accion: "usó para decorar un cartel",        genero: "f" },
  { nombre: "Ian",       emoji: "🪨", objeto: "piedritas",           accion: "guardó en su colección de rocas",   genero: "f" },
  { nombre: "Zoe",       emoji: "🌟", objeto: "stickers",            accion: "pegó en su cuaderno",                genero: "m" }
];

/* ---------- Estado del juego ---------- */
let ejercicios = [];
let indiceActual = 0;
let estrellas = 0;

const EJERCICIOS_GUIADOS = 4; // en estas primeras restas se corrige cada casillero
function esModoGuiado(indice) {
  return indice < EJERCICIOS_GUIADOS;
}

/* ---------- Generación de números con "dificultad" ----------
   Se exige que el número de unidades del minuendo sea menor
   que el de unidades del sustraendo, para forzar el préstamo. */
function generarNumeros() {
  let a, b, intentos = 0;
  do {
    a = Math.floor(Math.random() * 80) + 20;      // 20 a 99
    b = Math.floor(Math.random() * (a - 10)) + 10; // 10 a a-1
    intentos++;
  } while ((a % 10) >= (b % 10) && intentos < 300);

  if ((a % 10) < (b % 10)) return { a, b };

  // Respaldo (muy poco probable que se use)
  const unidadesA = a % 10;
  const decenasA = Math.floor(a / 10);
  const unidadesB = Math.min(9, unidadesA + 1 + Math.floor(Math.random() * (9 - unidadesA)));
  let decenasB = Math.max(1, decenasA - 1 - Math.floor(Math.random() * decenasA));
  if (decenasB >= decenasA) decenasB = Math.max(1, decenasA - 1);
  b = decenasB * 10 + unidadesB;
  return { a, b };
}

function generarEjercicios() {
  const historiasBarajadas = [...HISTORIAS].sort(() => Math.random() - 0.5);
  ejercicios = historiasBarajadas.slice(0, TOTAL_EJERCICIOS).map((historia) => {
    const { a, b } = generarNumeros();
    return { ...historia, a, b, resultado: a - b, esperados: calcularEsperados(a, b) };
  });
}

/* Valores correctos de cada casillero del esquema de descomposición,
   siguiendo el método de "pedir prestado" (ver PDF de referencia).
   - decenaResta: resta directa de las decenas, todavía SIN prestar (evidencia que a-b en unidades no se puede)
   - tensFinal: paso siguiente, se le resta la decena que se prestó a las unidades
   - uA2/uB2: se repiten las unidades para mostrar que la resta no se puede resolver directamente
   - unidadesSuma: unidades de A + la decena prestada (convertida en 10 unidades)
   - uB3: se repite nuevamente la unidad de B para restarla de unidadesSuma
   - tensResultado/unidadesResultado: valores finales de decenas y unidades, listos para sumarse */
function calcularEsperados(a, b) {
  const tensA = Math.floor(a / 10) * 10;
  const unitsA = a % 10;
  const tensB = Math.floor(b / 10) * 10;
  const unitsB = b % 10;

  const decenaResta = tensA - tensB;
  const tensFinal = decenaResta - 10;
  const tensResultado = tensFinal;
  const unidadesSuma = unitsA + 10;
  const unidadesResultado = unidadesSuma - unitsB;

  return {
    tA: tensA, tB: tensB, uA: unitsA, uB: unitsB,
    decenaResta,
    uA2: unitsA, uB2: unitsB,
    tensFinal, unidadesSuma, uB3: unitsB,
    tensResultado, unidadesResultado
  };
}

/* =========================================================
   Construcción visual del esquema (una sola vez)
   Espacio virtual de referencia: 900 x 550
   ========================================================= */
const ANCHO_V = 760;
const ALTO_V = 480;

function pctX(x) { return (x / ANCHO_V * 100) + "%"; }
function pctY(y) { return (y / ALTO_V * 100) + "%"; }

// Definición de casilleros: {id, x, y, w, h, tipo}
const CASILLEROS = [
  { id: "boxA", x: 200, y: 60,  w: 110, h: 58, tipo: "fija" },
  { id: "boxB", x: 560, y: 60,  w: 110, h: 58, tipo: "fija" },

  { id: "tA", x: 95,  y: 150, w: 86, h: 54, tipo: "input" },
  { id: "tB", x: 290, y: 150, w: 86, h: 54, tipo: "input" },
  { id: "uA", x: 450, y: 150, w: 86, h: 54, tipo: "input" },
  { id: "uB", x: 645, y: 150, w: 86, h: 54, tipo: "input" },

  { id: "decenaResta", x: 195, y: 240, w: 86, h: 54, tipo: "input" },
  { id: "uA2", x: 450, y: 240, w: 86, h: 54, tipo: "input" },
  { id: "uB2", x: 645, y: 240, w: 86, h: 54, tipo: "input" },

  { id: "tensFinal", x: 195, y: 330, w: 86, h: 54, tipo: "input" },
  { id: "unidadesSuma", x: 450, y: 330, w: 86, h: 54, tipo: "input" },
  { id: "uB3", x: 645, y: 330, w: 86, h: 54, tipo: "input" },

  { id: "tensResultado", x: 195, y: 420, w: 86, h: 54, tipo: "input" },
  { id: "unidadesResultado", x: 547, y: 420, w: 86, h: 54, tipo: "input" },
  { id: "respuestaFinalCaja", x: 690, y: 420, w: 118, h: 62, tipo: "destacada" }
];

const OPERADORES = [
  { simbolo: "-", x: 380, y: 60 },
  { simbolo: "-", x: 193, y: 150 },
  { simbolo: "-", x: 547, y: 150 },
  { simbolo: "-", x: 547, y: 240 },
  { simbolo: "+", x: 322, y: 330 },
  { simbolo: "-", x: 547, y: 330 },
  { simbolo: "+", x: 371, y: 420 },
  { simbolo: "=", x: 619, y: 420 }
];

// Líneas: [x1, y1, x2, y2, color]
// Rojo = tramo de decenas, Azul = tramo de unidades, Negro = la decena que se transfiere prestada hacia las unidades
const LINEAS = [
  [200, 89, 95, 123, "roja"],
  [200, 89, 450, 123, "azul"],
  [560, 89, 290, 123, "roja"],
  [560, 89, 645, 123, "azul"],

  [95, 177, 195, 211, "roja"],
  [290, 177, 195, 211, "roja"],
  [450, 177, 450, 213, "azul"],
  [645, 177, 645, 213, "azul"],

  [195, 269, 195, 303, "roja"],
  [195, 269, 450, 303, "negra"],
  [450, 267, 450, 303, "azul"],
  [645, 267, 645, 303, "azul"],

  [195, 357, 195, 393, "roja"],
  [450, 357, 547, 393, "azul"],
  [645, 357, 547, 393, "azul"]
];

function ajustarTamañoDiagrama() {
  const wrapper = document.querySelector(".diagrama-wrapper");
  const diagrama = document.getElementById("diagrama");
  if (!wrapper || !diagrama) return;

  const maxAncho = wrapper.clientWidth;
  const maxAlto = wrapper.clientHeight;
  if (maxAncho <= 0 || maxAlto <= 0) return;

  const proporcion = ANCHO_V / ALTO_V;
  let ancho = maxAncho;
  let alto = ancho / proporcion;

  if (alto > maxAlto) {
    alto = maxAlto;
    ancho = alto * proporcion;
  }

  diagrama.style.width = ancho + "px";
  diagrama.style.height = alto + "px";
  diagrama.style.setProperty("--escala", (ancho / ANCHO_V).toFixed(4));
}

function construirDiagrama() {
  const contenedor = document.getElementById("diagrama");
  contenedor.innerHTML = "";

  // Líneas primero (quedan detrás de los casilleros)
  LINEAS.forEach(([x1, y1, x2, y2, color]) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const largo = Math.hypot(dx, dy);
    const angulo = Math.atan2(dy, dx) * (180 / Math.PI);

    const linea = document.createElement("div");
    linea.className = "linea " + color;
    linea.style.left = pctX(x1);
    linea.style.top = pctY(y1);
    linea.style.width = (largo / ANCHO_V * 100) + "%";
    linea.style.transform = `rotate(${angulo}deg)`;
    contenedor.appendChild(linea);
  });

  // Operadores
  OPERADORES.forEach((op) => {
    const el = document.createElement("div");
    el.className = "operador";
    el.textContent = op.simbolo;
    el.style.left = pctX(op.x - 14);
    el.style.top = pctY(op.y - 16);
    el.style.width = pctX(28);
    el.style.height = pctY(32);
    contenedor.appendChild(el);
  });

  // Casilleros
  CASILLEROS.forEach((c) => {
    const el = document.createElement("div");
    el.className = "caja " + (c.tipo === "fija" ? "fija" : c.tipo === "destacada" ? "destacada" : "");
    el.id = "caja-" + c.id;
    el.style.left = pctX(c.x - c.w / 2);
    el.style.top = pctY(c.y - c.h / 2);
    el.style.width = pctX(c.w);
    el.style.height = pctY(c.h);

    if (c.tipo === "fija") {
      el.textContent = "";
      el.dataset.fija = "true";
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.id = "input-" + c.id;
      if (c.tipo === "destacada") {
        input.placeholder = "?";
      } else {
        // Casillero de descomposición: en las primeras restas se corrige
        // apenas el alumno termina de completarlo.
        input.addEventListener("blur", () => {
          if (!esModoGuiado(indiceActual)) return;
          if (input.value.trim() === "") return;

          const esperado = ejercicios[indiceActual].esperados[c.id];
          const ingresado = parseInt(input.value, 10);

          if (ingresado === esperado) {
            el.classList.remove("error");
            el.classList.add("correcto");
            input.readOnly = true;
          } else {
            el.classList.add("error");
            setTimeout(() => {
              el.classList.remove("error");
              input.value = "";
              input.focus();
            }, 450);
          }
        });
      }
      el.appendChild(input);
    }
    contenedor.appendChild(el);
  });
}

/* =========================================================
   Carga y control de ejercicios
   ========================================================= */
function cargarEjercicio(indice) {
  const ej = ejercicios[indice];

  document.getElementById("emoji-personaje").textContent = ej.emoji;
  const pronombre = ej.genero === "f" ? "Cuántas" : "Cuántos";
  document.getElementById("texto-problema").textContent =
    `${ej.nombre} tenía ${ej.a} ${ej.objeto} y ${ej.accion} ${ej.b}. ¿${pronombre} ${ej.objeto} le quedaron?`;

  document.getElementById("caja-boxA").textContent = ej.a;
  document.getElementById("caja-boxB").textContent = ej.b;

  // Limpiar todos los casilleros del esquema (valor, bloqueo y estilos)
  document.querySelectorAll(".caja input").forEach((inp) => {
    inp.value = "";
    inp.readOnly = false;
  });
  document.querySelectorAll(".caja").forEach((c) => {
    c.classList.remove("correcto", "error");
  });
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";

  document.getElementById("contador").textContent = `Ejercicio ${indice + 1} de ${TOTAL_EJERCICIOS}`;
  document.getElementById("barra-relleno").style.width = (indice / TOTAL_EJERCICIOS * 100) + "%";
}

function verificarRespuesta() {
  const ej = ejercicios[indiceActual];
  const inputFinal = document.getElementById("input-respuestaFinalCaja");
  const cajaFinal = document.getElementById("caja-respuestaFinalCaja");
  const valor = parseInt(inputFinal.value, 10);
  const feedback = document.getElementById("feedback");

  if (isNaN(valor)) {
    feedback.textContent = "✍️ Completá el resultado final antes de verificar.";
    feedback.className = "feedback incorrecto";
    return;
  }

  if (valor === ej.resultado) {
    estrellas++;
    document.getElementById("estrellas").textContent = "⭐ " + estrellas;
    feedback.textContent = "🎉 ¡Muy bien! Resultado correcto.";
    feedback.className = "feedback correcto";
    cajaFinal.classList.remove("error");
    lanzarConfeti(18);

    setTimeout(() => {
      if (indiceActual + 1 < TOTAL_EJERCICIOS) {
        indiceActual++;
        cargarEjercicio(indiceActual);
      } else {
        mostrarPantallaFinal();
      }
    }, 1100);
  } else {
    feedback.textContent = "🤔 Revisá tus cálculos, ¡vos podés!";
    feedback.className = "feedback incorrecto";
    cajaFinal.classList.add("error");
    setTimeout(() => {
      cajaFinal.classList.remove("error");
      inputFinal.value = "";
      inputFinal.focus();
    }, 450);
  }
}

function mostrarPantallaFinal() {
  document.getElementById("barra-relleno").style.width = "100%";
  document.getElementById("resumen-estrellas").textContent = `⭐ ${estrellas} de ${TOTAL_EJERCICIOS}`;
  document.getElementById("pantalla-final").classList.remove("oculto");
  lanzarConfeti(60);
}

function reiniciarJuego() {
  estrellas = 0;
  indiceActual = 0;
  document.getElementById("estrellas").textContent = "⭐ 0";
  generarEjercicios();
  cargarEjercicio(0);
  document.getElementById("pantalla-final").classList.add("oculto");
}

/* ---------- Confeti ---------- */
const EMOJIS_CONFETI = ["🎉", "⭐", "🎊", "✨", "🏅"];

function lanzarConfeti(cantidad) {
  const contenedor = document.getElementById("confetti-container");
  for (let i = 0; i < cantidad; i++) {
    const pieza = document.createElement("span");
    pieza.className = "confeti";
    pieza.textContent = EMOJIS_CONFETI[Math.floor(Math.random() * EMOJIS_CONFETI.length)];
    pieza.style.left = Math.random() * 100 + "vw";
    const duracion = 2 + Math.random() * 1.5;
    pieza.style.animationDuration = duracion + "s";
    contenedor.appendChild(pieza);
    setTimeout(() => pieza.remove(), duracion * 1000 + 100);
  }
}

/* ---------- Inicialización ---------- */
document.addEventListener("DOMContentLoaded", () => {
  construirDiagrama();
  ajustarTamañoDiagrama();
  generarEjercicios();
  cargarEjercicio(0);

  document.getElementById("btn-verificar").addEventListener("click", verificarRespuesta);
  document.getElementById("btn-reiniciar").addEventListener("click", reiniciarJuego);

  document.getElementById("input-respuestaFinalCaja")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") verificarRespuesta();
  });

  let temporizadorResize = null;
  window.addEventListener("resize", () => {
    clearTimeout(temporizadorResize);
    temporizadorResize = setTimeout(ajustarTamañoDiagrama, 120);
  });
});
