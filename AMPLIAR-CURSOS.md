# Guía para ampliar el contenido de los cursos

Documento de continuación para llenar los cursos de **dev-codigo** con más temas
y niveles. Pensado para que cualquier agente (o tú) pueda retomarlo sin contexto previo.

---

## 1. Estado actual

| Curso | id | Temas | Tipo de lección | Niveles |
|---|---|---|---|---|
| Fundamentos de Git | `git` | 6 | `terminal` | principiante (3) + intermedio (3) ✓ |
| Ansible para Automatización | `ansible` | 3 | `code` | solo principiante |
| Ansible Automation Platform | `aap` | 3 | `code` | solo principiante |
| Programación en PHP | `php` | 3 | `code` | solo principiante |
| Programación en Python | `python` | 8 | `code` | principiante (5) + intermedio (3) ✓ |

**Objetivo:** llevar cada curso a ~6-8 temas por nivel (principiante + intermedio).
**Hechos como plantilla:** Git (lecciones `terminal`) y Python (lecciones `code`).
**Pendientes:** ampliar `ansible`, `aap`, `php` (añadir intermedio + más temas) y,
si se quiere, subir `git` y `python` a más temas.

---

## 2. Reglas de contenido (IMPORTANTES)

- **NADA de contenido de pago.** No copiar de Laracasts ni RealPython (de suscripción).
- **Autoría original**, redactada a mano (no copiar literal ni de fuentes con
  licencia restrictiva como Pro Git, que es CC BY-NC-SA). Las fuentes se usan como
  **guion del temario**, no para copiar texto. Cita la fuente si procede.
- **Scraping:** `agent-browser` NO está instalado como CLI. Usar **Firecrawl**
  (`POST https://api.firecrawl.dev/v1/scrape`, header `Authorization: Bearer <key>`).
  La key está en `/home/zaswear/projects/Recetario/.env.local` (viene entrecomillada;
  quita las comillas). **Plan gratuito con límite** (~1000 créditos/mes): úsalo solo
  para sacar el índice/estructura de una fuente, no para todo.
- Para temas que dominas (Git, Python), puedes autorar sin Firecrawl y reservar
  créditos para PHP/Ansible.

### Fuentes libres por curso

| Curso | Fuentes recomendadas |
|---|---|
| `git` | https://git-scm.com/book/es/v2 (Pro Git ES), https://learn.github.com/skills |
| `php` | https://phptherightway.com/ |
| `python` | https://docs.python.org/3/tutorial/ , https://automatetheboringstuff.com/ |
| `ansible` / `aap` | docs oficiales de Ansible, https://github.com/ansible/workshops , https://galaxy.ansible.com/ui/ |

---

## 3. Modelo de datos — `public/courses.js`

Exporta `export const COURSES = { git, ansible, aap, php, python }`. Cada curso tiene
`id, color, icon (SVG inline), title{es,en}, desc{es,en}, days[]`.

Cada **día/tema** es un objeto:

