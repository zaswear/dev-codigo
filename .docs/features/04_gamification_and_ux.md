# Fichero 04: Gamificación y Experiencia de Usuario

Este documento detalla la lógica de gamificación, la gestión de racha de estudio, el cambio de tema y las integraciones avanzadas con base de datos (Ideas 16 a 20).

---

## Idea 16: Estantería de Logros y Desbloqueo de Medallas
Muestra las insignias conseguidas por el usuario en base a su progreso completado.

### Maquetado en `public/index.html`
Añadir una sección `#achievements-shelf` en la pestaña de bienvenida:
```html
<div class="achievements-shelf">
  <h4>Tus Logros Desbloqueados</h4>
  <div class="achievements-grid" id="achievements-grid"></div>
</div>
```

### Lógica de Control en `public/app.js`
1. Definir los logros por reglas (ej. completar curso `git` da la medalla `git-master`).
2. Pintar en escala de grises (`filter: grayscale(1)`) los no conseguidos y a color con resplandor dorado los completados.

---

## Idea 17: Seguimiento e Indicador de Racha de Estudio (Daily Streaks)
Calcula el número de días consecutivos que el usuario ha realizado prácticas.

### Modificación de Base de Datos (`scripts/schema.sql`)
Añadir campos en la tabla `users` para guardar la fecha del último ejercicio completado y la racha actual:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
```

### Lógica en `api/progress.js` (POST)
Al guardar un día completado, comprobar la diferencia en días entre `now()` y `last_active_at`:
- Si la diferencia es exactamente 1 día, incrementar `streak_count`.
- Si es superior a 1 día, reiniciar `streak_count` a 1.
- Si es del mismo día, mantener la racha.
Retornar la racha en la respuesta JSON para pintarla en la barra superior.

---

## Idea 18: Selector de Tema Claro/Oscuro con Transición Wipe
Un tema oscuro y claro elegante con una animación que cubre la pantalla circularmente desde la posición del interruptor.

### Animación Wipe en `public/style.css`
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
```

### Lógica en `public/app.js`
Usar la API moderna de transiciones de vista de documento (`document.startViewTransition`):
```javascript
function toggleTheme(e) {
  const isDark = document.documentElement.classList.toggle('dark-theme');
  localStorage.setItem('dc-theme', isDark ? 'dark' : 'light');
  
  if (!document.startViewTransition) return;
  
  // Wipe de transición radial desde el click
  const x = e.clientX;
  const y = e.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  
  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
    { duration: 400, easing: 'ease-in', pseudoElement: '::view-transition-new(root)' }
  );
}
```

---

## Idea 19: Feedback de Error con Efecto Giro 3D (Card Flip)
Cuando falla la ejecución del código, la tarjeta de "Práctica" gira sobre sí misma mostrando pistas en su reverso.

### Estilos en `public/style.css`
```css
.card-flip-container {
  perspective: 1000px;
}
.card-flipper {
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.2);
  transform-style: preserve-3d;
  position: relative;
}
.card-flipper.flipped {
  transform: rotateY(180deg);
}
.practice-front, .practice-back {
  backface-visibility: hidden;
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}
.practice-back {
  transform: rotateY(180deg);
  background: var(--primary-soft);
  border-color: var(--primary);
}
```

---

## Idea 20: Guardado Automático de Borradores de Código (Neon Auto-Save)
Guarda automáticamente el borrador actual en Neon para que el usuario no pierda lo escrito al recargar o cambiar de lección.

### Base de Datos (`scripts/schema.sql`)
```sql
CREATE TABLE IF NOT EXISTS code_drafts (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL,
    day_num INT NOT NULL,
    code TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, course_id, day_num)
);
```

### Lógica de Guardado (Debounced) en `public/app.js`
Escuchar el evento `input` en el textarea del editor, aplicando un debounce de 2 segundos para no sobrecargar el backend de Neon con llamadas consecutivas:
```javascript
let autoSaveT;
textarea.addEventListener('input', () => {
  clearTimeout(autoSaveT);
  autoSaveT = setTimeout(async () => {
    if (!state.jwt) return;
    await api('/api/drafts', {
      method: 'POST',
      body: JSON.stringify({
        course_id: state.currentCourse.id,
        day_num: state.currentDay,
        code: textarea.value
      })
    });
  }, 2000);
});
```
Al cargar un día, rellenar el textarea recuperando el borrador desde `/api/drafts` o `localStorage`.
