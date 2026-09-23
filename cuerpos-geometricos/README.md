# Construimos nuestra escuela

App web educativa para alumnos de **2.º grado** (7–8 años). Los chicos eligen un lugar de la escuela y arman una **maqueta 3D** con cuerpos geométricos: prisma rectangular, cubo, cilindro, esfera, cono y pirámide de base cuadrada.

Está basada en el proyecto de la docente sobre el reconocimiento del entorno cercano: el recorrido por la escuela, la idea de mirarla "desde un pajarito" y el paso al croquis o plano.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de las pantallas y ventanas |
| `styles.css` | Colores, tipografías y diseño |
| `script.js` | Toda la lógica: escena 3D, cuerpos, desafíos, clasificación e imágenes |
| `README.md` | Este documento |
| `guardar-en-drive.gs` | Código para Google Apps Script que guarda las imágenes en Drive. **No se sube a GitHub** |

No usa servidor propio, base de datos ni frameworks. La parte 3D usa **Three.js (versión 0.147)** cargado desde un CDN, y las tipografías vienen de Google Fonts.

> **Importante:** las computadoras necesitan internet para cargar Three.js. Si no hay conexión, la app muestra un aviso en lugar de la escena.

## Cómo probarla

Hacé doble clic en `index.html` para abrirla en Google Chrome. Funciona también en Chromebooks, con mouse o con pantalla táctil.

## Cómo publicarla en GitHub Pages

1. Dentro del repositorio del sitio, creá una carpeta nueva, por ejemplo `construimos-escuela/`.
2. Copiá ahí los cuatro archivos.
3. En el `index.html` principal del sitio, agregá un enlace a la carpeta nueva:
   ```html
   <a href="construimos-escuela/index.html">Construimos nuestra escuela</a>
   ```
4. Hacé `git add`, `git commit` y `git push`. En uno o dos minutos la app queda publicada en `https://TU-USUARIO.github.io/TU-REPOSITORIO/construimos-escuela/`.

## Recorrido de la app

1. **Bienvenida:** "¡Construyamos nuestra escuela!" y el botón ▶ Comenzar.
2. **Elegir el lugar:** Aula, Patio, Biblioteca, Dirección, Secretaría, Baños, Hall, Entrada, Gimnasio, Comedor o *Mi propio espacio*, al que el alumno le pone nombre.
3. **Construcción:**
   - **Izquierda:** los seis cuerpos. Con un toque se agregan a la maqueta.
   - **Centro:** la escena 3D. Arrastrar un cuerpo lo mueve por el piso. Si se lo suelta sobre otro cuerpo, queda apoyado encima; así se arma un techo sobre una pared. Arrastrar el fondo gira la cámara. La rueda del mouse o el gesto de pellizcar acercan y alejan.
   - **Derecha:** si no hay nada elegido, aparecen las **ideas del lugar** (por ejemplo "Pizarrón → prisma rectangular"). Son ayudas, y al tocarlas se agrega el cuerpo ya preparado. Si hay un cuerpo elegido, aparecen su **ficha**, el nombre, y los controles para mover, cambiar el tamaño, girar, pintar, elegir textura, copiar y borrar.
   - **Abajo:** Deshacer, Rehacer, las cuatro vistas (3D, desde arriba, de frente y de costado), Explorar y Nuevo proyecto.
4. **Explorar:** se esconden los paneles de edición y la maqueta se recorre con controles más grandes.
5. **Desafíos geométricos:** hay siete consignas. Cuando se cumple una, aparece un mensaje positivo. El botón "¡Terminé!" da una pista amable si todavía falta algo. No hay mensajes negativos ni penalizaciones.
6. **¿Rueda o no rueda?:** se arrastra cada cuerpo al grupo correcto, o se toca el cuerpo y después el grupo. Si se equivoca, la ficha vuelve con una pregunta para pensar. Al terminar aparece una explicación sencilla.
7. **Mostrar mi maqueta:** muestra el nombre del lugar, cuántos cuerpos se usaron y de qué tipos, para qué se usó cada uno y las cuatro vistas. El botón **"Guardar mi maqueta en Drive"** pide el nombre del alumno y el grado (2ºA o 2ºB). Después guarda las 4 vistas como imágenes separadas en la carpeta de Drive del proyecto. Cada imagen lleva un título con el grado, el lugar, el nombre y la vista.

