/* =========================================================
   CONSTRUIMOS NUESTRA ESCUELA
   App educativa de maquetas 3D con cuerpos geométricos
   para 2.º grado.

   ÍNDICE
   1. Configuración (la docente puede editar esta parte)
   2. Estado de la app
   3. Utilidades
   4. Íconos de los cuerpos (SVG)
   5. Texturas
   6. Escena 3D (Three.js)
   7. Cámara y vistas
   8. Crear, elegir y modificar cuerpos
   9. Deshacer y rehacer
   10. Arrastrar en la escena
   11. Panel derecho
   12. Pantallas: bienvenida y lugares
   13. Desafíos
   14. Clasificación: ¿rueda o no rueda?
   15. Mostrar mi maqueta e imágenes
   16. Ventanas, avisos y teclado
   17. Inicio
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. CONFIGURACIÓN — la docente puede cambiar textos,
        colores, lugares, ideas y desafíos desde acá.
     ========================================================= */

  /* Cuerpos geométricos.
     - medidas: ancho, alto y profundidad del cuerpo al agregarlo.
     - caras, vertices, aristas: se muestran en la ficha. */
  const CUERPOS = {
    prisma: {
      nombre: 'Prisma rectangular',
      color: '#3ba7e0',
      rueda: false,
      medidas: [3, 1.5, 1.5],
      texto: 'Tiene caras planas con forma de rectángulo. No rueda.',
      caras: 6, vertices: 8, aristas: 12,
      ejemplos: 'edificio, aula, armario, escritorio, ladrillo'
    },
    cubo: {
      nombre: 'Cubo',
      color: '#e5483b',
      rueda: false,
      medidas: [2, 2, 2],
      texto: 'Es un cuerpo con caras planas. Todas sus caras son cuadrados iguales. No rueda.',
      caras: 6, vertices: 8, aristas: 12,
      ejemplos: 'caja, dado, depósito'
    },
    cilindro: {
      nombre: 'Cilindro',
      color: '#2fa866',
      rueda: true,
      medidas: [2, 2, 2],
      texto: 'Tiene dos caras planas redondas y una parte curva. Si lo acostás, rueda.',
      caras: 2, vertices: 0, aristas: 2,
      ejemplos: 'columna, tacho de basura, tubo'
    },
    esfera: {
      nombre: 'Esfera',
      color: '#ffc83d',
      rueda: true,
      medidas: [2, 2, 2],
      texto: 'Es toda curva, como una pelota. No tiene caras planas ni puntas. Rueda para todos lados.',
      caras: 0, vertices: 0, aristas: 0,
      ejemplos: 'pelota, globo terráqueo, luminaria'
    },
    cono: {
      nombre: 'Cono',
      color: '#f28c28',
      rueda: true,
      medidas: [2, 2, 2],
      texto: 'Tiene una cara plana redonda, una parte curva y una punta. Rueda dando vueltas en círculo.',
      caras: 1, vertices: 1, aristas: 1,
      ejemplos: 'cono de tránsito, gorrito de cumpleaños, embudo'
    },
    piramide: {
      nombre: 'Pirámide',
      nombreLargo: 'Pirámide de base cuadrada',
      color: '#8a63d2',
      rueda: false,
      medidas: [2, 2, 2],
      texto: 'Tiene una base cuadrada y caras con forma de triángulo que se juntan en una punta. No rueda.',
      caras: 5, vertices: 5, aristas: 8,
      ejemplos: 'techo, torre, adorno'
    }
  };

  /* Orden en que aparecen los cuerpos en el panel izquierdo */
  const ORDEN_CUERPOS = ['prisma', 'cubo', 'cilindro', 'esfera', 'cono', 'piramide'];

  /* Colores para pintar los cuerpos (siempre con su nombre escrito) */
  const COLORES = [
    { nombre: 'Rojo', hex: '#e5483b' },
    { nombre: 'Naranja', hex: '#f28c28' },
    { nombre: 'Amarillo', hex: '#ffc83d' },
    { nombre: 'Verde', hex: '#2fa866' },
    { nombre: 'Celeste', hex: '#6cc4f0' },
    { nombre: 'Azul', hex: '#2f63c4' },
    { nombre: 'Violeta', hex: '#8a63d2' },
    { nombre: 'Rosa', hex: '#f08fb8' },
    { nombre: 'Marrón', hex: '#9a6436' },
    { nombre: 'Blanco', hex: '#f7f7f2' },
    { nombre: 'Gris', hex: '#9aa3b2' },
    { nombre: 'Negro', hex: '#3a3f4b' }
  ];

  /* Texturas sencillas (se dibujan con código, no usan imágenes externas) */
  const TEXTURAS = [
    { id: 'lisa', nombre: 'Lisa' },
    { id: 'ladrillos', nombre: 'Ladrillos' },
    { id: 'madera', nombre: 'Madera' },
    { id: 'baldosas', nombre: 'Baldosas' },
    { id: 'ventanas', nombre: 'Ventanas' },
    { id: 'pasto', nombre: 'Pasto' },
    { id: 'lunares', nombre: 'Lunares' },
    { id: 'rayas', nombre: 'Rayas' }
  ];

  /* Lugares de la escuela.
     - piso: color del piso de la maqueta.
     - ideas: sugerencias que relacionan objetos con cuerpos.
       escala: [ancho, alto, profundidad] respecto del cuerpo original. */
  const LUGARES = [
    {
      id: 'aula', nombre: 'Aula', emoji: '🏫', piso: '#f3e1c0',
      ideas: [
        { objeto: 'Pared', cuerpo: 'prisma', escala: [3, 1.4, 0.12], color: '#f7f7f2', textura: 'ladrillos' },
        { objeto: 'Pizarrón', cuerpo: 'prisma', escala: [1.2, 1, 0.08], color: '#2fa866', textura: 'lisa' },
        { objeto: 'Mesa', cuerpo: 'prisma', escala: [0.6, 0.5, 0.8], color: '#9a6436', textura: 'madera' },
        { objeto: 'Silla', cuerpo: 'cubo', escala: [0.35, 0.4, 0.35], color: '#2f63c4', textura: 'lisa' },
        { objeto: 'Cesto de basura', cuerpo: 'cilindro', escala: [0.3, 0.35, 0.3], color: '#9aa3b2', textura: 'lisa' },
        { objeto: 'Globo terráqueo', cuerpo: 'esfera', escala: [0.35, 0.35, 0.35], color: '#6cc4f0', textura: 'lisa' }
      ]
    },
    {
      id: 'patio', nombre: 'Patio', emoji: '⚽', piso: '#a8d98f',
      ideas: [
        { objeto: 'Pelota', cuerpo: 'esfera', escala: [0.35, 0.35, 0.35], color: '#e5483b', textura: 'lunares' },
        { objeto: 'Tronco de árbol', cuerpo: 'cilindro', escala: [0.3, 1.1, 0.3], color: '#9a6436', textura: 'madera' },
        { objeto: 'Copa del árbol', cuerpo: 'esfera', escala: [1, 1, 1], color: '#2fa866', textura: 'pasto' },
        { objeto: 'Cono de juego', cuerpo: 'cono', escala: [0.3, 0.35, 0.3], color: '#f28c28', textura: 'rayas' },
        { objeto: 'Banco', cuerpo: 'prisma', escala: [0.6, 0.3, 0.3], color: '#9a6436', textura: 'madera' },
        { objeto: 'Mástil', cuerpo: 'cilindro', escala: [0.07, 2.5, 0.07], color: '#9aa3b2', textura: 'lisa' }
      ]
    },
    {
      id: 'biblioteca', nombre: 'Biblioteca', emoji: '📚', piso: '#ead5b3',
      ideas: [
        { objeto: 'Estante', cuerpo: 'prisma', escala: [1, 1.3, 0.3], color: '#9a6436', textura: 'madera' },
        { objeto: 'Libro', cuerpo: 'prisma', escala: [0.12, 0.3, 0.22], color: '#e5483b', textura: 'lisa' },
        { objeto: 'Mesa redonda', cuerpo: 'cilindro', escala: [0.8, 0.35, 0.8], color: '#9a6436', textura: 'madera' },
        { objeto: 'Lámpara', cuerpo: 'cono', escala: [0.3, 0.25, 0.3], color: '#ffc83d', textura: 'lisa' },
        { objeto: 'Globo terráqueo', cuerpo: 'esfera', escala: [0.35, 0.35, 0.35], color: '#6cc4f0', textura: 'lisa' }
      ]
    },
    {
      id: 'direccion', nombre: 'Dirección', emoji: '🗂️', piso: '#ddd7f0',
      ideas: [
        { objeto: 'Escritorio', cuerpo: 'prisma', escala: [0.8, 0.5, 0.5], color: '#9a6436', textura: 'madera' },
        { objeto: 'Silla', cuerpo: 'cubo', escala: [0.35, 0.4, 0.35], color: '#3a3f4b', textura: 'lisa' },
        { objeto: 'Armario', cuerpo: 'prisma', escala: [0.6, 1.3, 0.35], color: '#9aa3b2', textura: 'lisa' },
        { objeto: 'Maceta', cuerpo: 'cilindro', escala: [0.25, 0.25, 0.25], color: '#f28c28', textura: 'lisa' },
        { objeto: 'Planta', cuerpo: 'esfera', escala: [0.35, 0.35, 0.35], color: '#2fa866', textura: 'pasto' }
      ]
    },
    {
      id: 'secretaria', nombre: 'Secretaría', emoji: '📋', piso: '#d8ecf7',
      ideas: [
        { objeto: 'Mostrador', cuerpo: 'prisma', escala: [1.2, 0.7, 0.4], color: '#f7f7f2', textura: 'madera' },
        { objeto: 'Caja de archivos', cuerpo: 'cubo', escala: [0.3, 0.3, 0.3], color: '#9a6436', textura: 'lisa' },
        { objeto: 'Pantalla de computadora', cuerpo: 'prisma', escala: [0.25, 0.3, 0.05], color: '#3a3f4b', textura: 'lisa' },
        { objeto: 'Tacho de basura', cuerpo: 'cilindro', escala: [0.3, 0.35, 0.3], color: '#9aa3b2', textura: 'lisa' }
      ]
    },
    {
      id: 'banos', nombre: 'Baños', emoji: '🚻', piso: '#e3f1f5',
      ideas: [
        { objeto: 'Pared con azulejos', cuerpo: 'prisma', escala: [3, 1.4, 0.12], color: '#6cc4f0', textura: 'baldosas' },
        { objeto: 'Lavamanos', cuerpo: 'prisma', escala: [0.35, 0.5, 0.3], color: '#f7f7f2', textura: 'lisa' },
        { objeto: 'Inodoro', cuerpo: 'cilindro', escala: [0.3, 0.3, 0.35], color: '#f7f7f2', textura: 'lisa' },
        { objeto: 'Espejo', cuerpo: 'prisma', escala: [0.3, 0.5, 0.03], color: '#6cc4f0', textura: 'lisa' },
        { objeto: 'Tacho', cuerpo: 'cilindro', escala: [0.25, 0.3, 0.25], color: '#9aa3b2', textura: 'lisa' }
      ]
    },
    {
      id: 'hall', nombre: 'Hall', emoji: '🏛️', piso: '#efe6d6',
      ideas: [
        { objeto: 'Columna', cuerpo: 'cilindro', escala: [0.3, 1.8, 0.3], color: '#f7f7f2', textura: 'lisa' },
        { objeto: 'Techo', cuerpo: 'piramide', escala: [2, 0.6, 2], color: '#e5483b', textura: 'rayas' },
        { objeto: 'Luminaria', cuerpo: 'esfera', escala: [0.25, 0.25, 0.25], color: '#ffc83d', textura: 'lisa' },
        { objeto: 'Banco', cuerpo: 'prisma', escala: [0.6, 0.3, 0.3], color: '#9a6436', textura: 'madera' },
        { objeto: 'Maceta', cuerpo: 'cilindro', escala: [0.25, 0.25, 0.25], color: '#f28c28', textura: 'lisa' }
      ]
    },
    {
      id: 'entrada', nombre: 'Entrada', emoji: '🚪', piso: '#dcdcdc',
      ideas: [
        { objeto: 'Pared con ventanas', cuerpo: 'prisma', escala: [3, 1.4, 0.15], color: '#f7f7f2', textura: 'ventanas' },
        { objeto: 'Puerta', cuerpo: 'prisma', escala: [0.45, 0.9, 0.08], color: '#9a6436', textura: 'madera' },
        { objeto: 'Techo', cuerpo: 'piramide', escala: [2, 0.6, 2], color: '#e5483b', textura: 'rayas' },
        { objeto: 'Columna', cuerpo: 'cilindro', escala: [0.25, 1.4, 0.25], color: '#f7f7f2', textura: 'lisa' },
        { objeto: 'Cartel', cuerpo: 'prisma', escala: [0.5, 0.25, 0.05], color: '#ffc83d', textura: 'lisa' }
      ]
    },
    {
      id: 'gimnasio', nombre: 'Gimnasio', emoji: '🏀', piso: '#f2c98a',
      ideas: [
        { objeto: 'Pelota', cuerpo: 'esfera', escala: [0.35, 0.35, 0.35], color: '#f28c28', textura: 'rayas' },
        { objeto: 'Cono de entrenamiento', cuerpo: 'cono', escala: [0.3, 0.35, 0.3], color: '#f28c28', textura: 'lisa' },
        { objeto: 'Colchoneta', cuerpo: 'prisma', escala: [0.8, 0.08, 0.8], color: '#2f63c4', textura: 'lisa' },
        { objeto: 'Cajón de salto', cuerpo: 'prisma', escala: [0.45, 0.5, 0.5], color: '#9a6436', textura: 'madera' },
        { objeto: 'Poste del aro', cuerpo: 'cilindro', escala: [0.07, 1.8, 0.07], color: '#9aa3b2', textura: 'lisa' }
      ]
    },
    {
      id: 'comedor', nombre: 'Comedor', emoji: '🍽️', piso: '#f7e3cf',
      ideas: [
        { objeto: 'Mesa larga', cuerpo: 'prisma', escala: [1.2, 0.45, 0.5], color: '#9a6436', textura: 'madera' },
        { objeto: 'Silla', cuerpo: 'cubo', escala: [0.3, 0.35, 0.3], color: '#2fa866', textura: 'lisa' },
        { objeto: 'Vaso', cuerpo: 'cilindro', escala: [0.1, 0.15, 0.1], color: '#6cc4f0', textura: 'lisa' },
        { objeto: 'Fruta', cuerpo: 'esfera', escala: [0.12, 0.12, 0.12], color: '#e5483b', textura: 'lisa' },
        { objeto: 'Olla', cuerpo: 'cilindro', escala: [0.3, 0.25, 0.3], color: '#9aa3b2', textura: 'lisa' }
      ]
    }
  ];

  /* Lugar libre: "Crear mi propio espacio" */
  const LUGAR_PROPIO = {
    id: 'propio', nombre: 'Mi propio espacio', emoji: '✏️', piso: '#e8eef5',
    ideas: [
      { objeto: 'Pared', cuerpo: 'prisma', escala: [3, 1.4, 0.12], color: '#f7f7f2', textura: 'ladrillos' },
      { objeto: 'Columna', cuerpo: 'cilindro', escala: [0.3, 1.8, 0.3], color: '#f7f7f2', textura: 'lisa' },
      { objeto: 'Techo', cuerpo: 'piramide', escala: [2, 0.6, 2], color: '#e5483b', textura: 'rayas' },
      { objeto: 'Caja', cuerpo: 'cubo', escala: [0.4, 0.4, 0.4], color: '#9a6436', textura: 'lisa' },
      { objeto: 'Pelota', cuerpo: 'esfera', escala: [0.35, 0.35, 0.35], color: '#e5483b', textura: 'lunares' }
    ]
  };

  /* Desafíos geométricos.
     - cumple(datos): devuelve true cuando el desafío está logrado.
       datos.cuenta tiene cuántos cuerpos hay de cada tipo,
       datos.tipos cuántos tipos distintos, datos.objetos el detalle.
     - pista: ayuda amable (nunca un mensaje negativo). */
  const DESAFIOS = [
    {
      id: 'columna',
      texto: 'Construí una columna usando cilindros.',
      pista: 'Agregá un cilindro y tocá «Más alto» para que parezca una columna.',
      cumple: (d) => d.cuenta.cilindro >= 2 ||
        d.objetos.some((o) => o.tipo === 'cilindro' && o.alto >= o.ancho * 1.5)
    },
    {
      id: 'aula',
      texto: 'Construí un aula utilizando prismas rectangulares.',
      pista: 'Usá al menos 3 prismas: paredes, mesas o el pizarrón.',
      cumple: (d) => d.cuenta.prisma >= 3
    },
    {
      id: 'pelota',
      texto: 'Agregá una pelota al patio usando una esfera.',
      pista: 'Buscá la esfera en el panel de la izquierda.',
      cumple: (d) => d.cuenta.esfera >= 1
    },
    {
      id: 'techo',
      texto: 'Construí un techo usando una pirámide.',
      pista: 'Arrastrá la pirámide y soltala arriba de otro cuerpo.',
      cumple: (d) => d.objetos.some((o) => o.tipo === 'piramide' && o.abajo > 0.3)
    },
    {
      id: 'tres',
      texto: 'Construí una parte de la escuela usando al menos 3 cuerpos geométricos diferentes.',
      pista: 'Probá combinar cuerpos distintos: por ejemplo, un prisma, un cilindro y una esfera.',
      cumple: (d) => d.tipos >= 3
    },
    {
      id: 'rueda',
      texto: 'Usá un cuerpo que pueda rodar.',
      pista: 'Pensá: ¿qué cuerpos tienen partes curvas?',
      cumple: (d) => d.cuenta.esfera + d.cuenta.cilindro + d.cuenta.cono >= 1
    },
    {
      id: 'norueda',
      texto: 'Usá un cuerpo que no pueda rodar.',
      pista: 'Pensá: ¿qué cuerpos tienen todas sus caras planas?',
      cumple: (d) => d.cuenta.cubo + d.cuenta.prisma + d.cuenta.piramide >= 1
    }
  ];

  /* Mensaje que aparece al lograr un desafío */
  const MENSAJE_LOGRO = '¡Muy bien! Construiste tu espacio usando cuerpos geométricos.';

  /* Vistas de la cámara: theta = giro alrededor, phi = altura (0 = desde arriba) */
  const VISTAS = {
    libre:   { nombre: 'Vista 3D',       theta: 0.6,         phi: 0.95 },
    arriba:  { nombre: 'Desde arriba',   theta: 0,           phi: 0.02 },
    frente:  { nombre: 'De frente',      theta: 0,           phi: 1.38 },
    costado: { nombre: 'De costado',     theta: Math.PI / 2, phi: 1.38 }
  };

  /* Guardado en Google Drive.
     URL_GUARDADO: dirección de la "aplicación web" de Google Apps Script
     que guarda las imágenes en la carpeta de Drive (ver README.md).
     La carpeta de destino se define dentro de ese script, no acá. */
  const URL_GUARDADO = 'https://script.google.com/macros/s/AKfycbzg4EmFZ_skAGZW5OYQPYXGYiDuKqXv1MUegfnwv-0_1S3C0a_aVaVrPY0ixsB0wrLDMg/exec';

  /* Grados que el alumno puede elegir al guardar */
  const GRADOS = ['2ºA', '2ºB'];

  /* Orden y número de cada vista en el nombre del archivo (…-1.png a …-4.png) */
  const VISTAS_A_GUARDAR = ['libre', 'arriba', 'frente', 'costado'];

  const TAMANIO_BASE = 24;       // lado de la base de la maqueta
  const PASO_MOVER = 0.5;        // cuánto se mueve con cada toque
  const PASO_GIRO = Math.PI / 12; // 15 grados
  const FACTOR_TAMANIO = 1.15;   // cuánto agranda/achica cada toque
  const MAX_PASOS_DESHACER = 80;

  /* =========================================================
     2. ESTADO DE LA APP
     ========================================================= */
  const estado = {
    lugar: null,             // lugar elegido
    objetos: [],             // cuerpos que están en la maqueta
    seleccion: [],           // cuerpos elegidos
    modo: 'construir',       // 'construir' o 'explorar'
    elegirVarios: false,     // modo para elegir varios cuerpos con toques
    desafioActivo: null,
    desafiosLogrados: new Set(),
    siguienteId: 1
  };

  // Pilas para deshacer y rehacer (no usar el nombre "history": choca con el navegador)
  const pilaDeshacer = [];
  const pilaRehacer = [];

  /* =========================================================
     3. UTILIDADES
     ========================================================= */
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  /* Aclara (+) u oscurece (-) un color hex */
  function sombrear(hex, porcentaje) {
    const n = parseInt(hex.slice(1), 16);
    const ajustar = (c) => {
      const v = porcentaje < 0 ? c * (1 + porcentaje) : c + (255 - c) * porcentaje;
      return Math.max(0, Math.min(255, Math.round(v)));
    };
    const r = ajustar(n >> 16), g = ajustar((n >> 8) & 255), b = ajustar(n & 255);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const redondear = (valor, paso) => Math.round(valor / paso) * paso;
  const limitar = (valor, min, max) => Math.max(min, Math.min(max, valor));

  function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function nombreDeColor(hex) {
    const color = COLORES.find((c) => c.hex === hex);
    return color ? color.nombre : 'Color';
  }

  /* =========================================================
     4. ÍCONOS DE LOS CUERPOS (dibujos SVG)
     ========================================================= */
  function iconoCuerpo(tipo, colorPropio) {
    const c = colorPropio || CUERPOS[tipo].color;
    const claro = sombrear(c, 0.35);
    const oscuro = sombrear(c, -0.25);
    const t = 'stroke="#1f2a44" stroke-width="2.5" stroke-linejoin="round"';
    let dibujo = '';

    switch (tipo) {
      case 'cubo':
        dibujo = `<polygon points="12,24 38,24 38,52 12,52" fill="${c}" ${t}/>
          <polygon points="12,24 24,12 50,12 38,24" fill="${claro}" ${t}/>
          <polygon points="38,24 50,12 50,40 38,52" fill="${oscuro}" ${t}/>`;
        break;
      case 'prisma':
        dibujo = `<polygon points="5,32 40,32 40,52 5,52" fill="${c}" ${t}/>
          <polygon points="5,32 20,20 58,20 40,32" fill="${claro}" ${t}/>
          <polygon points="40,32 58,20 58,40 40,52" fill="${oscuro}" ${t}/>`;
        break;
      case 'esfera':
        dibujo = `<circle cx="32" cy="33" r="22" fill="${c}" ${t}/>
          <path d="M10 33 A22 7 0 0 0 54 33" fill="none" stroke="${oscuro}" stroke-width="2"/>
          <ellipse cx="24" cy="24" rx="6" ry="4" fill="#ffffff" opacity=".6"/>`;
        break;
      case 'cilindro':
        dibujo = `<path d="M14 16 V48 A18 6 0 0 0 50 48 V16 Z" fill="${c}" ${t}/>
          <ellipse cx="32" cy="16" rx="18" ry="6" fill="${claro}" ${t}/>`;
        break;
      case 'cono':
        dibujo = `<path d="M32 7 L14 48 A18 6 0 0 0 50 48 Z" fill="${c}" ${t}/>
          <path d="M14 48 A18 6 0 0 1 50 48" fill="none" stroke="#1f2a44" stroke-width="1.5" stroke-dasharray="3 3" opacity=".6"/>`;
        break;
      case 'piramide':
        dibujo = `<path d="M10 50 L26 38 L54 38 M26 38 L32 8" fill="none" stroke="#1f2a44" stroke-width="1.5" stroke-dasharray="3 3" opacity=".6"/>
          <polygon points="10,50 38,50 32,8" fill="${c}" ${t}/>
          <polygon points="38,50 54,38 32,8" fill="${oscuro}" ${t}/>`;
        break;
    }
    return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">${dibujo}</svg>`;
  }

  /* Dibujo de la pantalla de bienvenida: una escuela hecha con cuerpos */
  function dibujoEscuela() {
    const t = 'stroke="#1f2a44" stroke-width="3" stroke-linejoin="round"';
    const ventana = (x, y) => `<rect x="${x}" y="${y}" width="24" height="24" rx="3" fill="#dff1fb" ${t}/>
      <line x1="${x + 12}" y1="${y}" x2="${x + 12}" y2="${y + 24}" stroke="#1f2a44" stroke-width="2"/>`;
    const columna = (x) => `<path d="M${x} 196 V266 A9 3.5 0 0 0 ${x + 18} 266 V196 Z" fill="#f7f7f2" ${t}/>
      <ellipse cx="${x + 9}" cy="196" rx="9" ry="3.5" fill="#ffffff" ${t}/>`;
    return `<svg viewBox="0 0 400 330" role="img" aria-label="Una escuela armada con cuerpos geométricos">
      <polygon points="200,170 392,256 200,326 8,256" fill="#a8d98f" ${t}/>
      <g class="pieza" style="animation-delay:.05s">
        <polygon points="90,150 250,150 250,262 90,262" fill="#e5483b" ${t}/>
        <polygon points="90,150 122,128 282,128 250,150" fill="#f08a80" ${t}/>
        <polygon points="250,150 282,128 282,240 250,262" fill="#ab3228" ${t}/>
        ${ventana(104, 168)}${ventana(212, 168)}${ventana(104, 216)}${ventana(212, 216)}
        <rect x="158" y="206" width="30" height="56" rx="3" fill="#9a6436" ${t}/>
      </g>
      <g class="pieza" style="animation-delay:.25s">
        <polygon points="142,92 196,92 196,146 142,146" fill="#ffc83d" ${t}/>
        <polygon points="142,92 158,81 212,81 196,92" fill="#ffe08a" ${t}/>
        <polygon points="196,92 212,81 212,135 196,146" fill="#d9a21f" ${t}/>
        <circle cx="169" cy="119" r="14" fill="#ffffff" ${t}/>
        <path d="M169 110 V119 L176 123" fill="none" stroke="#1f2a44" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g class="pieza" style="animation-delay:.45s">
        <polygon points="142,92 196,92 176,34" fill="#8a63d2" ${t}/>
        <polygon points="196,92 212,81 176,34" fill="#5f3fa6" ${t}/>
      </g>
      <g class="pieza" style="animation-delay:.6s">${columna(134)}${columna(194)}</g>
      <g class="pieza" style="animation-delay:.75s">
        <path d="M58 236 L42 286 A16 5 0 0 0 74 286 Z" fill="#f28c28" ${t}/>
        <path d="M49 264 L67 264" stroke="#ffffff" stroke-width="5"/>
      </g>
      <g class="pieza" style="animation-delay:.9s">
        <polygon points="300,262 326,262 326,288 300,288" fill="#9a6436" ${t}/>
        <polygon points="300,262 309,255 335,255 326,262" fill="#c48b5a" ${t}/>
        <polygon points="326,262 335,255 335,281 326,288" fill="#6e4524" ${t}/>
      </g>
      <g class="pieza" style="animation-delay:1.05s">
        <circle cx="358" cy="282" r="17" fill="#2fa866" ${t}/>
        <ellipse cx="352" cy="275" rx="5" ry="3.5" fill="#ffffff" opacity=".6"/>
      </g>
    </svg>`;
  }

  /* =========================================================
     5. TEXTURAS (dibujadas en un canvas, en tonos claros
        para que el color elegido se vea encima)
     ========================================================= */
  const imagenesTextura = {};   // canvas de cada textura
  const texturasBase = {};      // THREE.Texture de cada textura

  /* Números "al azar" pero siempre iguales, para que las texturas no cambien */
  function azarFijo(semilla) {
    let s = semilla;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function dibujarTextura(id) {
    const lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = 256;
    const ctx = lienzo.getContext('2d');
    const azar = azarFijo(id.length * 97 + 13);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 256);

    if (id === 'ladrillos') {
      ctx.fillStyle = '#b8b8b8';
      ctx.fillRect(0, 0, 256, 256);
      for (let fila = 0; fila < 8; fila++) {
        const desplazamiento = fila % 2 ? -32 : 0;
        for (let col = 0; col < 5; col++) {
          const tono = 225 + Math.floor(azar() * 30);
          ctx.fillStyle = `rgb(${tono},${tono},${tono})`;
          ctx.fillRect(col * 64 + desplazamiento + 3, fila * 32 + 3, 58, 26);
        }
      }
    } else if (id === 'madera') {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(80,80,80,.28)';
      for (let i = 0; i < 22; i++) {
        const y = i * 12 + azar() * 6;
        ctx.lineWidth = 1 + azar() * 2.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= 256; x += 32) {
          ctx.lineTo(x, y + Math.sin(x / 40 + i) * 3);
        }
        ctx.stroke();
      }
    } else if (id === 'baldosas') {
      for (let f = 0; f < 4; f++) {
        for (let c = 0; c < 4; c++) {
          ctx.fillStyle = (f + c) % 2 ? '#ffffff' : '#e3e3e3';
          ctx.fillRect(c * 64, f * 64, 64, 64);
        }
      }
      ctx.strokeStyle = '#a9a9a9';
      ctx.lineWidth = 4;
      for (let i = 0; i <= 256; i += 64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
      }
    } else if (id === 'ventanas') {
      for (let f = 0; f < 2; f++) {
        for (let c = 0; c < 2; c++) {
          const x = 30 + c * 128, y = 30 + f * 128;
          ctx.fillStyle = '#6f7f9c';
          ctx.fillRect(x, y, 68, 68);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 31, y, 6, 68);
          ctx.fillRect(x, y + 31, 68, 6);
          ctx.strokeStyle = '#4b5670';
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, 68, 68);
        }
      }
    } else if (id === 'pasto') {
      ctx.fillStyle = '#eeeeee';
      ctx.fillRect(0, 0, 256, 256);
      ctx.lineWidth = 2;
      for (let i = 0; i < 500; i++) {
        const x = azar() * 256, y = azar() * 256;
        const tono = 150 + Math.floor(azar() * 90);
        ctx.strokeStyle = `rgb(${tono},${tono},${tono})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (azar() - 0.5) * 6, y - 6 - azar() * 6);
        ctx.stroke();
      }
    } else if (id === 'lunares') {
      ctx.fillStyle = '#c4c4c4';
      for (let f = 0; f < 4; f++) {
        for (let c = 0; c < 4; c++) {
          ctx.beginPath();
          ctx.arc(c * 64 + (f % 2 ? 32 : 0) + 16, f * 64 + 32, 13, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (id === 'rayas') {
      ctx.fillStyle = '#cfcfcf';
      for (let x = 0; x < 256; x += 64) ctx.fillRect(x, 0, 32, 256);
    }
    return lienzo;
  }

  function prepararTexturas() {
    TEXTURAS.forEach((textura) => {
      if (textura.id === 'lisa') return;
      const lienzo = dibujarTextura(textura.id);
      imagenesTextura[textura.id] = lienzo;
      const tex = new THREE.CanvasTexture(lienzo);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      texturasBase[textura.id] = tex;
    });
  }

  /* Cada cuerpo usa una copia de la textura, con repeticiones según su tamaño */
  function texturaParaCuerpo(mesh) {
    const id = mesh.userData.textura;
    if (!texturasBase[id]) return null;
    const tex = texturasBase[id].clone();
    tex.needsUpdate = true;
    ajustarRepeticionTextura(mesh, tex);
    return tex;
  }

  function ajustarRepeticionTextura(mesh, tex) {
    const textura = tex || mesh.material.map;
    if (!textura) return;
    const medidas = CUERPOS[mesh.userData.tipo].medidas;
    const ancho = medidas[0] * mesh.scale.x;
    const alto = medidas[1] * mesh.scale.y;
    textura.repeat.set(Math.max(1, Math.round(ancho / 1.5)), Math.max(1, Math.round(alto / 1.5)));
  }

  /* =========================================================
     6. ESCENA 3D (Three.js)
     ========================================================= */
  let renderer, escena3d, camara, grupoObjetos, piso;
  const geometrias = {};
  const geometriasBordes = {};
  let materialBordes;
  const raycaster = new THREE.Raycaster();
  const planoSuelo = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function crearGeometrias() {
    geometrias.cubo = new THREE.BoxGeometry(2, 2, 2);
    geometrias.prisma = new THREE.BoxGeometry(3, 1.5, 1.5);
    geometrias.esfera = new THREE.SphereGeometry(1, 40, 24);
    geometrias.cilindro = new THREE.CylinderGeometry(1, 1, 2, 40);
    geometrias.cono = new THREE.ConeGeometry(1, 2, 40);
    geometrias.piramide = new THREE.ConeGeometry(Math.SQRT2, 2, 4);
    geometrias.piramide.rotateY(Math.PI / 4); // base alineada con los ejes

    // Bordes (aristas) marcados con una línea oscura, para ver mejor caras y aristas
    Object.keys(geometrias).forEach((tipo) => {
      if (tipo !== 'esfera') geometriasBordes[tipo] = new THREE.EdgesGeometry(geometrias[tipo], 25);
    });
    materialBordes = new THREE.LineBasicMaterial({ color: 0x1f2a44, transparent: true, opacity: 0.55 });
  }

  function iniciarEscena3D() {
    const contenedor = $('#contenedor-3d');

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    contenedor.appendChild(renderer.domElement);

    escena3d = new THREE.Scene();
    escena3d.background = new THREE.Color('#cfe8fa');

    camara = new THREE.PerspectiveCamera(45, 1, 0.1, 300);

    // Luces
    escena3d.add(new THREE.HemisphereLight(0xffffff, 0xa9bcd6, 0.62));
    const sol = new THREE.DirectionalLight(0xffffff, 0.5);
    sol.position.set(9, 18, 12);
    sol.castShadow = true;
    sol.shadow.mapSize.set(2048, 2048);
    const s = TAMANIO_BASE / 2 + 4;
    Object.assign(sol.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 60 });
    escena3d.add(sol);

    crearBaseMaqueta();

    grupoObjetos = new THREE.Group();
    escena3d.add(grupoObjetos);

    crearGeometrias();
    prepararTexturas();

    new ResizeObserver(ajustarTamanio).observe(contenedor);
    ajustarTamanio();
    conectarPunteroEscena();
    requestAnimationFrame(animar);
  }

  /* Base de la maqueta: una tabla con piso cuadriculado y un cartel de "Frente" */
  function crearBaseMaqueta() {
    const tabla = new THREE.Mesh(
      new THREE.BoxGeometry(TAMANIO_BASE + 0.6, 0.4, TAMANIO_BASE + 0.6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
    );
    tabla.position.y = -0.21;
    tabla.receiveShadow = true;
    escena3d.add(tabla);

    // Cuadrícula del piso: cada cuadradito mide 1
    const lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = 64;
    const ctx = lienzo.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 64);
    ctx.strokeStyle = 'rgba(31,42,68,.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64);
    const texPiso = new THREE.CanvasTexture(lienzo);
    texPiso.wrapS = texPiso.wrapT = THREE.RepeatWrapping;
    texPiso.repeat.set(TAMANIO_BASE, TAMANIO_BASE);
    texPiso.anisotropy = 4;

    piso = new THREE.Mesh(
      new THREE.PlaneGeometry(TAMANIO_BASE, TAMANIO_BASE),
      new THREE.MeshStandardMaterial({ color: 0xe8eef5, map: texPiso, roughness: 0.95 })
    );
    piso.rotation.x = -Math.PI / 2;
    piso.receiveShadow = true;
    escena3d.add(piso);

    // Cartel "Frente" en el borde delantero (ayuda con las vistas)
    const cartel = document.createElement('canvas');
    cartel.width = 256;
    cartel.height = 64;
    const c2 = cartel.getContext('2d');
    c2.fillStyle = '#1f2a44';
    c2.font = '700 40px "Baloo 2", sans-serif';
    c2.textAlign = 'center';
    c2.textBaseline = 'middle';
    c2.fillText('▼ Frente ▼', 128, 34);
    const textoFrente = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 1),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cartel), transparent: true })
    );
    textoFrente.rotation.x = -Math.PI / 2;
    textoFrente.position.set(0, 0.01, TAMANIO_BASE / 2 - 0.6);
    escena3d.add(textoFrente);
  }

  function cambiarColorPiso(hex) {
    piso.material.color.set(hex);
  }

  function ajustarTamanio() {
    const contenedor = $('#contenedor-3d');
    const ancho = Math.max(1, contenedor.clientWidth);
    const alto = Math.max(1, contenedor.clientHeight);
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }

  /* Bucle de dibujo: suaviza la cámara y hace "latir" lo elegido */
  function animar(tiempo) {
    requestAnimationFrame(animar);
    moverCamaraSuave();
    const brillo = 0.2 + Math.sin(tiempo / 180) * 0.12;
    estado.objetos.forEach((m) => {
      m.material.emissiveIntensity = estado.seleccion.includes(m) ? brillo : 0;
    });
    renderer.render(escena3d, camara);
  }

  /* =========================================================
     7. CÁMARA Y VISTAS
     ========================================================= */
  const camaraActual = { objetivo: new THREE.Vector3(0, 0.5, 0), radio: 22, theta: 0.6, phi: 0.95 };
  const camaraDestino = { objetivo: new THREE.Vector3(0, 0.5, 0), radio: 22, theta: 0.6, phi: 0.95 };

  function posicionarCamara(c) {
    const sp = Math.sin(c.phi);
    camara.position.set(
      c.objetivo.x + c.radio * sp * Math.sin(c.theta),
      c.objetivo.y + c.radio * Math.cos(c.phi),
      c.objetivo.z + c.radio * sp * Math.cos(c.theta)
    );
    camara.lookAt(c.objetivo);
  }

  function moverCamaraSuave() {
    const k = 0.18;
    camaraActual.radio += (camaraDestino.radio - camaraActual.radio) * k;
    camaraActual.theta += (camaraDestino.theta - camaraActual.theta) * k;
    camaraActual.phi += (camaraDestino.phi - camaraActual.phi) * k;
    camaraActual.objetivo.lerp(camaraDestino.objetivo, k);
    posicionarCamara(camaraActual);
  }

  /* Centro y tamaño de todo lo construido, para encuadrar la cámara */
  function encuadre() {
    if (!estado.objetos.length) return { centro: new THREE.Vector3(0, 0.5, 0), radio: 16 };
    const caja = new THREE.Box3();
    estado.objetos.forEach((m) => caja.expandByObject(m));
    const centro = caja.getCenter(new THREE.Vector3());
    const tamanio = caja.getSize(new THREE.Vector3()).length();
    return { centro, radio: limitar(tamanio * 1.4, 9, 45) };
  }

  /* Cambia a una vista. Si "instantaneo" es true, no hace animación (sirve para las fotos) */
  function aplicarVista(id, instantaneo) {
    const vista = VISTAS[id];
    const { centro, radio } = encuadre();
    // Elegir el giro más cercano para que la cámara no dé vueltas de más
    const vueltas = Math.round((camaraDestino.theta - vista.theta) / (Math.PI * 2));
    camaraDestino.theta = vista.theta + vueltas * Math.PI * 2;
    camaraDestino.phi = vista.phi;
    camaraDestino.radio = id === 'arriba' ? radio * 1.1 : radio;
    camaraDestino.objetivo.copy(centro);
    if (id === 'arriba') camaraDestino.objetivo.y = 0;

    if (instantaneo) {
      camaraActual.theta = camaraDestino.theta;
      camaraActual.phi = camaraDestino.phi;
      camaraActual.radio = camaraDestino.radio;
      camaraActual.objetivo.copy(camaraDestino.objetivo);
      posicionarCamara(camaraActual);
    }
    marcarVistaActiva(id);
  }

  function marcarVistaActiva(id) {
    $$('.btn-vista').forEach((b) => b.classList.toggle('activa', b.dataset.vista === id));
  }

  /* Vector "hacia la derecha" de la pantalla, sobre el piso */
  function derechaDePantalla() {
    return new THREE.Vector3(Math.cos(camaraActual.theta), 0, -Math.sin(camaraActual.theta));
  }

  function accionCamara(accion) {
    const d = camaraDestino;
    switch (accion) {
      case 'girar-izq': d.theta -= 0.25; break;
      case 'girar-der': d.theta += 0.25; break;
      case 'arriba': d.phi = limitar(d.phi - 0.14, 0.02, 1.5); break;
      case 'abajo': d.phi = limitar(d.phi + 0.14, 0.02, 1.5); break;
      case 'acercar': d.radio = limitar(d.radio * 0.88, 4, 60); break;
      case 'alejar': d.radio = limitar(d.radio * 1.13, 4, 60); break;
      case 'izquierda': d.objetivo.addScaledVector(derechaDePantalla(), -d.radio * 0.05); break;
      case 'derecha': d.objetivo.addScaledVector(derechaDePantalla(), d.radio * 0.05); break;
      case 'centrar': {
        const { centro, radio } = encuadre();
        d.objetivo.copy(centro);
        d.radio = radio;
        break;
      }
    }
    if (accion !== 'centrar' && accion !== 'acercar' && accion !== 'alejar') marcarVistaActiva('libre');
  }

  /* Botones de cámara: si se mantienen apretados, repiten la acción */
  function conectarBotonesCamara() {
    $$('.btn-cam').forEach((boton) => {
      let repetir = null;
      const parar = () => { clearInterval(repetir); repetir = null; };
      boton.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        accionCamara(boton.dataset.cam);
        parar();
        if (boton.dataset.cam !== 'centrar') {
          repetir = setInterval(() => accionCamara(boton.dataset.cam), 130);
        }
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => boton.addEventListener(ev, parar));
      // Con teclado (Enter o espacio) también funciona
      boton.addEventListener('click', (e) => { if (e.detail === 0) accionCamara(boton.dataset.cam); });
    });
  }

  /* =========================================================
     8. CREAR, ELEGIR Y MODIFICAR CUERPOS
     ========================================================= */

  /* Crea el cuerpo 3D a partir de sus datos */
  function crearMesh(datos) {
    const esPlano = ['cubo', 'prisma', 'piramide'].includes(datos.tipo);
    const material = new THREE.MeshStandardMaterial({
      color: datos.color,
      roughness: 0.7,
      metalness: 0,
      flatShading: esPlano,
      emissive: 0xffffff,
      emissiveIntensity: 0
    });
    const mesh = new THREE.Mesh(geometrias[datos.tipo], material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      id: datos.id,
      tipo: datos.tipo,
      nombre: datos.nombre,
      color: datos.color,
      textura: datos.textura || 'lisa'
    };
    mesh.position.fromArray(datos.pos);
    mesh.quaternion.fromArray(datos.rot);
    mesh.scale.fromArray(datos.esc);
    material.map = texturaParaCuerpo(mesh);

    if (geometriasBordes[datos.tipo]) {
      mesh.add(new THREE.LineSegments(geometriasBordes[datos.tipo], materialBordes));
    }
    grupoObjetos.add(mesh);
    estado.objetos.push(mesh);
    return mesh;
  }

  function quitarMesh(mesh) {
    grupoObjetos.remove(mesh);
    if (mesh.material.map) mesh.material.map.dispose();
    mesh.material.dispose();
    estado.objetos = estado.objetos.filter((m) => m !== mesh);
    estado.seleccion = estado.seleccion.filter((m) => m !== mesh);
  }

  /* Caja que ocupa un cuerpo (sirve para apoyarlo en el piso o encima de otro) */
  function cajaDe(mesh) {
    mesh.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(mesh);
  }

  /* Pone la parte de abajo del cuerpo a la altura indicada */
  function apoyarEn(mesh, altura) {
    const caja = cajaDe(mesh);
    mesh.position.y += altura - caja.min.y;
  }

  /* Mantiene el cuerpo adentro de la base de la maqueta */
  function mantenerEnBase(mesh) {
    const limite = TAMANIO_BASE / 2 - 0.5;
    mesh.position.x = limitar(mesh.position.x, -limite, limite);
    mesh.position.z = limitar(mesh.position.z, -limite, limite);
  }

  /* Busca un lugar libre cerca del centro para un cuerpo nuevo */
  function lugarLibre() {
    const cx = redondear(camaraDestino.objetivo.x, PASO_MOVER);
    const cz = redondear(camaraDestino.objetivo.z, PASO_MOVER);
    for (let anillo = 0; anillo < 8; anillo++) {
      const cantidad = anillo === 0 ? 1 : anillo * 6;
      for (let i = 0; i < cantidad; i++) {
        const angulo = (i / cantidad) * Math.PI * 2;
        const x = redondear(cx + Math.cos(angulo) * anillo * 2.5, PASO_MOVER);
        const z = redondear(cz + Math.sin(angulo) * anillo * 2.5, PASO_MOVER);
        const ocupado = estado.objetos.some((m) => Math.hypot(m.position.x - x, m.position.z - z) < 2.2);
        if (!ocupado && Math.abs(x) < TAMANIO_BASE / 2 - 1 && Math.abs(z) < TAMANIO_BASE / 2 - 1) {
          return { x, z };
        }
      }
    }
    return { x: cx, z: cz };
  }

  /* Agrega un cuerpo a la maqueta. "opciones" puede traer nombre, escala, color y textura */
  function agregarCuerpo(tipo, opciones) {
    const op = opciones || {};
    guardarParaDeshacer();
    const lugar = lugarLibre();
    const mesh = crearMesh({
      id: estado.siguienteId++,
      tipo,
      nombre: op.nombre || CUERPOS[tipo].nombre,
      color: op.color || CUERPOS[tipo].color,
      textura: op.textura || 'lisa',
      pos: [lugar.x, 0, lugar.z],
      rot: [0, 0, 0, 1],
      esc: op.escala || [1, 1, 1]
    });
    apoyarEn(mesh, 0);
    elegir([mesh]);
    avisar(`Agregaste: ${mesh.userData.nombre}`);
    despuesDeCambiar();
  }

  /* Elegir (seleccionar) cuerpos */
  function elegir(lista) {
    estado.seleccion = lista.slice();
    dibujarPanelDerecho();
  }

  function alternarEleccion(mesh) {
    if (estado.seleccion.includes(mesh)) {
      estado.seleccion = estado.seleccion.filter((m) => m !== mesh);
    } else {
      estado.seleccion.push(mesh);
    }
    dibujarPanelDerecho();
  }

  /* Aplica un cambio a todos los cuerpos elegidos, guardando antes para poder deshacer */
  function cambiarElegidos(cambio, mensaje) {
    if (!estado.seleccion.length) return;
    guardarParaDeshacer();
    estado.seleccion.forEach(cambio);
    if (mensaje) avisar(mensaje);
    despuesDeCambiar();
  }

  /* Mover según la pantalla: "derecha" siempre es hacia la derecha de lo que se ve */
  function direccionesSegunCamara() {
    const derecha = derechaDePantalla();
    // Se redondea al eje más cercano para que el movimiento sea prolijo
    if (Math.abs(derecha.x) >= Math.abs(derecha.z)) {
      derecha.set(Math.sign(derecha.x), 0, 0);
    } else {
      derecha.set(0, 0, Math.sign(derecha.z));
    }
    const adelante = new THREE.Vector3(-derecha.z, 0, derecha.x); // hacia quien mira
    return { derecha, adelante };
  }

  function mover(direccion) {
    const { derecha, adelante } = direccionesSegunCamara();
    const vectores = {
      izquierda: derecha.clone().multiplyScalar(-PASO_MOVER),
      derecha: derecha.clone().multiplyScalar(PASO_MOVER),
      atras: adelante.clone().multiplyScalar(-PASO_MOVER),
      adelante: adelante.clone().multiplyScalar(PASO_MOVER),
      subir: new THREE.Vector3(0, PASO_MOVER, 0),
      bajar: new THREE.Vector3(0, -PASO_MOVER, 0)
    };
    cambiarElegidos((m) => {
      m.position.add(vectores[direccion]);
      mantenerEnBase(m);
      const caja = cajaDe(m);
      if (caja.min.y < 0) apoyarEn(m, 0); // no atraviesa el piso
    });
  }

  /* Cambia el tamaño. eje: 'todo', 'x' (ancho), 'y' (alto) o 'z' (grosor) */
  function cambiarTamanio(eje, factor) {
    cambiarElegidos((m) => {
      const abajo = cajaDe(m).min.y;
      const ejes = eje === 'todo' ? ['x', 'y', 'z'] : [eje];
      ejes.forEach((e) => { m.scale[e] = limitar(m.scale[e] * factor, 0.03, 10); });
      apoyarEn(m, Math.max(0, abajo)); // sigue apoyado donde estaba
      ajustarRepeticionTextura(m);
    }, factor > 1 ? '¡Más grande!' : '¡Más chico!');
  }

  /* Gira alrededor de un eje del mundo: 'x' (inclinar), 'y' (girar), 'z' (acostar) */
  function girar(eje, angulo) {
    const vector = new THREE.Vector3(eje === 'x' ? 1 : 0, eje === 'y' ? 1 : 0, eje === 'z' ? 1 : 0);
    cambiarElegidos((m) => {
      const abajo = cajaDe(m).min.y;
      m.rotateOnWorldAxis(vector, angulo);
      apoyarEn(m, Math.max(0, abajo));
    });
  }

  function enderezar() {
    cambiarElegidos((m) => {
      const abajo = cajaDe(m).min.y;
      m.quaternion.identity();
      apoyarEn(m, Math.max(0, abajo));
    }, 'Quedó derecho');
  }

  function pintar(hex) {
    cambiarElegidos((m) => {
      m.userData.color = hex;
      m.material.color.set(hex);
    }, `Color: ${nombreDeColor(hex)}`);
  }

  function ponerTextura(id) {
    cambiarElegidos((m) => {
      m.userData.textura = id;
      if (m.material.map) m.material.map.dispose();
      m.material.map = texturaParaCuerpo(m);
      m.material.needsUpdate = true;
    }, `Textura: ${TEXTURAS.find((t) => t.id === id).nombre}`);
  }

  function borrarElegidos() {
    const cantidad = estado.seleccion.length;
    if (!cantidad) return;
    guardarParaDeshacer();
    estado.seleccion.slice().forEach(quitarMesh);
    estado.seleccion = [];
    avisar(cantidad === 1 ? 'Borraste 1 cuerpo' : `Borraste ${cantidad} cuerpos`);
    despuesDeCambiar();
  }

  function copiarElegidos() {
    if (!estado.seleccion.length) return;
    guardarParaDeshacer();
    const copias = estado.seleccion.map((m) => {
      const datos = datosDe(m);
      datos.id = estado.siguienteId++;
      datos.pos[0] += 1;
      datos.pos[2] += 1;
      const copia = crearMesh(datos);
      mantenerEnBase(copia);
      return copia;
    });
    estado.seleccion = copias;
    avisar(copias.length === 1 ? '¡Hiciste una copia!' : `¡Hiciste ${copias.length} copias!`);
    despuesDeCambiar();
  }

  function renombrar(texto) {
    const nombre = texto.trim();
    const mesh = estado.seleccion[0];
    if (!mesh || !nombre || nombre === mesh.userData.nombre) return;
    guardarParaDeshacer();
    mesh.userData.nombre = nombre.slice(0, 30);
    avisar(`Ahora se llama: ${mesh.userData.nombre}`);
    despuesDeCambiar();
  }

  /* Se llama después de cualquier cambio en la maqueta */
  function despuesDeCambiar() {
    $('#escena-vacia').classList.toggle('oculto', estado.objetos.length > 0);
    $('#btn-deshacer').disabled = pilaDeshacer.length === 0;
    $('#btn-rehacer').disabled = pilaRehacer.length === 0;
    dibujarPanelDerecho();
    revisarDesafio(false);
  }

  /* =========================================================
     9. DESHACER Y REHACER
     ========================================================= */
  function datosDe(mesh) {
    return {
      id: mesh.userData.id,
      tipo: mesh.userData.tipo,
      nombre: mesh.userData.nombre,
      color: mesh.userData.color,
      textura: mesh.userData.textura,
      pos: mesh.position.toArray(),
      rot: mesh.quaternion.toArray(),
      esc: mesh.scale.toArray()
    };
  }

  const fotoDeLaMaqueta = () => estado.objetos.map(datosDe);

  function guardarParaDeshacer() {
    pilaDeshacer.push(fotoDeLaMaqueta());
    if (pilaDeshacer.length > MAX_PASOS_DESHACER) pilaDeshacer.shift();
    pilaRehacer.length = 0;
  }

  function restaurar(foto) {
    const elegidos = estado.seleccion.map((m) => m.userData.id);
    estado.objetos.slice().forEach(quitarMesh);
    foto.forEach(crearMesh);
    estado.seleccion = estado.objetos.filter((m) => elegidos.includes(m.userData.id));
  }

  function deshacer() {
    if (!pilaDeshacer.length || estado.modo !== 'construir') return;
    pilaRehacer.push(fotoDeLaMaqueta());
    restaurar(pilaDeshacer.pop());
    avisar('↶ Deshiciste el último cambio');
    despuesDeCambiar();
  }

  function rehacer() {
    if (!pilaRehacer.length || estado.modo !== 'construir') return;
    pilaDeshacer.push(fotoDeLaMaqueta());
    restaurar(pilaRehacer.pop());
    avisar('↷ Volviste a hacer el cambio');
    despuesDeCambiar();
  }

  /* =========================================================
     10. ARRASTRAR EN LA ESCENA (mouse o dedo)
     ========================================================= */
  const punteros = new Map();
  let gesto = null;       // qué se está haciendo: orbitar, apilar, grupo o pellizco

  function coordenadasNormalizadas(e) {
    const r = renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  function cuerpoBajoPuntero(e, excluir) {
    raycaster.setFromCamera(coordenadasNormalizadas(e), camara);
    const candidatos = excluir ? estado.objetos.filter((m) => !excluir.includes(m)) : estado.objetos;
    return raycaster.intersectObjects(candidatos, false)[0] || null;
  }

  function puntoEnElPiso(e) {
    raycaster.setFromCamera(coordenadasNormalizadas(e), camara);
    return raycaster.ray.intersectPlane(planoSuelo, new THREE.Vector3());
  }

  function conectarPunteroEscena() {
    const lienzo = renderer.domElement;

    lienzo.addEventListener('pointerdown', (e) => {
      lienzo.setPointerCapture(e.pointerId);
      punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Dos dedos: acercar o alejar pellizcando
      if (punteros.size === 2) {
        const [a, b] = Array.from(punteros.values());
        gesto = { tipo: 'pellizco', distancia: Math.hypot(a.x - b.x, a.y - b.y), radio: camaraDestino.radio };
        return;
      }

      gesto = { tipo: 'orbitar', x: e.clientX, y: e.clientY, movido: false, guardado: false };
      if (estado.modo !== 'construir') return;

      const toque = cuerpoBajoPuntero(e);
      if (!toque) return;
      const mesh = toque.object;

      if (e.shiftKey || estado.elegirVarios) {
        alternarEleccion(mesh);
        if (!estado.seleccion.includes(mesh)) { gesto = null; return; }
      } else if (!estado.seleccion.includes(mesh)) {
        elegir([mesh]);
      }

      if (estado.seleccion.length === 1) {
        gesto.tipo = 'apilar';
        gesto.mesh = mesh;
      } else {
        gesto.tipo = 'grupo';
        gesto.inicio = puntoEnElPiso(e);
        gesto.posiciones = estado.seleccion.map((m) => m.position.clone());
      }
    });

    lienzo.addEventListener('pointermove', (e) => {
      if (!punteros.has(e.pointerId)) return;
      const anterior = punteros.get(e.pointerId);
      punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (!gesto) return;

      if (gesto.tipo === 'pellizco') {
        if (punteros.size < 2) return;
        const [a, b] = Array.from(punteros.values());
        const distancia = Math.hypot(a.x - b.x, a.y - b.y);
        camaraDestino.radio = limitar(gesto.radio * (gesto.distancia / Math.max(distancia, 1)), 4, 60);
        return;
      }

      if (!gesto.movido && Math.hypot(e.clientX - gesto.x, e.clientY - gesto.y) > 6) gesto.movido = true;
      if (!gesto.movido) return;

      if (gesto.tipo === 'orbitar') {
        camaraDestino.theta -= (e.clientX - anterior.x) * 0.008;
        camaraDestino.phi = limitar(camaraDestino.phi - (e.clientY - anterior.y) * 0.008, 0.02, 1.5);
        marcarVistaActiva('libre');
        return;
      }

      // Mover cuerpos: se guarda una sola vez para deshacer todo el arrastre
      if (!gesto.guardado) { guardarParaDeshacer(); gesto.guardado = true; }

      if (gesto.tipo === 'apilar') {
        arrastrarYApilar(e, gesto.mesh);
      } else if (gesto.tipo === 'grupo' && gesto.inicio) {
        const punto = puntoEnElPiso(e);
        if (!punto) return;
        const dx = redondear(punto.x - gesto.inicio.x, 0.25);
        const dz = redondear(punto.z - gesto.inicio.z, 0.25);
        estado.seleccion.forEach((m, i) => {
          m.position.set(gesto.posiciones[i].x + dx, gesto.posiciones[i].y, gesto.posiciones[i].z + dz);
          mantenerEnBase(m);
        });
      }
    });

    const terminar = (e) => {
      punteros.delete(e.pointerId);
      if (!gesto) return;
      if (gesto.tipo === 'pellizco') {
        if (punteros.size === 0) gesto = null;
        return;
      }
      if (gesto.tipo === 'orbitar' && !gesto.movido && estado.modo === 'construir' &&
          !estado.elegirVarios && !e.shiftKey && estado.seleccion.length) {
        elegir([]); // tocar el fondo deja de elegir
      }
      if (gesto.guardado) despuesDeCambiar();
      gesto = null;
    };
    lienzo.addEventListener('pointerup', terminar);
    lienzo.addEventListener('pointercancel', terminar);

    // Rueda del mouse: acercar y alejar
    lienzo.addEventListener('wheel', (e) => {
      e.preventDefault();
      camaraDestino.radio = limitar(camaraDestino.radio * (e.deltaY > 0 ? 1.1 : 0.9), 4, 60);
    }, { passive: false });
  }

  /* Arrastra un cuerpo por el piso; si pasa por encima de otro, se apoya arriba */
  function arrastrarYApilar(e, mesh) {
    const debajo = cuerpoBajoPuntero(e, [mesh]);
    let x, z, altura;
    if (debajo) {
      x = debajo.point.x;
      z = debajo.point.z;
      altura = cajaDe(debajo.object).max.y;
    } else {
      const punto = puntoEnElPiso(e);
      if (!punto) return;
      x = punto.x;
      z = punto.z;
      altura = 0;
    }
    mesh.position.x = redondear(x, 0.25);
    mesh.position.z = redondear(z, 0.25);
    mantenerEnBase(mesh);
    apoyarEn(mesh, altura);
  }

  /* =========================================================
     11. PANEL DERECHO (controles del cuerpo elegido)
     ========================================================= */
  function boton(accion, icono, texto, extra) {
    return `<button class="btn" type="button" data-accion="${accion}" ${extra || ''}>
      <span aria-hidden="true">${icono}</span> ${texto}</button>`;
  }

  function htmlElegirVarios() {
    return `<div class="seccion-panel fila-botones">
      ${boton('varios', estado.elegirVarios ? '☑' : '☐', 'Elegir varios',
        `aria-pressed="${estado.elegirVarios}" ${estado.elegirVarios ? 'style="background:var(--amarillo)"' : ''}`)}
      ${boton('todos', '🔲', 'Elegir todos', estado.objetos.length ? '' : 'disabled')}
    </div>`;
  }

  function htmlFicha(mesh) {
    const tipo = mesh.userData.tipo;
    const c = CUERPOS[tipo];
    const numeros = c.caras + c.vertices + c.aristas > 0
      ? `<div class="ficha-numeros">
          <div class="ficha-numero"><strong>${c.caras}</strong>${tipo === 'cubo' || tipo === 'prisma' || tipo === 'piramide' ? 'caras' : 'caras planas'}</div>
          <div class="ficha-numero"><strong>${c.vertices}</strong>vértices (puntas)</div>
          <div class="ficha-numero"><strong>${c.aristas}</strong>aristas (bordes)</div>
        </div>`
      : '';
    return `<div class="seccion-panel ficha">
      <div class="ficha-cabecera">
        ${iconoCuerpo(tipo)}
        <div>
          <h3 class="ficha-nombre">${c.nombreLargo || c.nombre}</h3>
          <span class="etiqueta-rueda ${c.rueda ? 'si' : 'no'}">
            <span aria-hidden="true">${c.rueda ? '🔄' : '🧱'}</span> ${c.rueda ? 'Rueda' : 'No rueda'}
          </span>
        </div>
      </div>
      <p class="ficha-texto">${c.texto}</p>
      ${numeros}
      <p class="ficha-ejemplos"><strong>En la escuela:</strong> ${c.ejemplos}.</p>
    </div>`;
  }

  function htmlMover() {
    return `<div class="seccion-panel">
      <p class="seccion-titulo">Mover</p>
      <div class="fila-botones tres">
        ${boton('mover:izquierda', '←', 'Izquierda')}
        ${boton('mover:atras', '↑', 'Atrás')}
        ${boton('mover:derecha', '→', 'Derecha')}
        ${boton('mover:subir', '⤒', 'Subir')}
        ${boton('mover:adelante', '↓', 'Adelante')}
        ${boton('mover:bajar', '⤓', 'Bajar')}
      </div>
    </div>`;
  }

  function htmlTamanio(completo) {
    const extra = completo
      ? `${boton('tam:y:mas', '↕', 'Más alto')}${boton('tam:y:menos', '↕', 'Más bajo')}
         ${boton('tam:x:mas', '↔', 'Más ancho')}${boton('tam:x:menos', '↔', 'Más angosto')}
         ${boton('tam:z:mas', '⬌', 'Más grueso')}${boton('tam:z:menos', '⬌', 'Más finito')}`
      : '';
    return `<div class="seccion-panel">
      <p class="seccion-titulo">Tamaño</p>
      <div class="fila-botones">
        ${boton('tam:todo:mas', '➕', 'Agrandar')}${boton('tam:todo:menos', '➖', 'Achicar')}
        ${extra}
      </div>
    </div>`;
  }

  function htmlGirar() {
    return `<div class="seccion-panel">
      <p class="seccion-titulo">Girar</p>
      <div class="fila-botones tres">
        ${boton('girar:y:1', '↺', 'Girar')}
        ${boton('girar:y:-1', '↻', 'Girar')}
        ${boton('girar:z:6', '🛌', 'Acostar')}
        ${boton('girar:x:1', '⤵', 'Inclinar')}
        ${boton('girar:x:-1', '⤴', 'Inclinar')}
        ${boton('enderezar', '⬆', 'Enderezar')}
      </div>
    </div>`;
  }

  function htmlColores(actual) {
    const muestras = COLORES.map((c) => `
      <button type="button" class="muestra-color ${c.hex === actual ? 'elegida' : ''}" data-accion="color:${c.hex}"
        aria-label="Color ${c.nombre}" aria-pressed="${c.hex === actual}">
        <span class="punto" style="background:${c.hex}"></span>${c.nombre}
      </button>`).join('');
    return `<div class="seccion-panel"><p class="seccion-titulo">Color</p><div class="muestras">${muestras}</div></div>`;
  }

  function htmlTexturas(actual) {
    const muestras = TEXTURAS.map((t) => {
      const fondo = imagenesTextura[t.id] ? `background-image:url(${imagenesTextura[t.id].toDataURL()})` : 'background:#fff';
      return `<button type="button" class="muestra-textura ${t.id === actual ? 'elegida' : ''}" data-accion="textura:${t.id}"
        aria-label="Textura ${t.nombre}" aria-pressed="${t.id === actual}">
        <span class="punto" style="${fondo}"></span>${t.nombre}
      </button>`;
    }).join('');
    return `<div class="seccion-panel"><p class="seccion-titulo">Textura</p><div class="muestras">${muestras}</div></div>`;
  }

  function htmlNombre(mesh) {
    return `<div class="seccion-panel">
      <label class="seccion-titulo" for="campo-nombre">Nombre</label>
      <div class="nombre-fila">
        <input id="campo-nombre" class="campo-nombre" type="text" maxlength="30" value="${escaparHTML(mesh.userData.nombre)}">
        <button class="btn-mini" type="button" data-accion="renombrar" aria-label="Guardar nombre" style="width:44px;height:44px">✓</button>
      </div>
    </div>`;
  }

  function htmlCopiarBorrar() {
    return `<div class="seccion-panel fila-botones">
      ${boton('copiar', '📄', 'Copiar')}
      <button class="btn btn-rojo" type="button" data-accion="borrar"><span aria-hidden="true">🗑️</span> Borrar</button>
    </div>`;
  }

  function htmlIdeas() {
    const ideas = estado.lugar ? estado.lugar.ideas : [];
    const lista = ideas.map((idea, i) => `
      <button type="button" class="btn-idea" data-accion="idea:${i}">
        ${iconoCuerpo(idea.cuerpo, idea.color)}
        <span><strong>${escaparHTML(idea.objeto)}</strong><br>${CUERPOS[idea.cuerpo].nombre.toLowerCase()}</span>
      </button>`).join('');
    return `<p class="panel-consejo"><span aria-hidden="true">👆</span> Tocá un cuerpo de tu maqueta para cambiarlo. Arrastralo para moverlo o para ponerlo encima de otro.</p>
      <p class="seccion-titulo">Ideas para ${estado.lugar ? escaparHTML(estado.lugar.nombre.toLowerCase()) : 'tu espacio'}</p>
      <p class="panel-ayuda" style="text-align:left">Son solo ayudas: vos elegís qué cuerpo usar.</p>
      <div class="ideas-lista">${lista}</div>`;
  }

  function dibujarPanelDerecho() {
    const panel = $('#panel-derecho');
    const elegidos = estado.seleccion;
    let html = htmlElegirVarios();

    if (elegidos.length === 0) {
      html += htmlIdeas();
    } else if (elegidos.length === 1) {
      const m = elegidos[0];
      html += htmlFicha(m) + htmlNombre(m) + htmlMover() + htmlTamanio(true) + htmlGirar() +
        htmlColores(m.userData.color) + htmlTexturas(m.userData.textura) + htmlCopiarBorrar();
    } else {
      html += `<p class="panel-consejo"><span aria-hidden="true">✋</span> Elegiste ${elegidos.length} cuerpos. Arrastralos para moverlos juntos.</p>` +
        htmlMover() + htmlTamanio(false) + htmlColores(null) + htmlTexturas(null) + htmlCopiarBorrar();
    }
    const scroll = panel.scrollTop;
    panel.innerHTML = html;
    panel.scrollTop = scroll;
  }

  /* Un solo "escuchador" para todos los botones del panel derecho */
  function conectarPanelDerecho() {
    const panel = $('#panel-derecho');
    panel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-accion]');
      if (!b || b.disabled) return;
      const [accion, a1, a2] = b.dataset.accion.split(':');
      switch (accion) {
        case 'mover': mover(a1); break;
        case 'tam': cambiarTamanio(a1, a2 === 'mas' ? FACTOR_TAMANIO : 1 / FACTOR_TAMANIO); break;
        case 'girar': girar(a1, (a1 === 'z' ? Math.PI / 2 : PASO_GIRO) * Math.sign(Number(a2))); break;
        case 'enderezar': enderezar(); break;
        case 'color': pintar(b.dataset.accion.slice(6)); break;
        case 'textura': ponerTextura(a1); break;
        case 'copiar': copiarElegidos(); break;
        case 'borrar': borrarElegidos(); break;
        case 'renombrar': renombrar($('#campo-nombre').value); break;
        case 'varios':
          estado.elegirVarios = !estado.elegirVarios;
          avisar(estado.elegirVarios ? 'Tocá los cuerpos que quieras elegir' : 'Elegís de a un cuerpo');
          dibujarPanelDerecho();
          break;
        case 'todos': elegir(estado.objetos); break;
        case 'idea': {
          const idea = estado.lugar.ideas[Number(a1)];
          agregarCuerpo(idea.cuerpo, { nombre: idea.objeto, escala: idea.escala, color: idea.color, textura: idea.textura });
          break;
        }
      }
    });
    panel.addEventListener('keydown', (e) => {
      if (e.target.id === 'campo-nombre' && e.key === 'Enter') renombrar(e.target.value);
    });
    panel.addEventListener('change', (e) => {
      if (e.target.id === 'campo-nombre') renombrar(e.target.value);
    });
  }

  /* =========================================================
     12. PANTALLAS: BIENVENIDA, LUGARES Y CONSTRUCCIÓN
     ========================================================= */
  function mostrarPantalla(id) {
    $$('.pantalla').forEach((p) => p.classList.toggle('activa', p.id === id));
  }

  function dibujarLugares() {
    const tarjetas = LUGARES.map((l) => `
      <button type="button" class="tarjeta-lugar" data-lugar="${l.id}">
        <span class="emoji" aria-hidden="true">${l.emoji}</span>${l.nombre}
      </button>`).join('');
    $('#grilla-lugares').innerHTML = tarjetas + `
      <button type="button" class="tarjeta-lugar propio" data-lugar="propio">
        <span class="emoji" aria-hidden="true">${LUGAR_PROPIO.emoji}</span>Mi propio espacio
      </button>`;

    $('#grilla-lugares').addEventListener('click', (e) => {
      const tarjeta = e.target.closest('[data-lugar]');
      if (!tarjeta) return;
      if (tarjeta.dataset.lugar === 'propio') {
        $('#form-propio').classList.remove('oculto');
        $('#input-propio').focus();
        return;
      }
      empezarLugar(LUGARES.find((l) => l.id === tarjeta.dataset.lugar));
    });

    const empezarPropio = () => {
      const nombre = $('#input-propio').value.trim() || LUGAR_PROPIO.nombre;
      empezarLugar(Object.assign({}, LUGAR_PROPIO, { nombre: nombre.slice(0, 30) }));
    };
    $('#btn-propio-ok').addEventListener('click', empezarPropio);
    $('#input-propio').addEventListener('keydown', (e) => { if (e.key === 'Enter') empezarPropio(); });
  }

  function dibujarPanelCuerpos() {
    $('#lista-cuerpos').innerHTML = ORDEN_CUERPOS.map((tipo) => `
      <button type="button" class="btn-cuerpo" data-cuerpo="${tipo}" aria-label="Agregar ${CUERPOS[tipo].nombre}">
        ${iconoCuerpo(tipo)}<span>${CUERPOS[tipo].nombre}</span>
      </button>`).join('');
    $('#lista-cuerpos').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cuerpo]');
      if (b) agregarCuerpo(b.dataset.cuerpo);
    });
  }

  /* Empieza a construir un lugar con la maqueta vacía */
  function empezarLugar(lugar) {
    estado.lugar = lugar;
    estado.objetos.slice().forEach(quitarMesh);
    estado.seleccion = [];
    estado.desafioActivo = null;
    pilaDeshacer.length = 0;
    pilaRehacer.length = 0;
    $('#cartel-desafio').classList.add('oculto');
    $('#chip-lugar').textContent = `${lugar.emoji} ${lugar.nombre}`;
    cambiarColorPiso(lugar.piso);
    cambiarModo('construir');
    mostrarPantalla('pantalla-construir');
    ajustarTamanio();
    aplicarVista('libre', true);
    despuesDeCambiar();
  }

  function cambiarModo(modo) {
    estado.modo = modo;
    document.body.classList.toggle('modo-explorar', modo === 'explorar');
    $('#ayuda-explorar').classList.toggle('oculto', modo !== 'explorar');
    $('#btn-modo').innerHTML = modo === 'explorar'
      ? '<span aria-hidden="true">🛠️</span> Construir'
      : '<span aria-hidden="true">🔭</span> Explorar';
    if (modo === 'explorar') {
      estado.seleccion = [];
      dibujarPanelDerecho();
    }
    requestAnimationFrame(ajustarTamanio);
  }

  /* =========================================================
     13. DESAFÍOS
     ========================================================= */
  function datosDeLaEscena() {
    const cuenta = {};
    ORDEN_CUERPOS.forEach((t) => { cuenta[t] = 0; });
    const objetos = estado.objetos.map((m) => {
      cuenta[m.userData.tipo]++;
      const caja = cajaDe(m);
      const tam = caja.getSize(new THREE.Vector3());
      return { tipo: m.userData.tipo, alto: tam.y, ancho: Math.max(tam.x, tam.z), abajo: caja.min.y };
    });
    return { cuenta, objetos, total: objetos.length, tipos: ORDEN_CUERPOS.filter((t) => cuenta[t] > 0).length };
  }

  function dibujarDesafios() {
    $('#lista-desafios').innerHTML = DESAFIOS.map((d) => {
      const logrado = estado.desafiosLogrados.has(d.id);
      return `<button type="button" class="tarjeta-desafio ${logrado ? 'logrado' : ''}" data-desafio="${d.id}">
        <span class="estado" aria-hidden="true">${logrado ? '⭐' : '🏆'}</span>
        <span>${d.texto}${logrado ? '<span class="logrado-texto">¡Ya lo lograste! Podés hacerlo otra vez.</span>' : ''}</span>
      </button>`;
    }).join('');
  }

  function activarDesafio(id) {
    estado.desafioActivo = DESAFIOS.find((d) => d.id === id);
    $('#cartel-desafio-texto').textContent = estado.desafioActivo.texto;
    $('#cartel-desafio').classList.remove('oculto');
    cerrarVentana('ventana-desafios');
    if (estado.modo !== 'construir') cambiarModo('construir');
    avisar('¡A construir!');
  }

  /* Revisa el desafío activo. Si "pedidoPorAlumno" es true, da una pista amable */
  function revisarDesafio(pedidoPorAlumno) {
    const desafio = estado.desafioActivo;
    if (!desafio) return;
    if (desafio.cumple(datosDeLaEscena())) {
      estado.desafiosLogrados.add(desafio.id);
      estado.desafioActivo = null;
      $('#cartel-desafio').classList.add('oculto');
      $('#texto-felicitacion').textContent = `${MENSAJE_LOGRO} Cumpliste el desafío: «${desafio.texto}»`;
      abrirVentana('ventana-felicitacion');
    } else if (pedidoPorAlumno) {
      avisar(`💡 ${desafio.pista}`, 4000);
    }
  }

  /* =========================================================
     14. CLASIFICACIÓN: ¿RUEDA O NO RUEDA?
     ========================================================= */
  let fichaElegida = null;

  function prepararClasificacion() {
    const tipos = ORDEN_CUERPOS.slice().sort(() => Math.random() - 0.5);
    $('#bandeja-clasificar').innerHTML = tipos.map((t) => `
      <button type="button" class="ficha-clasificar" data-tipo="${t}">
        ${iconoCuerpo(t)}${CUERPOS[t].nombre}
      </button>`).join('');
    $$('.grupo-cuerpos').forEach((g) => { g.innerHTML = ''; });
    $('#mensaje-clasificar').textContent = '';
    $('#btn-clasificar-otra').classList.add('oculto');
    $('#bandeja-clasificar').classList.remove('oculto');
    fichaElegida = null;
  }

  function intentarUbicar(ficha, grupo) {
    const tipo = ficha.dataset.tipo;
    const rueda = CUERPOS[tipo].rueda;
    const correcto = (grupo.dataset.grupo === 'rueda') === rueda;
    ficha.classList.remove('elegida');
    fichaElegida = null;

    if (correcto) {
      grupo.querySelector('.grupo-cuerpos').appendChild(ficha);
      ficha.classList.add('ubicada');
      ficha.disabled = true;
      $('#mensaje-clasificar').textContent = `¡Bien! ${articulo(tipo)} ${CUERPOS[tipo].nombre.toLowerCase()} ${rueda ? 'rueda' : 'no rueda'}.`;
      if (!$('#bandeja-clasificar .ficha-clasificar')) terminarClasificacion();
    } else {
      ficha.classList.remove('rebote');
      void ficha.offsetWidth; // reinicia la animación
      ficha.classList.add('rebote');
      $('#mensaje-clasificar').textContent = `Mmm… pensá: ¿${articulo(tipo).toLowerCase()} ${CUERPOS[tipo].nombre.toLowerCase()} puede rodar? Probá en el otro grupo.`;
    }
  }

  const articulo = (tipo) => (['esfera', 'piramide'].includes(tipo) ? 'La' : 'El');

  function terminarClasificacion() {
    $('#mensaje-clasificar').textContent =
      '¡Muy bien! La esfera, el cilindro y el cono ruedan porque tienen partes curvas. El cubo, el prisma y la pirámide no ruedan porque sus caras son planas.';
    $('#btn-clasificar-otra').classList.remove('oculto');
    $('#bandeja-clasificar').classList.add('oculto');
  }

  /* Arrastrar fichas con mouse o dedo; también se puede tocar ficha y luego grupo */
  function conectarClasificacion() {
    const ventana = $('#ventana-clasificar');
    let arrastre = null;

    ventana.addEventListener('pointerdown', (e) => {
      const ficha = e.target.closest('.ficha-clasificar');
      if (!ficha || ficha.classList.contains('ubicada')) return;
      arrastre = { ficha, x: e.clientX, y: e.clientY, moviendo: false };
      ficha.setPointerCapture(e.pointerId);
    });

    ventana.addEventListener('pointermove', (e) => {
      if (!arrastre) return;
      const { ficha } = arrastre;
      if (!arrastre.moviendo && Math.hypot(e.clientX - arrastre.x, e.clientY - arrastre.y) > 6) {
        arrastre.moviendo = true;
        const r = ficha.getBoundingClientRect();
        arrastre.dx = e.clientX - r.left;
        arrastre.dy = e.clientY - r.top;
        ficha.classList.add('arrastrando');
      }
      if (!arrastre.moviendo) return;
      ficha.style.left = `${e.clientX - arrastre.dx}px`;
      ficha.style.top = `${e.clientY - arrastre.dy}px`;
      const grupo = document.elementFromPoint(e.clientX, e.clientY);
      $$('.grupo-clasificar').forEach((g) => g.classList.toggle('encima', !!grupo && g.contains(grupo)));
    });

    const soltar = (e) => {
      if (!arrastre) return;
      const { ficha, moviendo } = arrastre;
      arrastre = null;
      $$('.grupo-clasificar').forEach((g) => g.classList.remove('encima'));
      if (!moviendo) {
        // Fue un toque: elegir la ficha
        $$('.ficha-clasificar').forEach((f) => f.classList.remove('elegida'));
        fichaElegida = fichaElegida === ficha ? null : ficha;
        if (fichaElegida) {
          ficha.classList.add('elegida');
          $('#mensaje-clasificar').textContent = 'Ahora tocá el grupo donde va.';
        }
        return;
      }
      ficha.classList.remove('arrastrando');
      ficha.style.left = '';
      ficha.style.top = '';
      const debajo = document.elementFromPoint(e.clientX, e.clientY);
      const grupo = debajo && debajo.closest('.grupo-clasificar');
      if (grupo) intentarUbicar(ficha, grupo);
    };
    ventana.addEventListener('pointerup', soltar);
    ventana.addEventListener('pointercancel', soltar);

    // Tocar un grupo después de elegir una ficha
    $$('.grupo-clasificar').forEach((g) => g.addEventListener('click', () => {
      if (fichaElegida) intentarUbicar(fichaElegida, g);
    }));
    // Con teclado: Enter sobre una ficha la elige
    ventana.addEventListener('click', (e) => {
      const ficha = e.target.closest('.ficha-clasificar');
      if (ficha && e.detail === 0 && !ficha.classList.contains('ubicada')) {
        $$('.ficha-clasificar').forEach((f) => f.classList.remove('elegida'));
        fichaElegida = ficha;
        ficha.classList.add('elegida');
        $('#mensaje-clasificar').textContent = 'Ahora elegí el grupo donde va.';
      }
    });
    $('#btn-clasificar-otra').addEventListener('click', prepararClasificacion);
  }

  /* =========================================================
     15. MOSTRAR MI MAQUETA E IMÁGENES
     ========================================================= */
  let fotosVistas = {};    // imágenes de cada vista

  /* Saca una foto de la maqueta desde una vista, sin mostrar lo elegido */
  function fotoDeVista(id) {
    const guardada = {
      objetivo: camaraActual.objetivo.clone(), radio: camaraActual.radio,
      theta: camaraActual.theta, phi: camaraActual.phi
    };
    const destinoGuardado = {
      objetivo: camaraDestino.objetivo.clone(), radio: camaraDestino.radio,
      theta: camaraDestino.theta, phi: camaraDestino.phi
    };
    const vistaActiva = ($('.btn-vista.activa') || {}).dataset;

    // Tamaño fijo para que todas las fotos sean iguales
    const tamanioOriginal = renderer.getSize(new THREE.Vector2());
    const ratioOriginal = renderer.getPixelRatio();
    renderer.setPixelRatio(1);
    renderer.setSize(1600, 1000, false);
    camara.aspect = 1.6;
    camara.updateProjectionMatrix();

    aplicarVista(id, true);
    estado.objetos.forEach((m) => { m.material.emissiveIntensity = 0; });
    renderer.render(escena3d, camara);
    const imagen = renderer.domElement.toDataURL('image/png');

    // Volver todo como estaba
    renderer.setPixelRatio(ratioOriginal);
    renderer.setSize(tamanioOriginal.x, tamanioOriginal.y, false);
    camara.aspect = tamanioOriginal.x / Math.max(1, tamanioOriginal.y);
    camara.updateProjectionMatrix();
    Object.assign(camaraActual, guardada);
    Object.assign(camaraDestino, destinoGuardado);
    posicionarCamara(camaraActual);
    marcarVistaActiva(vistaActiva ? vistaActiva.vista : 'libre');
    return imagen;
  }

  function cargarImagen(src) {
    return new Promise((resolver) => {
      const img = new Image();
      img.onload = () => resolver(img);
      img.src = src;
    });
  }

  /* Arma la imagen de una vista con un título arriba (grado, lugar, nombre y vista) */
  async function imagenConTitulo(id) {
    const foto = await cargarImagen(fotosVistas[id]);
    const ancho = 1600, alto = 1000, cabecera = 100, margen = 20;
    const lienzo = document.createElement('canvas');
    lienzo.width = ancho + margen * 2;
    lienzo.height = cabecera + alto + margen * 2;
    const ctx = lienzo.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.fillStyle = '#1f2a44';
    ctx.font = '700 48px "Baloo 2", sans-serif';
    ctx.textBaseline = 'middle';
    const titulo = `${alumno.grado} – ${estado.lugar.nombre} – ${alumno.nombre} (${VISTAS[id].nombre.toLowerCase()})`;
    ctx.fillText(titulo, margen + 8, cabecera / 2 + margen / 2);
    ctx.drawImage(foto, margen, cabecera + margen, ancho, alto);
    ctx.strokeStyle = '#1f2a44';
    ctx.lineWidth = 4;
    ctx.strokeRect(margen, cabecera + margen, ancho, alto);
    return lienzo.toDataURL('image/png');
  }

  /* ---------- Guardar las 4 vistas en Google Drive ---------- */

  // Datos del alumno: se recuerdan mientras la página esté abierta
  const alumno = { nombre: '', grado: '' };
  let subidas = [];   // estado de cada imagen: 'espera', 'subiendo', 'ok' o 'error'

  /* Quita caracteres que no pueden ir en un nombre de archivo */
  const limpiarParaArchivo = (texto) => texto.trim().replace(/\s+/g, ' ').replace(/[\\/:*?"<>|#%]/g, '');

  /* Nombre del archivo: "grado-sector-nombre-x.png" (o "…-maqueta.json" para la vista 360°) */
  function nombreDelArchivo(sufijo, extension) {
    return [alumno.grado, estado.lugar.nombre, alumno.nombre, sufijo]
      .map((t) => limpiarParaArchivo(String(t))).join('-') + '.' + (extension || 'png');
  }

  /* Qué se guarda: las 4 vistas (PNG) y la maqueta 360° (JSON) */
  const TAREAS_GUARDADO = VISTAS_A_GUARDAR.concat(['maqueta']);

  const nombreDeTarea = (tarea, i) => (tarea === 'maqueta'
    ? nombreDelArchivo('maqueta', 'json')
    : nombreDelArchivo(i + 1));

  /* Miniatura chica (JPG) para la galería del visualizador */
  async function miniaturaDeMaqueta() {
    const foto = await cargarImagen(fotosVistas.libre);
    const lienzo = document.createElement('canvas');
    lienzo.width = 480;
    lienzo.height = 300;
    lienzo.getContext('2d').drawImage(foto, 0, 0, 480, 300);
    return lienzo.toDataURL('image/jpeg', 0.75);
  }

  /* Archivo de la maqueta 360°: la "receta" con todos los cuerpos */
  async function maquetaComoTexto() {
    return JSON.stringify({
      app: 'construimos-escuela',
      version: 1,
      grado: alumno.grado,
      alumno: alumno.nombre,
      lugar: { id: estado.lugar.id, nombre: estado.lugar.nombre },
      fecha: new Date().toISOString(),
      miniatura: await miniaturaDeMaqueta(),
      cuerpos: fotoDeLaMaqueta()
    });
  }

  function dibujarGrados() {
    $('#grados').innerHTML = GRADOS.map((g) => `
      <button type="button" class="btn btn-grado ${alumno.grado === g ? 'elegido' : ''}" role="radio"
        aria-checked="${alumno.grado === g}" data-grado="${g}">${g}</button>`).join('');
  }

  function abrirGuardar() {
    $('#input-alumno').value = alumno.nombre;
    $('#guardar-aviso').textContent = '';
    $('#guardar-formulario').classList.remove('oculto');
    $('#guardar-progreso').classList.add('oculto');
    $('#ventana-guardar .btn-cerrar').classList.remove('oculto');
    dibujarGrados();
    abrirVentana('ventana-guardar');
    $('#input-alumno').focus();
  }

  function dibujarProgreso() {
    const iconos = { espera: '⏳', subiendo: '☁️', ok: '✅', error: '⚠️' };
    const textos = { espera: 'Esperando…', subiendo: 'Guardando…', ok: 'Guardada', error: 'No se guardó' };
    $('#lista-progreso').innerHTML = TAREAS_GUARDADO.map((tarea, i) => `
      <li class="${subidas[i]}">
        <span class="icono-progreso" aria-hidden="true">${iconos[subidas[i]]}</span>
        <span><strong>${tarea === 'maqueta' ? 'Maqueta para ver en 360°' : VISTAS[tarea].nombre}</strong>: ${textos[subidas[i]]}
          <small>${escaparHTML(nombreDeTarea(tarea, i))}</small></span>
      </li>`).join('');
  }

  /* Envía un archivo al script de Google (Apps Script) que lo guarda en la carpeta.
     "datos" lleva la imagen (PNG) o el contenido (JSON). */
  async function subirArchivo(nombreArchivo, datos) {
    const respuesta = await fetch(URL_GUARDADO, {
      method: 'POST',
      // "text/plain" evita la consulta previa del navegador, que Apps Script no acepta
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ nombreArchivo }, datos))
    });
    const resultado = await respuesta.json();
    if (!resultado.ok) throw new Error(resultado.error || 'No se pudo guardar');
  }

  /* Revisa los datos del alumno y empieza a guardar */
  function confirmarGuardado() {
    const nombre = $('#input-alumno').value.trim().replace(/\s+/g, ' ');
    const aviso = $('#guardar-aviso');
    if (!nombre) { aviso.textContent = '✏️ Escribí tu nombre para guardar.'; $('#input-alumno').focus(); return; }
    if (!alumno.grado) { aviso.textContent = '👆 Tocá tu grado.'; return; }
    if (!URL_GUARDADO) { aviso.textContent = 'El guardado en Drive todavía no está preparado. Avisale a tu docente.'; return; }
    if (!navigator.onLine) { aviso.textContent = 'No hay internet en este momento. Probá de nuevo en un ratito.'; return; }
    alumno.nombre = nombre.slice(0, 40);
    subidas = TAREAS_GUARDADO.map(() => 'espera');
    $('#guardar-formulario').classList.add('oculto');
    $('#guardar-progreso').classList.remove('oculto');
    guardarVistasEnDrive();
  }

  /* Guarda uno por uno los archivos que todavía no se guardaron */
  async function guardarVistasEnDrive() {
    $('#ventana-guardar .btn-cerrar').classList.add('oculto');
    $('#btn-guardar-reintentar').classList.add('oculto');
    $('#btn-guardar-volver').disabled = true;
    $('#guardar-resultado').textContent = 'Guardando tu maqueta… no cierres esta ventana.';

    for (let i = 0; i < TAREAS_GUARDADO.length; i++) {
      if (subidas[i] === 'ok') continue;
      const tarea = TAREAS_GUARDADO[i];
      subidas[i] = 'subiendo';
      dibujarProgreso();
      try {
        const datos = tarea === 'maqueta'
          ? { contenido: await maquetaComoTexto() }
          : { imagen: await imagenConTitulo(tarea) };
        await subirArchivo(nombreDeTarea(tarea, i), datos);
        subidas[i] = 'ok';
      } catch (error) {
        subidas[i] = 'error';
      }
      dibujarProgreso();
    }

    const todasOk = subidas.every((e) => e === 'ok');
    $('#guardar-resultado').textContent = todasOk
      ? `¡Listo, ${alumno.nombre}! Tu maqueta quedó guardada. Tu familia la puede ver en «Ver maquetas».`
      : 'Algunas partes no se pudieron guardar. Tocá «Probar otra vez». Si sigue pasando, avisale a tu docente.';
    $('#btn-guardar-reintentar').classList.toggle('oculto', todasOk);
    $('#btn-guardar-volver').disabled = false;
    $('#ventana-guardar .btn-cerrar').classList.remove('oculto');
    if (todasOk) avisar('☁️ Maqueta guardada en Drive');
  }

  /* =========================================================
     15 b. VER MAQUETAS (galería y visor 360° para familias)
     ========================================================= */
  let maquetasGuardadas = [];                 // lista que llega desde Drive
  const filtros = { grado: 'todos', lugar: 'todos' };

  /* Pide datos al script de Google con una consulta GET */
  async function consultarDrive(parametros) {
    const url = URL_GUARDADO + '?' + new URLSearchParams(parametros).toString();
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    if (!datos.ok) throw new Error(datos.error || 'Error de Drive');
    return datos;
  }

  function mensajeGaleria(texto, conReintento) {
    $('#galeria-estado').innerHTML = escaparHTML(texto) + (conReintento
      ? ' <button id="btn-galeria-reintentar" class="btn btn-celeste" type="button"><span aria-hidden="true">🔁</span> Probar otra vez</button>'
      : '');
    const b = $('#btn-galeria-reintentar');
    if (b) b.addEventListener('click', cargarGaleria);
  }

  async function abrirGaleria() {
    mostrarPantalla('pantalla-galeria');
    await cargarGaleria();
  }

  async function cargarGaleria() {
    $('#galeria-lista').innerHTML = '';
    if (!URL_GUARDADO) {
      mensajeGaleria('El visualizador todavía no está preparado: falta configurar el guardado en Drive.');
      return;
    }
    mensajeGaleria('Buscando maquetas…');
    try {
      const datos = await consultarDrive({ accion: 'listar' });
      maquetasGuardadas = Array.isArray(datos.maquetas) ? datos.maquetas : [];
      dibujarFiltros();
      dibujarGaleria();
    } catch (error) {
      mensajeGaleria('No se pudieron traer las maquetas. Revisá la conexión a internet.', true);
    }
  }

  function datosDeLugar(id, nombre) {
    return LUGARES.find((l) => l.id === id) ||
      Object.assign({}, LUGAR_PROPIO, { nombre: String(nombre || LUGAR_PROPIO.nombre).slice(0, 30) });
  }

  function dibujarFiltros() {
    const grados = ['todos'].concat(GRADOS);
    $('#filtro-grado').innerHTML = grados.map((g) => `
      <button type="button" class="btn btn-filtro ${filtros.grado === g ? 'activo' : ''}" data-filtro-grado="${escaparHTML(g)}"
        aria-pressed="${filtros.grado === g}">${g === 'todos' ? 'Todos los grados' : escaparHTML(g)}</button>`).join('');

    // Solo aparecen los lugares que tienen maquetas guardadas
    const lugares = [...new Set(maquetasGuardadas.map((m) => m.lugar && m.lugar.nombre).filter(Boolean))];
    if (!lugares.includes(filtros.lugar)) filtros.lugar = 'todos';
    $('#filtro-lugar').innerHTML = ['todos'].concat(lugares).map((nombre) => {
      const maqueta = maquetasGuardadas.find((m) => m.lugar && m.lugar.nombre === nombre);
      const emoji = maqueta ? datosDeLugar(maqueta.lugar.id, nombre).emoji : '🏫';
      return `<button type="button" class="btn btn-filtro ${filtros.lugar === nombre ? 'activo' : ''}"
        data-filtro-lugar="${escaparHTML(nombre)}" aria-pressed="${filtros.lugar === nombre}">
        ${nombre === 'todos' ? 'Todos los lugares' : `<span aria-hidden="true">${emoji}</span> ${escaparHTML(nombre)}`}</button>`;
    }).join('');
  }

  function dibujarGaleria() {
    const visibles = maquetasGuardadas.filter((m) =>
      (filtros.grado === 'todos' || m.grado === filtros.grado) &&
      (filtros.lugar === 'todos' || (m.lugar && m.lugar.nombre === filtros.lugar)));

    if (!maquetasGuardadas.length) {
      mensajeGaleria('Todavía no hay maquetas guardadas.');
    } else if (!visibles.length) {
      mensajeGaleria('No hay maquetas con esos filtros. Probá con «Todos».');
    } else {
      mensajeGaleria(visibles.length === 1 ? 'Hay 1 maqueta.' : `Hay ${visibles.length} maquetas.`);
    }

    $('#galeria-lista').innerHTML = visibles.map((m) => {
      const lugar = datosDeLugar(m.lugar && m.lugar.id, m.lugar && m.lugar.nombre);
      const miniatura = /^data:image\/jpeg;base64,/.test(m.miniatura || '')
        ? `<img src="${m.miniatura}" alt="">`
        : '<span class="sin-miniatura" aria-hidden="true">🏫</span>';
      const fecha = m.fecha ? new Date(m.fecha).toLocaleDateString('es-AR') : '';
      return `<button type="button" class="tarjeta-maqueta" data-maqueta="${escaparHTML(m.id)}">
        ${miniatura}
        <span class="tarjeta-maqueta-texto">
          <strong>${escaparHTML(m.alumno || 'Sin nombre')}</strong>
          <span><span aria-hidden="true">${lugar.emoji}</span> ${escaparHTML(lugar.nombre)}</span>
          <small>${escaparHTML(m.grado || '')}${fecha ? ' – ' + fecha : ''}${m.cantidad ? ' – ' + Number(m.cantidad) + ' cuerpos' : ''}</small>
        </span>
      </button>`;
    }).join('');
  }

  /* Revisa cada cuerpo que llega del archivo antes de dibujarlo */
  function cuerpoValido(c, i) {
    const numeros = (a, n) => Array.isArray(a) && a.length === n && a.every(Number.isFinite);
    if (!c || !CUERPOS[c.tipo] || !numeros(c.pos, 3) || !numeros(c.rot, 4) || !numeros(c.esc, 3)) return null;
    return {
      id: i + 1,
      tipo: c.tipo,
      nombre: String(c.nombre || CUERPOS[c.tipo].nombre).slice(0, 30),
      color: /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : CUERPOS[c.tipo].color,
      textura: TEXTURAS.some((t) => t.id === c.textura) ? c.textura : 'lisa',
      pos: c.pos.map((v) => limitar(v, -30, 60)),
      rot: c.rot,
      esc: c.esc.map((v) => limitar(v, 0.03, 10))
    };
  }

  async function abrirMaquetaGuardada(id) {
    mensajeGaleria('Abriendo la maqueta…');
    try {
      const { maqueta } = await consultarDrive({ accion: 'leer', id });
      mostrarEnVisor(maqueta);
    } catch (error) {
      mensajeGaleria('No se pudo abrir esa maqueta. Probá otra vez.', false);
    }
  }

  /* Muestra una maqueta guardada en la escena 3D, solo para mirar */
  function mostrarEnVisor(maqueta) {
    estado.objetos.slice().forEach(quitarMesh);
    estado.seleccion = [];
    estado.desafioActivo = null;
    pilaDeshacer.length = 0;
    pilaRehacer.length = 0;
    $('#cartel-desafio').classList.add('oculto');

    const lugar = datosDeLugar(maqueta.lugar && maqueta.lugar.id, maqueta.lugar && maqueta.lugar.nombre);
    estado.lugar = lugar;
    cambiarColorPiso(lugar.piso);
    (Array.isArray(maqueta.cuerpos) ? maqueta.cuerpos.slice(0, 300) : [])
      .map(cuerpoValido).filter(Boolean).forEach(crearMesh);

    const alumnoTexto = String(maqueta.alumno || '').slice(0, 40);
    const gradoTexto = String(maqueta.grado || '').slice(0, 10);
    $('#chip-lugar').textContent = `${lugar.emoji} ${lugar.nombre} – ${alumnoTexto} (${gradoTexto})`;

    // Resumen de los cuerpos usados, para leer mientras se mira la maqueta
    const datos = datosDeLaEscena();
    $('#visor-info').innerHTML = `<strong>Maqueta de ${escaparHTML(alumnoTexto)}</strong>
      <span>Usó ${datos.total} cuerpos:</span>
      <ul>${ORDEN_CUERPOS.filter((t) => datos.cuenta[t]).map((t) =>
        `<li>${iconoCuerpo(t)} ${CUERPOS[t].nombre}: ${datos.cuenta[t]}</li>`).join('')}</ul>`;

    document.body.classList.add('modo-visor');
    cambiarModo('explorar');
    mostrarPantalla('pantalla-construir');
    ajustarTamanio();
    aplicarVista('libre', true);
    $('#escena-vacia').classList.add('oculto');
  }

  function cerrarVisor() {
    document.body.classList.remove('modo-visor');
    estado.objetos.slice().forEach(quitarMesh);
    cambiarModo('construir');
    mostrarPantalla('pantalla-galeria');
    dibujarGaleria();
  }

  function mostrarMiMaqueta() {
    if (!estado.objetos.length) {
      avisar('Primero agregá algunos cuerpos a tu maqueta 🙂');
      return;
    }
    fotosVistas = {};
    Object.keys(VISTAS).forEach((id) => { fotosVistas[id] = fotoDeVista(id); });

    const datos = datosDeLaEscena();
    $('#titulo-maqueta').textContent = `${estado.lugar.emoji} ${estado.lugar.nombre}`;
    $('#maqueta-total').textContent = `Usé ${datos.total} ${datos.total === 1 ? 'cuerpo geométrico' : 'cuerpos geométricos'} de ${datos.tipos} ${datos.tipos === 1 ? 'tipo' : 'tipos distintos'}.`;

    $('#maqueta-lista').innerHTML = ORDEN_CUERPOS.filter((t) => datos.cuenta[t] > 0).map((t) => {
      const nombres = [...new Set(estado.objetos
        .filter((m) => m.userData.tipo === t && m.userData.nombre !== CUERPOS[t].nombre)
        .map((m) => m.userData.nombre))];
      return `<li>${iconoCuerpo(t)}<span><strong>${CUERPOS[t].nombre}</strong>: ${datos.cuenta[t]}
        ${nombres.length ? `<small>Lo usé para: ${nombres.map(escaparHTML).join(', ')}</small>` : ''}</span></li>`;
    }).join('');

    $('#maqueta-miniaturas').innerHTML = Object.keys(VISTAS).map((id) => `
      <button type="button" class="miniatura ${id === 'libre' ? 'activa' : ''}" data-vista-foto="${id}" aria-pressed="${id === 'libre'}">
        <img src="${fotosVistas[id]}" alt="">${VISTAS[id].nombre}
      </button>`).join('');
    elegirFotoGrande('libre');
    abrirVentana('ventana-maqueta');
  }

  function elegirFotoGrande(id) {
    $('#maqueta-imagen-grande').src = fotosVistas[id];
    $('#maqueta-imagen-grande').alt = `Mi maqueta: ${VISTAS[id].nombre}`;
    $$('.miniatura').forEach((m) => {
      const activa = m.dataset.vistaFoto === id;
      m.classList.toggle('activa', activa);
      m.setAttribute('aria-pressed', activa);
    });
  }

  /* =========================================================
     16. VENTANAS, AVISOS Y TECLADO
     ========================================================= */
  function abrirVentana(id) {
    $$('.ventana').forEach((v) => v.classList.add('oculto'));
    $('#' + id).classList.remove('oculto');
    const primero = $('#' + id).querySelector('button');
    if (primero) primero.focus();
  }

  function cerrarVentana(id) {
    $('#' + id).classList.add('oculto');
  }

  const ventanaAbierta = () => $$('.ventana').find((v) => !v.classList.contains('oculto'));

  let temporizadorAviso = null;
  function avisar(texto, duracion) {
    const aviso = $('#aviso');
    aviso.textContent = texto;
    aviso.classList.add('visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), duracion || 1800);
  }

  function conectarTeclado() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const v = ventanaAbierta();
        if (v) { v.classList.add('oculto'); return; }
        if (estado.seleccion.length) elegir([]);
        return;
      }
      const escribiendo = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if (escribiendo || ventanaAbierta() || !$('#pantalla-construir').classList.contains('activa')) return;

      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) rehacer(); else deshacer(); return; }
      if (ctrl && e.key.toLowerCase() === 'y') { e.preventDefault(); rehacer(); return; }
      if (estado.modo !== 'construir' || !estado.seleccion.length) return;

      const teclas = {
        ArrowLeft: () => mover('izquierda'), ArrowRight: () => mover('derecha'),
        ArrowUp: () => mover('atras'), ArrowDown: () => mover('adelante'),
        PageUp: () => mover('subir'), PageDown: () => mover('bajar'),
        Delete: borrarElegidos, Backspace: borrarElegidos
      };
      if (teclas[e.key]) { e.preventDefault(); teclas[e.key](); }
    });
  }

  function conectarBotones() {
    $('#btn-comenzar').addEventListener('click', () => mostrarPantalla('pantalla-lugares'));

    // Ver maquetas guardadas
    $('#btn-ver-maquetas').addEventListener('click', abrirGaleria);
    $('#btn-galeria-volver').addEventListener('click', () => mostrarPantalla('pantalla-bienvenida'));
    $('#btn-volver-galeria').addEventListener('click', cerrarVisor);
    $('#filtro-grado').addEventListener('click', (e) => {
      const b = e.target.closest('[data-filtro-grado]');
      if (!b) return;
      filtros.grado = b.dataset.filtroGrado;
      dibujarFiltros();
      dibujarGaleria();
    });
    $('#filtro-lugar').addEventListener('click', (e) => {
      const b = e.target.closest('[data-filtro-lugar]');
      if (!b) return;
      filtros.lugar = b.dataset.filtroLugar;
      dibujarFiltros();
      dibujarGaleria();
    });
    $('#galeria-lista').addEventListener('click', (e) => {
      const t = e.target.closest('[data-maqueta]');
      if (t) abrirMaquetaGuardada(t.dataset.maqueta);
    });

    $('#btn-deshacer').addEventListener('click', deshacer);
    $('#btn-rehacer').addEventListener('click', rehacer);
    $$('.btn-vista').forEach((b) => b.addEventListener('click', () => aplicarVista(b.dataset.vista, false)));
    $('#btn-modo').addEventListener('click', () => {
      const nuevo = estado.modo === 'construir' ? 'explorar' : 'construir';
      cambiarModo(nuevo);
      avisar(nuevo === 'explorar' ? '🔭 Modo explorar' : '🛠️ Modo construir');
    });
    $('#btn-nuevo').addEventListener('click', () => abrirVentana('ventana-confirmar'));
    $('#btn-confirmar-no').addEventListener('click', () => cerrarVentana('ventana-confirmar'));
    $('#btn-confirmar-si').addEventListener('click', () => {
      cerrarVentana('ventana-confirmar');
      $('#form-propio').classList.add('oculto');
      $('#input-propio').value = '';
      mostrarPantalla('pantalla-lugares');
    });

    $('#btn-desafios').addEventListener('click', () => { dibujarDesafios(); abrirVentana('ventana-desafios'); });
    $('#lista-desafios').addEventListener('click', (e) => {
      const t = e.target.closest('[data-desafio]');
      if (t) activarDesafio(t.dataset.desafio);
    });
    $('#btn-cerrar-desafio').addEventListener('click', () => {
      estado.desafioActivo = null;
      $('#cartel-desafio').classList.add('oculto');
    });

    $('#btn-clasificar').addEventListener('click', () => { prepararClasificacion(); abrirVentana('ventana-clasificar'); });

    $('#btn-mostrar').addEventListener('click', mostrarMiMaqueta);
    $('#maqueta-miniaturas').addEventListener('click', (e) => {
      const m = e.target.closest('[data-vista-foto]');
      if (m) elegirFotoGrande(m.dataset.vistaFoto);
    });
    $('#btn-guardar-drive').addEventListener('click', abrirGuardar);
    $('#grados').addEventListener('click', (e) => {
      const b = e.target.closest('[data-grado]');
      if (!b) return;
      alumno.grado = b.dataset.grado;
      $('#guardar-aviso').textContent = '';
      dibujarGrados();
    });
    $('#input-alumno').addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmarGuardado(); });
    $('#btn-guardar-confirmar').addEventListener('click', confirmarGuardado);
    $('#btn-guardar-reintentar').addEventListener('click', guardarVistasEnDrive);
    $('#btn-guardar-volver').addEventListener('click', () => abrirVentana('ventana-maqueta'));

    // Botones "cerrar" y clic en el fondo oscuro
    $$('[data-cerrar]').forEach((b) => b.addEventListener('click', () => b.closest('.ventana').classList.add('oculto')));
    $$('.ventana').forEach((v) => v.addEventListener('click', (e) => {
      if (e.target === v && v.id !== 'ventana-confirmar') v.classList.add('oculto');
    }));
  }

  /* Un botón extra en el cartel del desafío: "¡Terminé!" */
  function agregarBotonTermine() {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.style.minHeight = '36px';
    b.style.padding = '2px 10px';
    b.style.fontSize = '16px';
    b.innerHTML = '<span aria-hidden="true">✅</span> ¡Terminé!';
    b.addEventListener('click', () => revisarDesafio(true));
    $('#cartel-desafio').insertBefore(b, $('#btn-cerrar-desafio'));
  }

  /* =========================================================
     17. INICIO
     ========================================================= */
  function iniciar() {
    if (typeof THREE === 'undefined') {
      document.body.innerHTML = '<p style="padding:40px;font-size:22px;font-family:sans-serif">No se pudo cargar la parte 3D. Revisá que la computadora tenga internet y volvé a abrir la página.</p>';
      return;
    }
    $('#dibujo-escuela').innerHTML = dibujoEscuela();
    dibujarLugares();
    dibujarPanelCuerpos();
    iniciarEscena3D();
    conectarBotonesCamara();
    conectarPanelDerecho();
    conectarClasificacion();
    conectarBotones();
    conectarTeclado();
    agregarBotonTermine();
    despuesDeCambiar();
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
