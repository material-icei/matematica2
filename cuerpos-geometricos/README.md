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
| `guardar-en-drive.gs` | Código para Google Apps Script que guarda las maquetas en Drive y las entrega al visor. **No se sube a GitHub** |

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

```
Bienvenida ─▶ ¿Qué querés hacer?
                ├─ 📚 Actividades de repaso ─▶ 6 actividades
                ├─ 🧱 Construir ─▶ ¿Qué lugar querés construir? ─▶ Construcción
                └─ 👀 Ver maquetas ─▶ Galería ─▶ Maqueta en 3D
```

1. **Bienvenida:** "¡Construyamos nuestra escuela! Actividades sobre los cuerpos geométricos", con un solo botón: ▶ Comenzar.
2. **¿Qué querés hacer?:** tres tarjetas grandes: Actividades de repaso, Construir y Ver maquetas.

### Actividades de repaso (grilla de 3 × 2)

| Actividad | Qué hace el alumno |
|---|---|
| 📖 **Conceptos** | Elige un cuerpo y lo ve girar en 3D (puede girarlo con el dedo). Ve su ficha: cantidad de caras, aristas y vértices, cómo son sus caras, si rueda o no y en qué objetos de la escuela aparece. |
| 📍 **Elementos de un cuerpo** | La app muestra los 6 cuerpos en orden aleatorio y pide "Tocá una CARA / ARISTA / VÉRTICE del…". El alumno puede girar el cuerpo. Si acierta, el elemento se pinta de rojo. Si toca otro elemento, se pinta de amarillo y la app le explica qué tocó y qué tiene que buscar. A la derecha quedan las definiciones con marcas de color. |
| ⚽ **¿Rueda o no rueda?** | Arrastra cada cuerpo al grupo correcto (o lo toca y después toca el grupo). |
| 🔗 **Asociar** | La app pide un cuerpo ("Tocá todos los objetos con forma de CILINDRO") y el alumno toca los objetos de la grilla. Los que encuentra se ponen tenues con un ✓. Si toca uno que no corresponde, la tarjeta hace un pequeño rebote con una pregunta para pensar. Son 6 rondas. |
| ✏️ **Escribir el nombre** | Un cuerpo gira en 3D y el alumno escribe su nombre. Se aceptan mayúsculas, minúsculas y palabras sin tilde. Las rayitas muestran cuántas letras tiene, y el botón 💡 Pista va mostrando letras. |
| 🏆 **Desafíos** | Elige una consigna y la app lo lleva **directo a un espacio libre** para construirla. Al cumplirla aparece la felicitación, con dos opciones: seguir construyendo o elegir más desafíos. |

Todas las actividades tienen puntitos de avance, mensajes positivos y el botón "Jugar otra vez" al terminar.

**Cómo se cuentan los elementos.** Según la definición del proyecto, las caras pueden ser planas o curvas:

| Cuerpo | Caras | Aristas | Vértices |
|---|---|---|---|
| Cubo | 6 | 12 | 8 |
| Prisma rectangular | 6 | 12 | 8 |
| Pirámide de base cuadrada | 5 | 8 | 5 |
| Cilindro | 3 (2 planas y 1 curva) | 2 | 0 |
| Cono | 2 (1 plana y 1 curva) | 1 | 1 |
| Esfera | 1 (curva) | 0 | 0 |

### Construir

1. **Elegir el lugar:** Aula, Patio, Biblioteca, Dirección, Secretaría, Baños, Hall, Entrada, Gimnasio, Comedor o *Mi propio espacio*, al que el alumno le pone nombre.
2. **Construcción:**
   - **Izquierda:** los seis cuerpos. Con un toque se agregan a la maqueta.
   - **Centro:** la escena 3D. Arrastrar un cuerpo lo mueve por el piso. Si se lo suelta sobre otro cuerpo, queda apoyado encima; así se arma un techo sobre una pared. Arrastrar el fondo gira la cámara. La rueda del mouse o el gesto de pellizcar acercan y alejan.
   - **Derecha:** si no hay nada elegido, aparecen las **ideas del lugar** (por ejemplo "Pizarrón → prisma rectangular"). Al tocarlas se agrega el cuerpo ya preparado. Si hay un cuerpo elegido, aparecen su nombre y los controles para mover, cambiar el tamaño, girar, pintar, elegir textura, copiar y borrar. La ficha de cada cuerpo está ahora en Conceptos.
   - **Arriba:** 💾 **Guardar maqueta**. Abre una ventana con las 4 vistas y la cantidad de cuerpos usados. Desde ahí se guarda en Drive con el nombre y el grado (ver más abajo).
   - **Abajo:** Deshacer, Rehacer, las cuatro vistas (3D, desde arriba, de frente y de costado), 🔭 **Mostrar maqueta** y 🏠 **Volver al inicio**.
3. **Mostrar maqueta:** se esconden los paneles de edición y la maqueta se recorre con controles más grandes. El botón cambia a "Seguir construyendo".
4. **Volver al inicio:** vuelve a la pantalla de las tres tarjetas. Si hay cuerpos en la maqueta, primero pide confirmación y recuerda guardarla.

### Ver maquetas