### Detalles pensados para 2.º grado

- Los botones de mover siguen a la cámara: "Derecha" siempre mueve hacia la derecha de lo que se ve en pantalla.
- Los cuerpos no atraviesan el piso y no salen de la base de la maqueta.
- Las aristas se ven marcadas con una línea oscura, para poder contar caras, vértices y aristas.
- El cuerpo elegido "late" con un brillo suave.
- Los colores y las texturas siempre llevan su nombre escrito, así la información no depende solo del color.
- El borde delantero de la base dice "Frente" para orientarse en las vistas.

### Atajos de teclado para la docente

| Tecla | Acción |
|---|---|
| Ctrl + Z / Ctrl + Y | Deshacer / Rehacer |
| Flechas | Mover el cuerpo elegido |
| Re Pág / Av Pág | Subir / Bajar |
| Supr | Borrar |
| Shift + clic | Elegir varios cuerpos |
| Esc | Cerrar una ventana o dejar de elegir |

## Guardar las maquetas en Google Drive

### Cómo se llaman los archivos

Cada maqueta genera 4 archivos PNG con el formato `grado-lugar-nombre-número.png`. Por ejemplo:

| Número | Vista | Ejemplo |
|---|---|---|
| 1 | Vista 3D | `2ºB-Biblioteca-Juana Pérez-1.png` |
| 2 | Desde arriba | `2ºB-Biblioteca-Juana Pérez-2.png` |
| 3 | De frente | `2ºB-Biblioteca-Juana Pérez-3.png` |
| 4 | De costado | `2ºB-Biblioteca-Juana Pérez-4.png` |

Si una imagen no se puede guardar (por ejemplo, porque se cortó internet), la app lo muestra y ofrece "Probar otra vez". Al reintentar, solo vuelve a enviar las que faltaron. El nombre y el grado se recuerdan mientras la página esté abierta, así el alumno no tiene que volver a escribirlos.

Si un alumno guarda dos veces la misma maqueta, Drive guarda las dos copias con el mismo nombre; no se borra nada.

### Por qué hace falta un paso extra

Una página publicada en GitHub Pages no puede escribir sola en una carpeta de Drive: Google exige permiso de una cuenta con acceso a esa carpeta. La solución es un pequeño programa de **Google Apps Script** que funciona con la cuenta de la docente. La app le manda las imágenes y el script las guarda en la carpeta. Los alumnos no necesitan iniciar sesión con Google.

### Configuración (se hace una sola vez)

La tiene que hacer una persona con permiso de **edición** en la carpeta de Drive.

