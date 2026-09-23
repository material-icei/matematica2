/* =========================================================
   CONSTRUIMOS NUESTRA ESCUELA — Guardado y visor en Google Drive
   Este código NO va en GitHub: se pega en Google Apps Script
   (script.google.com) y se publica como "aplicación web".
   Los pasos están en README.md.

   Hace tres cosas:
   - Guardar (POST): recibe las 4 imágenes PNG y el archivo
     de la maqueta 360° (JSON) y los guarda en la carpeta.
   - Listar (GET ?accion=listar): devuelve las maquetas guardadas
     para la galería "Ver maquetas".
   - Leer (GET ?accion=leer&id=...): devuelve una maqueta para
     verla en 3D.
   ========================================================= */

// Carpeta de Drive donde se guardan las maquetas
const CARPETA_ID = '1FCw5rEQmlJDBIuEKJbKuXsnhgMTZSDDW';

// Límites para evitar envíos extraños
const TAMANIO_MAXIMO = 10 * 1024 * 1024;   // 10 MB por archivo
const MAXIMO_MAQUETAS_EN_LISTA = 300;

/* ---------- GUARDAR ---------- */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const nombre = String(datos.nombreArchivo || '')
      .replace(/[\\/:*?"<>|#%]/g, '')
      .slice(0, 150);
    const carpeta = DriveApp.getFolderById(CARPETA_ID);

    // Maqueta 360° (JSON): si ya había una con el mismo nombre, se reemplaza
    if (/\.json$/i.test(nombre)) {
      const texto = String(datos.contenido || '');
      if (!texto || texto.length > TAMANIO_MAXIMO) return responder({ ok: false, error: 'Maqueta vacía o demasiado grande' });
      const maqueta = JSON.parse(texto);
      if (maqueta.app !== 'construimos-escuela' || !Array.isArray(maqueta.cuerpos)) {
        return responder({ ok: false, error: 'No es una maqueta válida' });
      }
      const anteriores = carpeta.getFilesByName(nombre);
      while (anteriores.hasNext()) anteriores.next().setTrashed(true);
      carpeta.createFile(nombre, texto, 'application/json');
      return responder({ ok: true, nombre: nombre });
    }

    // Imagen PNG de una vista
    if (/\.png$/i.test(nombre)) {
      const base64 = String(datos.imagen || '').replace(/^data:image\/png;base64,/, '');
      const bytes = Utilities.base64Decode(base64);
      if (!bytes.length || bytes.length > TAMANIO_MAXIMO) return responder({ ok: false, error: 'Imagen vacía o demasiado grande' });
      carpeta.createFile(Utilities.newBlob(bytes, 'image/png', nombre));
      return responder({ ok: true, nombre: nombre });
    }

    return responder({ ok: false, error: 'Tipo de archivo no permitido' });
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

/* Devuelve los datos para la galería (sin los cuerpos, para que sea liviana) */
function listarMaquetas() {
  const archivos = DriveApp.getFolderById(CARPETA_ID)
    .searchFiles("title contains '-maqueta.json' and trashed = false");
  const lista = [];
  while (archivos.hasNext() && lista.length < MAXIMO_MAQUETAS_EN_LISTA) {
    const archivo = archivos.next();
    try {
      const m = JSON.parse(archivo.getBlob().getDataAsString());
      if (m.app !== 'construimos-escuela') continue;
      lista.push({
        id: archivo.getId(),
        grado: m.grado,
        alumno: m.alumno,
        lugar: m.lugar,
        fecha: m.fecha,
        cantidad: Array.isArray(m.cuerpos) ? m.cuerpos.length : 0,
        miniatura: m.miniatura
      });
    } catch (error) {
      // Si un archivo está dañado, se saltea
    }
  }
  // Las más nuevas primero
  lista.sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
  return lista;
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
