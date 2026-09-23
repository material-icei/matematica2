/* =========================================================
   CONSTRUIMOS NUESTRA ESCUELA — Guardado en Google Drive
   Este código NO va en GitHub: se pega en Google Apps Script
   (script.google.com) y se publica como "aplicación web".
   Los pasos están en README.md.
   ========================================================= */

// Carpeta de Drive donde se guardan las maquetas
const CARPETA_ID = '1FCw5rEQmlJDBIuEKJbKuXsnhgMTZSDDW';

// Tamaño máximo aceptado por imagen (10 MB), para evitar envíos extraños
const TAMANIO_MAXIMO = 10 * 1024 * 1024;

/* Recibe una imagen desde la app y la guarda en la carpeta */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);

    // Nombre del archivo: se quitan caracteres no permitidos
    let nombre = String(datos.nombreArchivo || 'maqueta.png')
      .replace(/[\\/:*?"<>|#%]/g, '')
      .slice(0, 150);
    if (!/\.png$/i.test(nombre)) nombre += '.png';

    // La imagen llega como texto (base64); se convierte en archivo PNG
    const base64 = String(datos.imagen || '').replace(/^data:image\/png;base64,/, '');
    const bytes = Utilities.base64Decode(base64);
    if (!bytes.length || bytes.length > TAMANIO_MAXIMO) {
      return responder({ ok: false, error: 'Imagen vacía o demasiado grande' });
    }

    const archivo = DriveApp.getFolderById(CARPETA_ID)
      .createFile(Utilities.newBlob(bytes, 'image/png', nombre));

    return responder({ ok: true, nombre: archivo.getName() });
  } catch (error) {
    return responder({ ok: false, error: String(error) });
  }
}

/* Sirve para probar que la aplicación web está funcionando:
   al abrir su dirección en el navegador debe decir "ok": true */
function doGet() {
  return responder({ ok: true, mensaje: 'Guardado de maquetas funcionando' });
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
