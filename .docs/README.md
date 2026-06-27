# dev-codigo · Plan de Implementación de Características Premium

Este directorio contiene las especificaciones técnicas y guías de desarrollo paso a paso para implementar las 20 ideas interactivas, visuales y pedagógicas aprobadas para la plataforma **dev-codigo**.

Para evitar sobrecargar los límites de tokens en una sola sesión, la implementación se realizará de forma incremental (una a una) siguiendo estas especificaciones.

---

## Índice de Características por Ficheros

### 1. [ Playground e Interacción de Consola ](file:///home/zaswear/projects/dev-codigo/.docs/features/01_interactive_playground.md)
- **Idea 1** [x]: Historial de comandos en terminal simulada (Flechas ↑ / ↓).
- **Idea 2** [x]: Autocompletado inteligente con tabulador (Tab).
- **Idea 3** [x]: Visualizador interactivo de Git Graph.
- **Idea 4** [x]: Topología animada e interactiva para Ansible.
- **Idea 5** [x]: Inspector de variables en vivo para Python y PHP.

### 2. [ Animaciones y Efectos Visuales ](file:///home/zaswear/projects/dev-codigo/.docs/features/02_animations_and_effects.md)
- **Idea 6**: Efecto de escritura interactiva (Typewriter) en descripciones de consola.
- **Idea 7**: Flujo visual de partículas luminosas al ejecutar código.
- **Idea 8**: Animaciones de escala e iluminación al crear archivos (`touch`).
- **Idea 9**: Simulación visual de teclado mecánico hundido (Keycaps).
- **Idea 10**: Lanzamiento de confeti vectorial al completar cursos.

### 3. [ Pedagogía y Estructura de Lecciones ](file:///home/zaswear/projects/dev-codigo/.docs/features/03_pedagogy_and_lessons.md)
- **Idea 11**: Puzzles de depuración (Modo "Destruye el Código").
- **Idea 12**: Cuestionarios interactivos iniciales (Test de Entrada).
- **Idea 13**: Desplegable lateral de referencia rápida (Cheat Sheet).
- **Idea 14**: Guía de bienvenida interactiva (Tour Guide animado).
- **Idea 15**: Sección libre para experimentación (Sandbox Mode).

### 4. [ Gamificación y Experiencia de Usuario ](file:///home/zaswear/projects/dev-codigo/.docs/features/04_gamification_and_ux.md)
- **Idea 16**: Estantería de logros y desbloqueo de medallas grabadas.
- **Idea 17**: Seguimiento e indicador de racha de estudio (Daily Streaks).
- **Idea 18**: Selector de tema Claro/Oscuro con transición wipe circular.
- **Idea 19**: Feedback visual de error con efecto giro 3D (Card Flip).
- **Idea 20**: Guardado automático de borradores de código en Neon.

---

## Flujo de Trabajo Sugerido
1. Elige una característica del índice.
2. Abre su correspondiente documento en `.docs/features/`.
3. Aplica los cambios propuestos en `public/app.js`, `public/style.css` u endpoints de `/api/`.
4. Verifica en local en [http://localhost:4000](http://localhost:4000).
5. Marca la característica como completada (`[x]`) en este índice.
