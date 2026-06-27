# Fichero 02: Animaciones y Efectos Visuales

Este documento detalla la implementación de las animaciones y micro-interacciones visuales (Ideas 6 a 10) para recrear un entorno dinámico y responsivo.

---

## Idea 6: Efecto de Escritura (Typewriter) en Consola
Hace que las respuestas automáticas de la consola y la teoría inicial se revelen carácter a carácter con velocidad parametrizable.

### Implementación en `public/app.js`
Reemplazar la inserción directa de texto en la consola por una función asíncrona de revelado gradual:
```javascript
async function typePrint(element, text, delayMs = 15) {
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await new Promise(r => setTimeout(r, delayMs));
  }
}
```

---

## Idea 7: Flujo Visual de Partículas Luminosas al Ejecutar Código
Simula la transferencia de datos entre el editor y la consola al pulsar "Run Code".

### Estilos en `public/style.css`
Crear un canvas superpuesto `#editor-particles` e introducir la animación por fotogramas:
```css
#editor-particles {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 10;
}
```

### Lógica de Animación en `public/app.js`
Al pulsar "Run Code", instanciar un pequeño bucle de renderizado en canvas para dibujar círculos de color terracota/verde que se muevan hacia la base de la pantalla y se desvanezcan:
```javascript
function triggerRunnerParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'editor-particles';
  $('.editor-body').appendChild(canvas);
  const ctx = canvas.getContext('2d');
  // ... inicializar partículas flotantes con velocidades dx, dy
  // ... ejecutar requestAnimationFrame durante 800ms pintando destellos
}
```

---

## Idea 8: Animaciones al Crear Archivos (`touch`)
Añade un efecto de escala y resplandor al nuevo archivo creado en el explorador.

### Estilos en `public/style.css`
Añadir animaciones clave para nuevos archivos detectados en la barra:
```css
@keyframes fileBlink {
  0% { transform: scale(0.7); background: var(--primary-soft); box-shadow: 0 0 10px var(--primary); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); background: rgba(255,255,255,0.03); box-shadow: none; }
}

.file-tab.new-file {
  animation: fileBlink 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
```

### Lógica en `public/app.js`
Al ejecutar `touch <archivo>`, marcar ese archivo con la clase `.new-file` temporalmente:
```javascript
// ... al crear el nodo HTML del archivo en renderExplorerTree:
if (filename === state.lastCreatedFile) {
  tab.classList.add('new-file');
}
```

---

## Idea 9: Teclado Mecánico en Pantalla (Keycaps)
Muestra visualmente los atajos de teclado o las pulsaciones críticas.

### Maquetado e Implementación
Cuando el usuario interactúa en la consola y pulsa `Enter` o ejecuta un comando exitosamente, mostrar flotando en la esquina inferior izquierda la tecla pulsada:
```css
.keycap-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-bottom: 4px solid var(--border);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
  box-shadow: var(--shadow);
  animation: press 0.3s ease-out;
}

@keyframes press {
  0% { transform: translateY(0); border-bottom-width: 4px; }
  50% { transform: translateY(3px); border-bottom-width: 1px; }
  100% { transform: translateY(0); border-bottom-width: 4px; }
}
```

---

## Idea 10: Lanzamiento de Confeti al Completar Cursos
Genera una celebración visual al superar los tres días de un curso.

### Implementación rápida mediante CDN en `public/index.html`
Insertar la biblioteca ligera `canvas-confetti` en la cabecera:
```html
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
```

### Disparo en `public/app.js`
En la función `completeDay` si el día es el final del curso (`dayNum === 3`):
```javascript
if (dayNum === 3 && typeof confetti === 'function') {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}
```
