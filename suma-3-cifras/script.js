/* =========================================================
   Sumas de 3 cifras - 2° grado
   Esquema de resolución por descomposición (centenas / decenas / unidades)
   ========================================================= */

const TOTAL_EJERCICIOS = 20;

/* ---------- Historias / personajes ---------- */
const HISTORIAS = [
  { emoji: "🎴", texto: "Rafael juntó figuritas. Tenía {a} figuritas de fútbol y su hermano le regaló {b} figuritas de dinosaurios. ¿Cuántas figuritas tiene en total?" },
  { emoji: "📚", texto: "A la biblioteca de la escuela llegaron {a} libros de cuentos y {b} libros de aventuras. ¿Cuántos libros llegaron en total?" },
  { emoji: "🔘", texto: "Mateo juntó tapitas para un proyecto. Tiene {a} tapitas verdes y {b} tapitas azules. ¿Cuántas tapitas juntó en total?" },
  { emoji: "🌼", texto: "En el jardín de la escuela aparecieron diferentes flores. Había {a} flores amarillas y {b} flores rosas. ¿Cuántas flores había en total?" },
  { emoji: "✏️", texto: "Sofía guardó lápices en una caja. Tiene {a} lápices de colores y {b} lápices negros. ¿Cuántos lápices tiene en total?" },
  { emoji: "🥫", texto: "En una campaña solidaria juntaron alimentos. Reunieron {a} paquetes de fideos y {b} paquetes de arroz. ¿Cuántos alimentos reunieron en total?" },
  { emoji: "🧸", texto: "En una fábrica prepararon juguetes. Fabricaron {a} pelotas y {b} autitos. ¿Cuántos juguetes fabricaron en total?" },
  { emoji: "🌟", texto: "Valentina colecciona stickers. Tiene {a} stickers de animales y {b} stickers de deportes. ¿Cuántos stickers tiene en total?" },
  { emoji: "🍬", texto: "Julián junta caramelos. Tiene {a} caramelos de menta y {b} caramelos de frutilla. ¿Cuántos caramelos tiene en total?" },
  { emoji: "🔵", texto: "Camila colecciona cuentas de colores. Tiene {a} cuentas redondas y {b} cuentas cuadradas. ¿Cuántas cuentas tiene en total?" },
  { emoji: "🚗", texto: "Tomás guarda autitos de juguete. Tiene {a} autitos de carrera y {b} autitos de policía. ¿Cuántos autitos tiene en total?" },
  { emoji: "🃏", texto: "Un club de coleccionistas reunió cartas. Juntaron {a} cartas de fútbol y {b} cartas de animales. ¿Cuántas cartas juntaron en total?" },
  { emoji: "🌻", texto: "Abril guarda semillas para plantar. Tiene {a} semillas de girasol y {b} semillas de zapallo. ¿Cuántas semillas tiene en total?" },
  { emoji: "🟤", texto: "Nicolás junta botones para el arte. Tiene {a} botones grandes y {b} botones chicos. ¿Cuántos botones tiene en total?" },
  { emoji: "🪙", texto: "Renata ahorra monedas. Tiene {a} monedas de un peso y {b} monedas de dos pesos. ¿Cuántas monedas tiene en total?" },
  { emoji: "🪨", texto: "Benjamín junta piedritas en el patio. Tiene {a} piedritas blancas y {b} piedritas grises. ¿Cuántas piedritas tiene en total?" },
  { emoji: "🐚", texto: "Zoe recolectó conchitas en la playa. Encontró {a} conchitas grandes y {b} conchitas chicas. ¿Cuántas conchitas encontró en total?" },
  { emoji: "🍂", texto: "Ian junta hojas secas en otoño. Recolectó {a} hojas amarillas y {b} hojas marrones. ¿Cuántas hojas recolectó en total?" },
  { emoji: "📷", texto: "Mía guarda fotos en un álbum. Tiene {a} fotos viejas y {b} fotos nuevas. ¿Cuántas fotos tiene en total?" },
  { emoji: "📮", texto: "Julieta colecciona sellos. Tiene {a} sellos nacionales y {b} sellos internacionales. ¿Cuántos sellos tiene en total?" }
];

/* ---------- Estado del juego ---------- */
let ejercicios = [];
let indiceActual = 0;
let estrellas = 0;

const EJERCICIOS_GUIADOS = 4; // en estas primeras sumas se corrige cada casillero
function esModoGuiado(indice) {
  return indice < EJERCICIOS_GUIADOS;
}

/* ---------- Generación de números de 3 cifras SIN reagrupación -----------
   Se genera cada dígito (centena, decena, unidad) de ambos números de
   forma que la suma de cada posición sea menor a 10, tal como en el
   material de referencia (ninguno de los ejemplos lleva "dificultad"). */
function generarNumeros() {
  const hA = 1 + Math.floor(Math.random() * 8);       // 1 a 8
  const hB = 1 + Math.floor(Math.random() * (9 - hA)); // 1 a (9-hA)
  const dA = Math.floor(Math.random() * 10);            // 0 a 9
  const dB = Math.floor(Math.random() * (10 - dA));     // 0 a (9-dA)
  const uA = Math.floor(Math.random() * 10);
  const uB = Math.floor(Math.random() * (10 - uA));

  const a = hA * 100 + dA * 10 + uA;
  const b = hB * 100 + dB * 10 + uB;
  return { a, b };
}

function generarEjercicios() {
  const historiasBarajadas = [...HISTORIAS].sort(() => Math.random() - 0.5);
  ejercicios = historiasBarajadas.slice(0, TOTAL_EJERCICIOS).map((historia) => {
    const { a, b } = generarNumeros();
    return { ...historia, a, b, resultado: a + b, esperados: calcularEsperados(a, b) };
  });
}

