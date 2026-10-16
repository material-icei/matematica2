/* =========================================================
   CONSTRUIMOS NUESTRA ESCUELA — Guardado y visor en Google Drive
   Este código NO va en GitHub: se pega en Google Apps Script
   (script.google.com) y se publica como "aplicación web".
   Los pasos están en README.md.

   Hace tres cosas:
   - Guardar (POST): recibe la maqueta 360° (JSON), la guarda en la
     carpeta y actualiza el ÍNDICE de maquetas.
   - Listar (GET ?accion=listar): devuelve el índice completo
     (datos, miniatura y cuerpos de cada maqueta) leyendo UN solo
     archivo, así la galería carga rápido.
   - Leer (GET ?accion=leer&id=...): devuelve una maqueta. Se usa
     solo como respaldo, porque el índice ya trae los cuerpos.
   ========================================================= */

// Carpeta de Drive donde se guardan las maquetas
const CARPETA_ID = '1FCw5rEQmlJDBIuEKJbKuXsnhgMTZSDDW';

// Archivo índice (se crea solo dentro de la carpeta; no hace falta tocarlo)
const NOMBRE_INDICE = 'indice-maquetas.json';

// Límites para evitar envíos extraños
const TAMANIO_MAXIMO = 10 * 1024 * 1024;   // 10 MB por archivo
const MAXIMO_MAQUETAS = 300;

/* ---------- GUARDAR ---------- */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const nombre = String(datos.nombreArchivo || '')
      .replace(/[\\/:*?"<>|#%]/g, '')
      .slice(0, 150);
    if (!/-maqueta\.json$/i.test(nombre)) return responder({ ok: false, error: 'Tipo de archivo no permitido' });

    const texto = String(datos.contenido || '');
    if (!texto || texto.length > TAMANIO_MAXIMO) return responder({ ok: false, error: 'Maqueta vacía o demasiado grande' });
    const maqueta = JSON.parse(texto);
    if (maqueta.app !== 'construimos-escuela' || !Array.isArray(maqueta.cuerpos)) {
      return responder({ ok: false, error: 'No es una maqueta válida' });
    }

    // El candado evita que dos alumnos que guardan a la vez pisen el índice
    const candado = LockService.getScriptLock();
    candado.waitLock(20000);
    try {
      const carpeta = DriveApp.getFolderById(CARPETA_ID);
      // Si ya había una maqueta con el mismo nombre, se reemplaza (la vieja va a la papelera)
      const anteriores = carpeta.getFilesByName(nombre);
      while (anteriores.hasNext()) anteriores.next().setTrashed(true);
      const archivo = carpeta.createFile(nombre, texto, 'application/json');

      const indice = leerIndice(carpeta).filter(function (m) { return m.nombreArchivo !== nombre; });
      indice.push(entradaDeIndice(archivo, maqueta));
      guardarIndice(carpeta, indice);
    } finally {
      candado.releaseLock();
    }
    return responder({ ok: true, nombre: nombre });
  } catch (error) {
    return responder({ ok: false, error: String(error) });
  }
}

/* ---------- LISTAR Y LEER ---------- */
function doGet(e) {
  try {
    const accion = e && e.parameter ? e.parameter.accion : '';
    if (accion === 'listar') return responder({ ok: true, maquetas: listarMaquetas() });
    if (accion === 'leer') return responder({ ok: true, maqueta: leerMaqueta(e.parameter.id) });
    // Sin acción: sirve para probar que la aplicación web funciona
    return responder({ ok: true, mensaje: 'Guardado de maquetas funcionando' });
  } catch (error) {
    return responder({ ok: false, error: String(error) });
  }
}

/* Devuelve el índice. Antes revisa, solo por nombre y sin abrir archivos,
   que coincida con la carpeta: quita las maquetas borradas a mano y agrega
   las que falten (por ejemplo, las guardadas antes de que existiera el índice). */
function listarMaquetas() {
  const carpeta = DriveApp.getFolderById(CARPETA_ID);
  const enCarpeta = {};
  const archivos = carpeta.searchFiles("title contains '-maqueta.json' and trashed = false");
  while (archivos.hasNext()) {
    const archivo = archivos.next();
    enCarpeta[archivo.getId()] = archivo;
  }

  const original = leerIndice(carpeta);
  const indice = original.filter(function (m) { return enCarpeta[m.id]; });
  const yaEstan = {};
  indice.forEach(function (m) { yaEstan[m.id] = true; });

  let agregadas = 0;
  Object.keys(enCarpeta).forEach(function (id) {
    if (yaEstan[id] || indice.length >= MAXIMO_MAQUETAS) return;
    try {
      const maqueta = JSON.parse(enCarpeta[id].getBlob().getDataAsString());
      if (maqueta.app === 'construimos-escuela') {
        indice.push(entradaDeIndice(enCarpeta[id], maqueta));
        agregadas++;
      }
    } catch (error) {
      // Si un archivo está dañado, se saltea
    }
  });

  if (agregadas || indice.length !== original.length) guardarIndice(carpeta, indice);
  // Las más nuevas primero
  indice.sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
  return indice;
}

/* Datos de una maqueta para el índice (incluye los cuerpos, que pesan poco) */
function entradaDeIndice(archivo, m) {
  return {
    id: archivo.getId(),
    nombreArchivo: archivo.getName(),
    grado: m.grado,
    alumno: m.alumno,
    lugar: m.lugar,
    fecha: m.fecha,
    cantidad: Array.isArray(m.cuerpos) ? m.cuerpos.length : 0,
    miniatura: m.miniatura,
    cuerpos: m.cuerpos
  };
}

function leerIndice(carpeta) {
  const archivos = carpeta.getFilesByName(NOMBRE_INDICE);
  if (!archivos.hasNext()) return [];
  try {
    const datos = JSON.parse(archivos.next().getBlob().getDataAsString());
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function guardarIndice(carpeta, indice) {
  const texto = JSON.stringify(indice);
  const archivos = carpeta.getFilesByName(NOMBRE_INDICE);
  if (archivos.hasNext()) archivos.next().setContent(texto);
  else carpeta.createFile(NOMBRE_INDICE, texto, 'application/json');
}

/* Para la docente: ejecutá esta función una vez desde el editor (botón ▶)
   después de publicar esta versión. Arma el índice con las maquetas que ya
   están guardadas. También sirve si alguna vez el índice queda raro. */
function reconstruirIndice() {
  const carpeta = DriveApp.getFolderById(CARPETA_ID);
  const archivos = carpeta.getFilesByName(NOMBRE_INDICE);
  while (archivos.hasNext()) archivos.next().setTrashed(true);
  const total = listarMaquetas().length;
  Logger.log(total + ' maquetas en el índice');
  return total;
}

/* Devuelve una maqueta completa. Solo lee archivos de la carpeta de maquetas. */
function leerMaqueta(id) {
  const archivo = DriveApp.getFileById(String(id || ''));
  let estaEnLaCarpeta = false;
  const padres = archivo.getParents();
  while (padres.hasNext()) {
    if (padres.next().getId() === CARPETA_ID) estaEnLaCarpeta = true;
  }
  if (!estaEnLaCarpeta || !/-maqueta\.json$/i.test(archivo.getName()) || archivo.isTrashed()) {
    throw new Error('Maqueta no encontrada');
  }
  return JSON.parse(archivo.getBlob().getDataAsString());
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