```js
{
  day: 4,                       // numeración CONTINUA dentro del curso (no reinicia por nivel)
  level: 'intermedio',          // 'principiante' (por defecto si se omite) | 'intermedio'
  title: { es: 'Día 4: Diccionarios', en: 'Day 4: Dictionaries' },
  concept: { es: `markdown…`, en: `markdown…` },   // template literal; escapa backticks como \` y usa \`\`\`lang para bloques
  practice: { es: 'instrucción…', en: 'instruction…' },  // string normal; los backticks de markdown van literales
  type: 'code',                 // 'code' (editor) | 'terminal' (simulador de shell/git)
  goal: 'python-dict',          // identificador único del objetivo
  initialCode: `# …\n`          // SOLO lecciones 'code'
  // initialState: { fs:{…}, git:{…} }   // SOLO lecciones 'terminal'
}
```

> El título se muestra como **tema** quitando el prefijo "Día N:" (`topicTitle()` en app.js).
> Puedes nombrarlos "Día N: …" por consistencia; la UI lo recorta.

---

## 4. Añadir un tema de tipo `code` (Ansible, AAP, PHP, Python)

1. **Contenido:** añade el objeto-día al array `days` del curso en `public/courses.js`
   (con `level` si es intermedio). Usa `type: 'code'`, un `goal` único e `initialCode`.
2. **Validador:** en `public/app.js`, función **`handleCodeRun()`**. Busca la rama del
   curso (`if (courseId === 'php')`, `else if (courseId === 'python')`, etc.) y añade un
   bloque `else if (day === N) { … }` que comprueba el código del usuario con
   `code.includes('…')`, fija `success = true` y una `output` simulada creíble. Ejemplo real:

```js
else if (day === 4) {
  const hasDict = code.includes('pieza') && code.includes('Soporte') && code.includes('30');
  const hasAccess = code.includes("pieza['") || code.includes('pieza["');
  const hasPrint = code.includes('print') && code.includes('30g');
  if (hasDict && hasAccess && hasPrint) {
    success = true;
    output = 'Soporte (PLA) pesa 30g\n\n[Python Process Completed]';
  } else {
    output = 'Error:\nCrea el diccionario "pieza"…';
  }
}
```

> Mantén los `code.includes` **deterministas** (que la práctica solo tenga una solución
> esperada) y la `output` realista. El `else` da el mensaje de error de ayuda.

---

## 5. Añadir un tema de tipo `terminal` (Git)

Más trabajo: cada comando nuevo necesita soporte en el simulador.

1. **Contenido:** objeto-día con `type: 'terminal'`, `goal` único e `initialState`
   (`fs` = archivos, `git` = estado: `{ initialized, staged[], commits[], branch, … }`).
2. **Motor:** en `public/app.js`, **`handleTerminalSubmit()`** procesa los comandos
   (`git init/status/add/commit/branch/checkout/log/diff/merge/remote/push`, `touch`, `ls`…).
   Si tu lección usa un comando nuevo, añádelo aquí (modifica `state.git` / `state.fs`).
3. **Validador:** en **`checkTerminalLessonCompletion()`**, añade un `else if (day === N)`
   que comprueba el estado resultante (`state.git.*`, `state.fs[...]`) y llama a
   `completeDay(courseId, day)`.

---

## 6. Sistema de niveles

- `level: 'principiante' | 'intermedio'` por día (sin campo = principiante).
- El **sidebar** (`renderSidebar()` en app.js) muestra los temas del nivel activo y un
  **toggle** principiante/intermedio (aparece solo si el curso tiene ambos niveles).
- Numeración de `day` **continua** (1,2,3 principiante → 4,5,6 intermedio…). El progreso
  se guarda por número de día en `localStorage` (`dc-progress`).
- No hay bloqueos: todos los temas son accesibles libremente.

---

## 7. Esquema sugerido de temas (para llegar a ~8/nivel)

- **PHP** (phptherightway): *Principiante* — sintaxis y variables · arrays · funciones ·
  bucles/condicionales · cadenas. *Intermedio* — clases y POO · manejo de errores
  (try/catch) · superglobales y formularios · PDO/bases de datos · Composer.
- **Python** (ya 8): *Intermedio pendiente* — módulos e imports · ficheros (with open) ·
  generadores · decoradores.
- **Ansible**: *Principiante* — inventarios · primer playbook · módulos · variables ·
  handlers. *Intermedio* — roles · templates (Jinja2) · loops y condicionales · vault ·
  galaxy/collections.
- **AAP**: *Principiante* — qué es AAP/Controller · proyectos · inventarios · job templates ·
  credenciales. *Intermedio* — workflows · surveys · RBAC · schedules · ejecución a escala.

---

## 8. Verificación y despliegue

```bash
cd ~/projects/dev-codigo
node --check public/app.js && node --check public/courses.js     # sintaxis
node --input-type=module -e "import {COURSES} from './public/courses.js'; \
  console.log(Object.fromEntries(Object.entries(COURSES).map(([k,c])=>[k,c.days.length])))"  # nº de temas
npx vercel dev        # probar en http://localhost:3000 (Run en cada lección)
```

Commit + push a `main`: **Vercel despliega solo** (proyecto git-conectado). La web está
en producción, así que verifica que el motor no se rompe antes de pushear.

---

## 9. Gotchas

- `public/courses.js`: el **último curso es `python`**; al añadir días, inserta antes del
  `]` que cierra `days` de cada curso.
- Las cadenas `concept` son **template literals**: escapa los backticks internos (`` \` ``)
  y usa `\n` para saltos de línea.
- Cada lección interactiva **necesita su validador** (en `handleCodeRun` o
  `checkTerminalLessonCompletion`); sin él, el tema nunca se marca como completado.
- La web es **solo escritorio** (hay un gate `<820px`); el simulador necesita teclado.
- Tras un refactor de IA reciente: navegación **por temas** en el sidebar, sin "días"
  visibles ni bloqueos.

---

*Última actualización: tras añadir Git intermedio (terminal) y ampliar Python a 8 temas (code).*