Es una galería con las maquetas guardadas, que se pueden filtrar por grado y por lugar. Al tocar una, se abre en 3D **solo para mirar**: se puede girar, acercar y cambiar de vista, y aparece un resumen de los cuerpos usados. Está pensada para alumnos y familias.

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

Cada maqueta genera 5 archivos. Hay 4 imágenes PNG, con el formato `grado-lugar-nombre-número.png`, y un archivo con la maqueta 360°. Por ejemplo:

| Número | Vista | Ejemplo |
|---|---|---|
| 1 | Vista 3D | `2ºB-Biblioteca-Juana Pérez-1.png` |
| 2 | Desde arriba | `2ºB-Biblioteca-Juana Pérez-2.png` |
| 3 | De frente | `2ºB-Biblioteca-Juana Pérez-3.png` |
| 4 | De costado | `2ºB-Biblioteca-Juana Pérez-4.png` |
| — | Maqueta 360° | `2ºB-Biblioteca-Juana Pérez-maqueta.json` |

### El archivo de la maqueta 360°

El `.json` no es una foto: es la "receta" de la maqueta. Guarda cada cuerpo con su tipo, posición, giro, tamaño, color, textura y nombre. También incluye el grado, el alumno, el lugar, la fecha y una miniatura chica para la galería. El visor usa esa receta para volver a armar la maqueta en 3D exactamente como estaba, así que se puede mirar desde cualquier lado. Pesa pocos KB, mucho menos que una imagen.

Si un alumno vuelve a guardar la misma maqueta con el mismo nombre, grado y lugar, el `.json` nuevo **reemplaza** al anterior; el viejo va a la papelera de Drive. Así la galería muestra siempre la última versión. Las PNG, en cambio, se acumulan.

Si una imagen no se puede guardar (por ejemplo, porque se cortó internet), la app lo muestra y ofrece "Probar otra vez". Al reintentar, solo vuelve a enviar las que faltaron. El nombre y el grado se recuerdan mientras la página esté abierta, así el alumno no tiene que volver a escribirlos.

Si un alumno guarda dos veces la misma maqueta, Drive guarda las dos copias con el mismo nombre; no se borra nada.

### Por qué hace falta un paso extra

Una página publicada en GitHub Pages no puede escribir sola en una carpeta de Drive: Google exige permiso de una cuenta con acceso a esa carpeta. La solución es un pequeño programa de **Google Apps Script** que funciona con la cuenta de la docente. La app le manda los archivos y el script los guarda en la carpeta. El mismo script le entrega al visor la lista de maquetas y cada maqueta. Los alumnos y las familias no necesitan iniciar sesión con Google.

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

Si más adelante cambiás el código del script, usá **Implementar → Gestionar implementaciones → ✏️ Editar → Versión: Nueva versión → Implementar**. Así la URL sigue siendo la misma. **Si ya habías publicado la versión anterior del script (la que solo guardaba imágenes), tenés que hacer esto** para que funcionen la maqueta 360° y "Ver maquetas".

La primera vez que se usa "Ver maquetas", Google puede pedir una autorización nueva, porque ahora el script también lee archivos. Para darla, abrí el script, ejecutá la función `listarMaquetas` con el botón ▶ y aceptá.

Mientras `URL_GUARDADO` esté vacía, la app avisa: "El guardado en Drive todavía no está preparado. Avisale a tu docente".

### Privacidad

Como las familias usan "Ver maquetas", **cualquier persona que tenga el enlace de la app puede ver las maquetas guardadas**, con el nombre, el grado y el lugar de cada alumno. Recomendaciones:

- Que los alumnos escriban solo su **nombre**, o su nombre y la inicial del apellido ("Juana P."). Nunca el apellido completo.
- Avisar a las familias al compartir el enlace.
- Para sacar una maqueta de la galería, borrá su archivo `-maqueta.json` de la carpeta de Drive.

La carpeta de Drive **no necesita ser pública**: el script lee solo los archivos `-maqueta.json` de esa carpeta y no puede entregar ningún otro archivo de tu Drive. Tampoco permite borrar nada desde la app.

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
- **`OBJETOS_ASOCIAR`**: los objetos de la actividad Asociar. Cada uno tiene emoji, nombre, artículo y cuerpo. Por ejemplo, para agregar una vela:
  ```js
  { emoji: '🕯️', nombre: 'vela', art: 'la', cuerpo: 'cilindro' }
  ```
  La pirámide tiene un solo objeto (⛺ carpa), porque casi no hay emojis con esa forma.
- **`NOMBRES_ACEPTADOS`**: las respuestas válidas de "Escribir el nombre". Se escriben en minúscula y sin tilde.
- **`ESPACIO_LIBRE`**: el lugar donde se construyen los desafíos.
- **`URL_GUARDADO`**: la dirección del script de Google que guarda en Drive.
- **`GRADOS`**: las divisiones que aparecen al guardar. Si hace falta, se agrega una, por ejemplo `'2ºC'`.
- **`VISTAS_A_GUARDAR`**: el orden de las vistas, que define los números 1 a 4 del nombre del archivo.
- **`GRADOS`** también define los botones de filtro de la galería.

La carpeta de destino se cambia en `guardar-en-drive.gs`, en la línea `CARPETA_ID`. Después hay que publicar una nueva versión del script.

Los colores generales de la interfaz están en las variables de `:root`, al principio de `styles.css`.



