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

No usa servidor, base de datos ni frameworks. La parte 3D usa **Three.js (versión 0.147)** cargado desde un CDN, y las tipografías vienen de Google Fonts.

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
7. **Mostrar mi maqueta:** muestra el nombre del lugar, cuántos cuerpos se usaron y de qué tipos, para qué se usó cada uno y las cuatro vistas. Hay dos botones de descarga: uno baja la vista elegida y el otro baja **una sola imagen con las 4 vistas**. Cada imagen incluye un título.

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

## Sobre guardar el trabajo

Por decisión del proyecto, la maqueta **no se guarda** en la computadora. El trabajo se conserva **descargando las imágenes** desde "Mostrar mi maqueta". Si se cierra o se recarga la página, se empieza de nuevo. Antes de borrar la maqueta con "Nuevo proyecto", la app pide confirmación y recuerda descargar la imagen.

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
- [x] Se descargan imágenes de una vista o de las 4 vistas juntas.
- [x] No depende de ningún servidor propio.