1. Entrá a [script.google.com](https://script.google.com) con esa cuenta y tocá **Nuevo proyecto**.
2. Borrá el contenido que aparece, pegá todo el archivo `guardar-en-drive.gs` y guardá. Podés ponerle de nombre al proyecto "Guardado de maquetas".
3. Tocá **Implementar → Nueva implementación**. En el engranaje, elegí **Aplicación web** y completá:
   - **Ejecutar como:** Yo.
   - **Quién tiene acceso:** Cualquier persona.
4. Tocá **Implementar**. Google pide autorizar el acceso a Drive: aceptá. Si aparece "Google no verificó esta app", entrá en *Configuración avanzada → Ir a Guardado de maquetas*. Es normal, porque el script es tuyo.
5. Copiá la **URL de la aplicación web**, que termina en `/exec`.
6. En `script.js`, al principio de la sección de configuración, pegala entre las comillas:
   ```js
   const URL_GUARDADO = 'https://script.google.com/macros/s/.../exec';
   ```
7. Subí el `script.js` actualizado a GitHub.

Para comprobar que funciona, abrí la URL `/exec` en el navegador: tiene que mostrar `"ok": true`.

Si más adelante cambiás el código del script, usá **Implementar → Gestionar implementaciones → Editar → Nueva versión**. Así la URL sigue siendo la misma.

Mientras `URL_GUARDADO` esté vacía, la app avisa: "El guardado en Drive todavía no está preparado. Avisale a tu docente".

### Privacidad

La dirección `/exec` permite subir imágenes a la carpeta, pero no permite ver ni borrar lo que ya está guardado. Conviene no compartirla fuera de la escuela. Se recomienda que los alumnos escriban solo su **nombre**, sin apellido.

Aparte del guardado en Drive, la maqueta no queda guardada en la computadora. Si se cierra o se recarga la página, se empieza de nuevo. Antes de borrarla con "Nuevo proyecto", la app pide confirmación y recuerda guardarla.

## Cómo modificar la app (para docentes)

Todo lo que se puede cambiar está al principio de `script.js`, en la sección **1. CONFIGURACIÓN**.

- **`CUERPOS`**: nombre, color inicial, si rueda, texto de la ficha, caras, vértices, aristas y ejemplos de la escuela.
- **`COLORES`**: la paleta para pintar. Cada color lleva `nombre` y `hex`.
- **`TEXTURAS`**: la lista de texturas. Si querés quitar una, borrá su línea.
- **`LUGARES`**: los lugares de la escuela, con su emoji, el color del piso y las ideas. Por ejemplo, para agregar una idea al aula:
  ```js
  { objeto: 'Armario', cuerpo: 'prisma', escala: [0.6, 1.3, 0.35], color: '#9a6436', textura: 'madera' }
  ```
  `escala` es ancho, alto y profundidad comparados con el cuerpo original.
- **`DESAFIOS`**: cada desafío tiene `texto`, `pista` y una función `cumple`. Por ejemplo, este pide al menos 2 conos:
  ```js
  {
    id: 'conos',
    texto: 'Poné 2 conos en el gimnasio.',
    pista: 'Buscá el cono en el panel de la izquierda.',
    cumple: (d) => d.cuenta.cono >= 2
  }
  ```
  En `d.cuenta` está cuántos cuerpos hay de cada tipo (`prisma`, `cubo`, `cilindro`, `esfera`, `cono`, `piramide`), y en `d.tipos` cuántos tipos distintos se usaron.
- **`MENSAJE_LOGRO`**: el mensaje que aparece al cumplir un desafío.
- **`URL_GUARDADO`**: la dirección del script de Google que guarda en Drive.
- **`GRADOS`**: las divisiones que aparecen al guardar. Si hace falta, se agrega una, por ejemplo `'2ºC'`.
- **`VISTAS_A_GUARDAR`**: el orden de las vistas, que define los números 1 a 4 del nombre del archivo.

La carpeta de destino se cambia en `guardar-en-drive.gs`, en la línea `CARPETA_ID`. Después hay que publicar una nueva versión del script.

Los colores generales de la interfaz están en las variables de `:root`, al principio de `styles.css`.

## Comprobaciones realizadas

La app se probó en Chromium, en pantallas de 1366 × 680 (Chromebook) y de 800 px de ancho, sin errores en la consola:

- [x] Los tres archivos están vinculados.
- [x] Aparecen los seis cuerpos.
- [x] Los cuerpos se mueven con botones, con el teclado y arrastrándolos. Se pueden apilar.
- [x] Se rotan en los tres ejes.
- [x] Cambian de tamaño, tanto en general como solo alto, ancho o grosor.
- [x] Cambian de color y de textura.
- [x] Se copian, se borran y se renombran. Se pueden elegir varios juntos.
- [x] Deshacer y rehacer funcionan.
- [x] Las cuatro vistas y los controles de cámara funcionan.
- [x] Los desafíos se detectan y felicitan.
- [x] La clasificación funciona arrastrando y tocando.
- [x] Se piden el nombre y el grado, y se envían las 4 vistas por separado con el nombre `grado-lugar-nombre-x.png`. Se probó con un servidor simulado, incluyendo un error y el reintento.
- [x] No depende de ningún servidor propio.