/* Valores correctos de cada casillero del esquema de descomposición,
   siguiendo el orden del PDF de referencia:
   1) cada número se separa en centena, decena y unidad (6 casilleros: C1,D1,U1,C2,D2,U2)
   2) esos mismos 6 valores se repiten en un segundo nivel (C1b,D1b,U1b,C2b,D2b,U2b)
   3) se suman los valores de cada posición por separado
   4) esas tres sumas se combinan en el resultado final */
function calcularEsperados(a, b) {
  const C1 = Math.floor(a / 100) * 100;
  const D1 = Math.floor((a % 100) / 10) * 10;
  const U1 = a % 10;
  const C2 = Math.floor(b / 100) * 100;
  const D2 = Math.floor((b % 100) / 10) * 10;
  const U2 = b % 10;

  const C1b = C1, D1b = D1, U1b = U1;
  const C2b = C2, D2b = D2, U2b = U2;

  const centenaSuma = C1b + C2b;
  const decenaSuma = D1b + D2b;
  const unidadSuma = U1b + U2b;

  return {
    C1, D1, U1, C2, D2, U2,
    C1b, D1b, U1b, C2b, D2b, U2b,
    centenaSuma, decenaSuma, unidadSuma
  };
}

/* =========================================================
   Construcción visual del esquema (una sola vez)
   Espacio virtual de referencia: 960 x 480
   ========================================================= */
const ANCHO_V = 960;
const ALTO_V = 480;

function pctX(x) { return (x / ANCHO_V * 100) + "%"; }
function pctY(y) { return (y / ALTO_V * 100) + "%"; }

// Definición de casilleros: {id, x, y, w, h, tipo}
const CASILLEROS = [
  { id: "boxA", x: 270, y: 60,  w: 110, h: 58, tipo: "fija" },
  { id: "boxB", x: 630, y: 60,  w: 110, h: 58, tipo: "fija" },

  // Nivel 1: descomposición agrupada por número (C,D,U de A, luego C,D,U de B)
  { id: "C1", x: 160, y: 170, w: 86, h: 54, tipo: "input" },
  { id: "D1", x: 270, y: 170, w: 86, h: 54, tipo: "input" },
  { id: "U1", x: 380, y: 170, w: 86, h: 54, tipo: "input" },
  { id: "C2", x: 520, y: 170, w: 86, h: 54, tipo: "input" },
  { id: "D2", x: 630, y: 170, w: 86, h: 54, tipo: "input" },
  { id: "U2", x: 740, y: 170, w: 86, h: 54, tipo: "input" },

  // Nivel 2: los mismos valores, reagrupados por posición (centena con centena, etc.)
  { id: "C1b", x: 125, y: 280, w: 86, h: 54, tipo: "input" },
  { id: "C2b", x: 235, y: 280, w: 86, h: 54, tipo: "input" },
  { id: "D1b", x: 395, y: 280, w: 86, h: 54, tipo: "input" },
  { id: "D2b", x: 505, y: 280, w: 86, h: 54, tipo: "input" },
  { id: "U1b", x: 665, y: 280, w: 86, h: 54, tipo: "input" },
  { id: "U2b", x: 775, y: 280, w: 86, h: 54, tipo: "input" },

  { id: "centenaSuma", x: 180, y: 400, w: 86, h: 54, tipo: "input" },
  { id: "decenaSuma", x: 450, y: 400, w: 86, h: 54, tipo: "input" },
  { id: "unidadSuma", x: 720, y: 400, w: 86, h: 54, tipo: "input" },
  { id: "respuestaFinalCaja", x: 860, y: 400, w: 118, h: 62, tipo: "destacada" }
];

const OPERADORES = [
  { simbolo: "+", x: 450, y: 60 },

  { simbolo: "+", x: 215, y: 170 },
  { simbolo: "+", x: 325, y: 170 },
  { simbolo: "+", x: 575, y: 170 },
  { simbolo: "+", x: 685, y: 170 },

  { simbolo: "+", x: 180, y: 280 },
  { simbolo: "+", x: 450, y: 280 },
  { simbolo: "+", x: 720, y: 280 },

  { simbolo: "+", x: 315, y: 400 },
  { simbolo: "+", x: 585, y: 400 },
  { simbolo: "=", x: 785, y: 400 }
];

// Líneas: [x1, y1, x2, y2, color]
// Verde = tramo de centenas, Azul = tramo de decenas, Rojo = tramo de unidades
const LINEAS = [
  [270, 89, 160, 143, "verde"],
  [270, 89, 270, 143, "azul"],
  [270, 89, 380, 143, "roja"],
  [630, 89, 520, 143, "verde"],
  [630, 89, 630, 143, "azul"],
  [630, 89, 740, 143, "roja"],

  [160, 197, 125, 253, "verde"],
  [520, 197, 235, 253, "verde"],
  [270, 197, 395, 253, "azul"],
  [630, 197, 505, 253, "azul"],
  [380, 197, 665, 253, "roja"],
  [740, 197, 775, 253, "roja"],

  [125, 307, 180, 373, "verde"],
  [235, 307, 180, 373, "verde"],
  [395, 307, 450, 373, "azul"],
  [505, 307, 450, 373, "azul"],
  [665, 307, 720, 373, "roja"],
  [775, 307, 720, 373, "roja"]
];

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
        // Casillero de descomposición: en las primeras sumas se corrige
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

/* =========================================================
   Carga y control de ejercicios
   ========================================================= */
function cargarEjercicio(indice) {
  const ej = ejercicios[indice];

  document.getElementById("emoji-personaje").textContent = ej.emoji;
  document.getElementById("texto-problema").textContent =
    ej.texto.replace("{a}", ej.a).replace("{b}", ej.b);

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
