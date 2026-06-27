# Fichero 01: Playground e Interacción de Consola

Este documento detalla la implementación paso a paso de las características del Playground interactivo (Ideas 1 a 5).

---

## Idea 1: Historial de Comandos en Terminal Simulada (↑ / ↓)
Permite al usuario presionar las flechas arriba y abajo en el input del terminal para recordar y rellenar comandos anteriores.

### Implementación en `public/app.js`
1. Añadir variables de estado en `state`:
   ```javascript
   state.terminalHistory = []; // Comandos planos ingresados
   state.historyIdx = -1;      // Índice actual del historial visitado
   ```
2. Escuchar el evento `keydown` en `#terminal-input` dentro de `loadLesson()`:
   ```javascript
   const input = $('#terminal-input');
   input.addEventListener('keydown', e => {
     if (e.key === 'ArrowUp') {
       e.preventDefault();
       if (state.terminalHistory.length === 0) return;
       if (state.historyIdx === -1) state.historyIdx = state.terminalHistory.length;
       if (state.historyIdx > 0) {
         state.historyIdx--;
         input.value = state.terminalHistory[state.historyIdx];
       }
     } else if (e.key === 'ArrowDown') {
       e.preventDefault();
       if (state.historyIdx !== -1 && state.historyIdx < state.terminalHistory.length - 1) {
         state.historyIdx++;
         input.value = state.terminalHistory[state.historyIdx];
       } else {
         state.historyIdx = -1;
         input.value = '';
       }
     }
   });
   ```
3. Guardar el comando en `handleTerminalSubmit`:
   ```javascript
   state.terminalHistory.push(rawCmd);
   state.historyIdx = -1; // Resetear índice al enviar
   ```

---

## Idea 2: Autocompletado Inteligente con Tabulador (Tab)
Permite sugerir y autocompletar comandos al presionar `Tab`.

### Implementación en `public/app.js`
1. Escuchar la tecla `Tab` en `#terminal-input` para prevenir el comportamiento nativo e inyectar el comando sugerido:
   ```javascript
   input.addEventListener('keydown', e => {
     if (e.key === 'Tab') {
       e.preventDefault();
       const val = input.value.trim().toLowerCase();
       const commands = ['help', 'clear', 'touch', 'ls', 'git init', 'git status', 'git add', 'git commit', 'git branch', 'git checkout'];
       const match = commands.find(c => c.startsWith(val));
       if (match) {
         input.value = match;
       }
     }
   });
   ```

---

## Idea 3: Visualizador Interactivo de Git Graph
Muestra gráficamente las ramas y commits creados.

### Maquetado en `public/index.html`
Insertar un contenedor flotante `#git-graph-canvas` en el panel izquierdo de la terminal:
```html
<div class="git-graph-container">
  <div id="git-graph-canvas"></div>
</div>
```

### Estilos en `public/style.css`
```css
.git-graph-container {
  background: #181d2c;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 12px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  align-items: center;
}
.git-node {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.git-node::after {
  content: '';
  position: absolute;
  left: 24px;
  top: 11px;
  width: 16px;
  height: 2px;
  background: rgba(255,255,255,0.15);
}
.git-node:last-child::after {
  display: none;
}
```

### Lógica de Pintado en `public/app.js`
Añadir una función `renderGitGraph()` que itere sobre `state.git.commits` y dibuje pequeños círculos conectados con líneas horizontales, destacando en cuál rama está situado cada commit.

---

## Idea 4: Topología Animada e Interactiva para Ansible
Muestra los servidores de destino en un rack de datos virtual.

### Maquetado del Workspace en `public/app.js`
Para lecciones de Ansible, renderizar al lado del editor una vista de "Servidores":
```javascript
// En loadLesson para Ansible/AAP:
workspace.innerHTML += `
  <div class="ansible-rack" id="ansible-rack">
    <!-- Nodos del host cargados dinámicamente -->
  </div>
`;
```

### Estilos en `public/style.css`
```css
.ansible-rack {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #0d1117;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.server-node {
  flex: 1;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: var(--transition);
}
.server-node.active {
  border-color: var(--green);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}
.server-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #30363d;
  margin: 0 auto 8px;
}
.server-node.active .server-led {
  background: var(--green);
  animation: pulse 1.5s infinite;
}
```

---

## Idea 5: Inspector de Variables en Vivo (Python/PHP)
Muestra un desglose en tiempo real de las variables asignadas por el usuario.

### Lógica de Extracción en `public/app.js`
Añadir al validador de código un parser regex para capturar asignaciones de variables simples (ej. `x = 10` o `$y = "PLA"`):
```javascript
function inspectVariables(code, isPython) {
  const vars = {};
  const regex = isPython 
    ? /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/gm 
    : /^\$([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*);$/gm;
  
  let match;
  while ((match = regex.exec(code)) !== null) {
    vars[match[1]] = match[2].trim();
  }
  return vars;
}
```
Pintar el desglose de variables extraído en un div `#var-inspector` debajo de la consola de ejecución.
