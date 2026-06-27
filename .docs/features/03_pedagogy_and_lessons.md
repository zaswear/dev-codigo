# Fichero 03: Pedagogía y Estructura de Lecciones

Este documento describe la ampliación del currículum, guías y modos de aprendizaje alternativos (Ideas 11 a 15) para hacer el curso más completo.

---

## Idea 11: Puzzles de Depuración (Modo "Destruye el Código")
En lugar de escribir código desde cero, el usuario se enfrenta a un script roto con errores y su meta es arreglarlo.

### Estructura de Datos en `public/courses.js`
Añadir lecciones con tipo `'debug'` en el JSON de cursos:
```javascript
{
  day: 2,
  title: { es: 'Día 2: Reparación de Bucles', en: 'Day 2: Loop Repair' },
  type: 'code',
  initialCode: `for i in range(10)\nprint(i)\n# Falta indentación y los dos puntos\n`,
  goal: 'python-debug-loops',
  practice: {
    es: 'Este script de Python falla porque le faltan dos puntos ":" y sangría en el bloque. Arrégla los dos fallos y ejecútalo.',
    en: 'This Python script fails due to missing colon ":" and indentation. Fix both errors and run it.'
  }
}
```

---

## Idea 12: Cuestionarios Interactivos Iniciales (Test de Entrada)
Un pequeño test de 1 pregunta de opción múltiple al seleccionar un día antes de habilitar el terminal/editor.

### Estructura en `public/courses.js`
Añadir la propiedad opcional `quiz` a cada lección:
```javascript
quiz: {
  question: { es: '¿Qué comando inicializa un repositorio de Git?', en: 'Which command initializes a Git repository?' },
  options: ['git init', 'git start', 'git create'],
  answerIdx: 0
}
```

### Renderizado en `public/app.js`
Si la lección tiene un `quiz`, bloquear el área del workspace pintando un formulario de test. Al seleccionar la opción correcta con una animación verde de check, revelar el workspace real.

---

## Idea 13: Desplegable Lateral de Referencia Rápida (Cheat Sheet)
Un cajón flotante que se despliega desde el lateral derecho ofreciendo sintaxis de referencia.

### Maquetado en `public/index.html`
```html
<div class="cheat-sheet-drawer" id="cheat-sheet">
  <button class="close-btn" id="close-cheat-sheet">×</button>
  <h3>Guía Rápida de Sintaxis</h3>
  <div id="cheat-sheet-content"></div>
</div>
```

### Estilos en `public/style.css`
```css
.cheat-sheet-drawer {
  position: fixed;
  top: 64px; right: -320px;
  width: 320px; height: calc(100vh - 64px);
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 24px;
  z-index: 150;
}
.cheat-sheet-drawer.open {
  right: 0;
}
```

---

## Idea 14: Guía de Bienvenida Interactiva (Tour Guide)
Un sutil resaltado con globos flotantes para explicar las partes de la interfaz la primera vez que se carga un curso.

### Implementación en `public/app.js`
1. Guardar en `localStorage` si el tour ya fue visto (`dc-tour-seen`).
2. Si no ha sido visto, añadir un overlay y encuadrar consecutivamente los elementos `#sidebar`, `.days-nav`, `.theory-panel` e `.interactive-panel` explicando su función y añadiendo un botón "Siguiente".

---

## Idea 15: Sección Libre para Experimentación (Sandbox Mode)
Permite usar los terminales y editores de forma libre sin objetivos obligatorios de fase.

### Maquetado en `public/index.html`
Añadir una tarjeta especial de "Sandbox Libre" en el menú de bienvenida:
```html
<div class="course-card sandbox" id="sandbox-card">
  <div class="course-card-header">
    <div class="course-card-icon" style="background:#52525b">
      <i class="ph ph-terminal-window"></i>
    </div>
    <h3 class="course-card-title">Sandbox Libre / Sandbox Mode</h3>
  </div>
  <p class="course-card-desc">Experimenta con terminales interactivos de Git o editores de PHP/Python sin restricciones ni metas de días.</p>
</div>
```
Al hacer clic, inicializar un entorno donde no hay botón de validación de metas, sino un selector para elegir qué consola o lenguaje quieres usar.
