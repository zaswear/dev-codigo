// dev-codigo — Frontend Lógica y Simuladores Interactivos
'use strict';

import { COURSES, CHEATSHEETS } from './courses.js';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Traducciones de la Interfaz
const STRINGS = {
  es: {
    welcome: 'Aprende Código Fácil',
    tagline: 'Cursos interactivos de GIT, Ansible, PHP y Python estructurados por días. Prácticas en tiempo real en tu navegador.',
    syncBanner: '¡Progreso local detectado! Inicia sesión para sincronizarlo en la nube.',
    startBtn: 'Comenzar Curso',
    day: 'Día',
    completed: 'Completado ✓',
    nextDayBtn: 'Continuar al siguiente tema',
    runBtn: 'Ejecutar',
    runBtnDesc: 'Comprobar solución',
    codeOutput: 'Consola de salida',
    explorerTitle: 'Espacio de Trabajo (Archivos)',
    daysLeft: 'días restantes',
    courseDone: '¡Curso completado!',
    signInGithub: 'Entrar con GitHub',
    syncSuccess: 'Progreso sincronizado',
    modalTitle: '¡Tema completado!',
    modalDesc: 'Has asimilado el concepto y superado la práctica de este tema con éxito.',
    modalBtn: 'Siguiente tema',
    backToCatalog: '← Volver al catálogo',
    terminalHelp: 'Escribe "help" para ver los comandos disponibles.',
    emptyTerminal: 'Consola inicializada.',
    unlockedMsg: 'Nueva lección disponible',
    skipBtn: 'Omitir',
    tourBtn: 'Tour Guide',
    levelBeginner: 'Principiante',
    levelIntermediate: 'Intermedio'
  },
  en: {
    welcome: 'Learn Coding Easily',
    tagline: 'Interactive Git, Ansible, PHP, and Python courses structured by days. Live practice right in your browser.',
    syncBanner: 'Local progress detected! Sign in to sync it to the cloud.',
    startBtn: 'Start Course',
    day: 'Day',
    completed: 'Completed ✓',
    nextDayBtn: 'Continue to next topic',
    runBtn: 'Run Code',
    runBtnDesc: 'Verify solution',
    codeOutput: 'Console Output',
    explorerTitle: 'Workspace (Files)',
    daysLeft: 'days left',
    courseDone: 'Course completed!',
    signInGithub: 'Sign In with GitHub',
    syncSuccess: 'Progress synchronized',
    modalTitle: 'Topic completed!',
    modalDesc: 'You have mastered the concept and successfully passed this topic\'s practice.',
    modalBtn: 'Next topic',
    backToCatalog: '← Back to Catalog',
    terminalHelp: 'Type "help" to list available commands.',
    emptyTerminal: 'Console initialized.',
    unlockedMsg: 'New lesson unlocked',
    skipBtn: 'Skip',
    tourBtn: 'Tour Guide',
    levelBeginner: 'Beginner',
    levelIntermediate: 'Intermediate'
  }
};

const state = {
  lang: localStorage.getItem('dc-lang') || 'es',
  jwt: localStorage.getItem('dc-jwt') || null,
  user: null,
  progress: JSON.parse(localStorage.getItem('dc-progress') || '{}'), // { git: [1], python: [1, 2] }
  currentCourse: null,
  currentDay: 1,
  currentLevel: 'principiante', // 'principiante' | 'intermedio'
  mode: 'academy',              // 'academy' | 'cheatsheet'
  currentRecipeId: null,

  // Estado del simulador de Terminal (Git / Ansible)
  fs: {},
  git: {
    initialized: false,
    staged: [],
    commits: [],
    branch: 'main'
  },
  terminalHistory: [],
  historyIdx: -1
};


/* ── Sincronización y Sesión ──────────────────────────────────────────────── */
function parseUserFromJWT() {
  if (!state.jwt) return;
  try {
    const payload = JSON.parse(atob(state.jwt.split('.')[1]));
    state.user = payload;
  } catch {
    state.jwt = null;
    localStorage.removeItem('dc-jwt');
  }
}

async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (opts.body) headers['Content-Type'] = 'application/json';
  if (state.jwt) headers['Authorization'] = `Bearer ${state.jwt}`;
  const r = await fetch(path, { ...opts, headers });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

async function syncProgress() {
  if (!state.jwt) return;
  try {
    // 1. Enviar progreso local al servidor
    for (const [courseId, days] of Object.entries(state.progress)) {
      await api('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId, completed_days: days })
      });
    }
    // 2. Descargar progreso unificado del servidor
    const res = await api('/api/progress');
    if (res.results) {
      state.progress = { ...state.progress, ...res.results };
      localStorage.setItem('dc-progress', JSON.stringify(state.progress));
    }
  } catch (e) {
    console.error('Error syncing progress:', e);
  }
}

/* ── Guardar Lección Completada ───────────────────────────────────────────── */
async function completeDay(courseId, dayNum) {
  if (!state.progress[courseId]) state.progress[courseId] = [];
  if (!state.progress[courseId].includes(dayNum)) {
    state.progress[courseId].push(dayNum);
    state.progress[courseId].sort((a,b) => a-b);
  }
  
  localStorage.setItem('dc-progress', JSON.stringify(state.progress));
  
  // Guardar en la nube de forma silenciosa si hay sesión
  if (state.jwt) {
    try {
      await api('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId, completed_days: state.progress[courseId] })
      });
    } catch {}
  }
  
  // Mostrar modal de celebración
  const modal = $('#celebration-modal');
  $('.modal-title', modal).textContent = STRINGS[state.lang].modalTitle;
  $('.modal-desc', modal).textContent = STRINGS[state.lang].modalDesc;
  $('.modal-btn', modal).textContent = STRINGS[state.lang].modalBtn;
  modal.classList.add('show');
  
  renderCoursesGrid();
  renderSidebar();
}

/* ── Render del Catálogo Inicial ─────────────────────────────────────────── */
function renderCoursesGrid() {
  const grid = $('#courses-grid');
  if (!grid) return;
  
  const welcomeHero = $('#welcome-hero');
  welcomeHero.innerHTML = `
    <h1 class="welcome-title">${STRINGS[state.lang].welcome}</h1>
    <p class="welcome-subtitle">${STRINGS[state.lang].tagline}</p>
  `;
  
  grid.innerHTML = Object.values(COURSES).map(c => {
    const completedCount = (state.progress[c.id] || []).length;
    const pct = Math.round((completedCount / c.days.length) * 100);
    const badgeColor = c.color;
    
    return `
      <div class="course-card" role="button" tabindex="0" data-id="${c.id}" aria-label="${esc(STRINGS[state.lang].startBtn)}: ${esc(c.title[state.lang])}">
        <div class="course-card-header">
          <div class="course-card-icon" style="background-color: ${badgeColor}">
            ${c.icon}
          </div>
          <h3 class="course-card-title">${esc(c.title[state.lang])}</h3>
        </div>
        <p class="course-card-desc">${esc(c.desc[state.lang])}</p>
        <div class="course-card-footer">
          <span>${completedCount} / ${c.days.length} ${STRINGS[state.lang].completed.toLowerCase()} (${pct}%)</span>
          <span class="course-card-btn">${STRINGS[state.lang].startBtn} →</span>
        </div>
      </div>
    `;
  }).join('');
  
  $$('.course-card', grid).forEach(card => {
    const go = () => selectCourse(card.dataset.id);
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
}

function selectCourse(courseId) {
  state.currentCourse = COURSES[courseId];
  state.mode = 'academy';

  const navModes = $('#nav-modes');
  if (navModes) {
    if (courseId === 'git' || courseId === 'ansible') {
      navModes.style.display = 'flex';
      $('#mode-academy')?.classList.add('active');
      $('#mode-cheatsheet')?.classList.remove('active');
    } else {
      navModes.style.display = 'none';
    }
  }

  // Ir al primer día incompleto o al Día 1
  const completed = state.progress[courseId] || [];
  let dayToStart = 1;
  for (let i = 1; i <= state.currentCourse.days.length; i++) {
    if (!completed.includes(i)) {
      dayToStart = i;
      break;
    }
  }
  state.currentDay = dayToStart;
  
  $('#welcome-view').style.display = 'none';
  $('#course-view').style.display = 'flex';
  
  const tourBtn = $('#btn-start-tour');
  if (tourBtn) tourBtn.style.display = 'flex';
  
  renderSidebar();
  loadLesson(dayToStart);
}

// El sidebar dentro de un curso muestra sus TEMAS (no la lista de cursos).
// Sin bloqueos: cualquier tema es accesible libremente.
function renderSidebar() {
  const sidebar = $('#sidebar');
  if (!sidebar || !state.currentCourse) return;
  const c = state.currentCourse;

  // Si estamos en modo Chuletas / Cheatsheet
  if (state.mode === 'cheatsheet') {
    const cat = CHEATSHEETS[c.id];
    if (!cat) return;

    const recipesHTML = cat.recipes.map(r => {
      const isActive = state.currentRecipeId === r.id;
      const mark = '<i class="ph ph-terminal-window"></i>';
      return `<button class="topic-item ${isActive ? 'active' : ''}" data-recipe-id="${r.id}">
        <span class="topic-status">${mark}</span>
        <span class="topic-name">${esc(r.title[state.lang])}</span>
      </button>`;
    }).join('');

    sidebar.innerHTML = `
      <button class="btn-back" id="btn-back-catalog">
        <i class="ph ph-arrow-left"></i> ${state.lang === 'es' ? 'Catálogo de cursos' : 'Course catalog'}
      </button>
      <div class="sidebar-course">
        <div class="course-icon-wrap">${c.icon}</div>
        <span class="sidebar-course-title">${esc(cat.title[state.lang])}</span>
      </div>
      <div class="topic-list">${recipesHTML}</div>
    `;

    $('#btn-back-catalog', sidebar).addEventListener('click', () => {
      state.currentCourse = null;
      state.mode = 'academy';
      const navModes = $('#nav-modes');
      if (navModes) navModes.style.display = 'none';
      $('#course-view').style.display = 'none';
      $('#welcome-view').style.display = 'block';
      const tourBtn = $('#btn-start-tour');
      if (tourBtn) tourBtn.style.display = 'none';
      renderCoursesGrid();
    });

    $$('.topic-item', sidebar).forEach(item => item.addEventListener('click', () => {
      const recipe = cat.recipes.find(r => r.id === item.dataset.recipeId);
      if (recipe) loadLesson(recipe);
    }));
    return;
  }

  const completed = state.progress[c.id] || [];
  const levels = courseLevels();
  const lvlLabel = {
    principiante: STRINGS[state.lang].levelBeginner,
    intermedio: STRINGS[state.lang].levelIntermediate
  };

  const levelHTML = levels.length > 1 ? `
    <div class="level-toggle" id="level-toggle">
      ${levels.map(l => `<button class="level-btn ${state.currentLevel === l ? 'active' : ''}" data-level="${l}">${lvlLabel[l]}</button>`).join('')}
    </div>` : '';

  const topicsHTML = daysForLevel(state.currentLevel).map(d => {
    const isActive = state.currentDay === d.day && !state.currentRecipeId;
    const isDone = completed.includes(d.day);
    const mark = isDone ? '<i class="ph ph-check-circle"></i>' : '<i class="ph ph-circle"></i>';
    return `<button class="topic-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" data-day="${d.day}">
      <span class="topic-status">${mark}</span>
      <span class="topic-name">${esc(topicTitle(d))}</span>
    </button>`;
  }).join('');

  sidebar.innerHTML = `
    <button class="btn-back" id="btn-back-catalog">
      <i class="ph ph-arrow-left"></i> ${state.lang === 'es' ? 'Catálogo de cursos' : 'Course catalog'}
    </button>
    <div class="sidebar-course">
      <div class="course-icon-wrap">${c.icon}</div>
      <span class="sidebar-course-title">${esc(c.title[state.lang])}</span>
    </div>
    ${levelHTML}
    <div class="topic-list">${topicsHTML}</div>
  `;

  $('#btn-back-catalog', sidebar).addEventListener('click', () => {
    state.currentCourse = null;
    const navModes = $('#nav-modes');
    if (navModes) navModes.style.display = 'none';
    $('#course-view').style.display = 'none';
    $('#welcome-view').style.display = 'block';
    const tourBtn = $('#btn-start-tour');
    if (tourBtn) tourBtn.style.display = 'none';
    renderCoursesGrid();
  });

  $$('.level-btn', sidebar).forEach(btn => btn.addEventListener('click', () => {
    const lvl = btn.dataset.level;
    if (lvl === state.currentLevel) return;
    state.currentLevel = lvl;
    const first = daysForLevel(lvl)[0];
    if (first) loadLesson(first.day);
  }));

  $$('.topic-item', sidebar).forEach(item => item.addEventListener('click', () => {
    loadLesson(parseInt(item.dataset.day, 10));
  }));
}

/* ── Niveles (principiante / intermedio) ───────────────────────────────────── */
// Días sin campo `level` se tratan como 'principiante' (retrocompatible).
function levelOf(day) { return day.level || 'principiante'; }
function courseLevels() {
  const set = new Set((state.currentCourse?.days || []).map(levelOf));
  return ['principiante', 'intermedio'].filter(l => set.has(l));
}
function daysForLevel(level) {
  return (state.currentCourse?.days || []).filter(d => levelOf(d) === level);
}
// Nombre del tema sin el prefijo "Día N:" / "Day N:" (organización por temas).
function topicTitle(day) {
  return (day.title[state.lang] || '').replace(/^(Día|Day)\s*\d+\s*[:.\-–]\s*/i, '');
}

/* Helper para procesar Markdown de forma segura */
function renderMarkdown(text) {
  if (typeof marked === 'undefined') {
    return esc(text)
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/### (.*?)(<br>|$)/g, '<h3>$1</h3>')
      .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>');
  }
  return typeof marked.parse === 'function' ? marked.parse(text) : marked(text);
}

/* Helper para el inspector de variables de Python/PHP */
function updateVariableInspector() {
  const box = $('#variable-inspector');
  const list = $('#inspector-vars-list');
  if (!box || !list) return;
  
  if (!state.currentCourse) {
    box.style.display = 'none';
    return;
  }
  
  const isPython = state.currentCourse.id === 'python';
  const isPhp = state.currentCourse.id === 'php';
  if (!isPython && !isPhp) {
    box.style.display = 'none';
    return;
  }
  
  box.style.display = 'flex';
  const textarea = $('#editor-textarea');
  if (!textarea) return;
  const code = textarea.value;
  
  const vars = {};
  const regex = isPython 
    ? /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^#\n]*)$/gm 
    : /^\$([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;\n]*);/gm;
    
  let match;
  let iterations = 0;
  while ((match = regex.exec(code)) !== null && iterations < 30) {
    iterations++;
    const name = match[1];
    const val = match[2].trim();
    if (/^(def|for|if|import|return|function|echo|while|class)\b/.test(val)) continue;
    vars[name] = val;
  }
  
  const keys = Object.keys(vars);
  if (keys.length === 0) {
    list.innerHTML = `<span style="font-family:var(--font-mono);font-size:11px;color:rgba(255,255,255,0.3)">no variables found</span>`;
    return;
  }
  
  list.innerHTML = keys.map(k => `
    <span class="var-badge">
      <span>${isPhp ? '$' : ''}${esc(k)}</span>
      <span style="color:rgba(255,255,255,0.4)">=</span>
      <span class="var-badge-val">${esc(vars[k])}</span>
    </span>
  `).join('');
}

/* Helper para generar el rack de servidores Ansible */
function getAnsibleRackHtml() {
  const cid = state.currentCourse.id;
  const day = state.currentDay;
  
  if (cid !== 'ansible' && cid !== 'aap') return '';
  
  let servers = [];
  if (cid === 'ansible') {
    if (day === 1) {
      servers = [{ id: 'impresora1', label: 'impresora1 (192.168.1.100)' }];
    } else {
      servers = [
        { id: 'impresora1', label: 'impresora1 (192.168.1.100)' },
        { id: 'impresora2', label: 'impresora2 (192.168.1.101)' }
      ];
    }
  } else if (cid === 'aap') {
    if (day === 1) {
      servers = [
        { id: 'aap-controller', label: 'aap-controller (10.0.10.5)' },
        { id: 'git-server', label: 'git-server (github.com)' }
      ];
    } else if (day === 2) {
      servers = [
        { id: 'aap-controller', label: 'aap-controller (10.0.10.5)' },
        { id: 'impresora1', label: 'impresora1 (192.168.1.100)' },
        { id: 'impresora2', label: 'impresora2 (192.168.1.101)' }
      ];
    } else {
      servers = [
        { id: 'aap-controller', label: 'aap-controller (10.0.10.5)' },
        { id: 'load-balancer', label: 'load-balancer (nginx)' },
        { id: 'impresora1', label: 'impresora1 (192.168.1.100)' }
      ];
    }
  }
  
  return `
    <div class="ansible-rack" id="ansible-rack">
      ` + servers.map(s => `
        <div class="server-node" id="srv-${s.id}">
          <div class="server-led"></div>
          <div class="server-label">${esc(s.label)}</div>
        </div>
      `).join('') + `
    </div>
  `;
}

/* Helper asíncrono para iniciar la guía interactiva (Tour Guide) */
function startTour() {
  const steps = [
    {
      target: '#sidebar',
      title: { es: 'Temas del curso', en: 'Course Topics' },
      desc: {
        es: 'En la barra lateral tienes todos los temas del curso. Puedes explorarlos libremente en el orden que quieras, y cambiar de nivel (principiante/intermedio). Usa «Catálogo de cursos» para volver.',
        en: 'The sidebar lists all the course topics. Explore them freely in any order, and switch level (beginner/intermediate). Use "Course catalog" to go back.'
      }
    },
    {
      target: '.theory-panel',
      title: { es: 'Teoría e Instrucciones', en: 'Theory & Instructions' },
      desc: {
        es: 'Aquí encontrarás los conceptos teóricos clave y la descripción de la práctica que debes completar.',
        en: 'Here you will find key theoretical concepts and the description of the practice you must complete.'
      }
    },
    {
      target: '.interactive-panel',
      title: { es: 'Playground Interactivo', en: 'Interactive Playground' },
      desc: {
        es: 'Escribe el código solicitado o ejecuta comandos de terminal aquí. ¡Usa el botón Ejecutar para validar tu progreso!',
        en: 'Write the requested code or run terminal commands here. Use the Run button to validate your progress!'
      }
    }
  ];
  
  // Quitar overlay antiguo si existe
  const oldOverlay = $('#tour-overlay');
  if (oldOverlay) oldOverlay.remove();
  
  const overlay = document.createElement('div');
  overlay.className = 'tour-overlay';
  overlay.id = 'tour-overlay';
  document.body.appendChild(overlay);
  
  const card = document.createElement('div');
  card.className = 'tour-card';
  overlay.appendChild(card);
  
  let currentStep = 0;
  
  function showStep(idx) {
    $$('.tour-highlighted').forEach(el => el.classList.remove('tour-highlighted'));
    
    if (idx >= steps.length) {
      localStorage.setItem('dc-tour-seen', 'true');
      overlay.remove();
      return;
    }
    
    currentStep = idx;
    const step = steps[idx];
    const targetEl = $(step.target);
    
    if (!targetEl) {
      showStep(idx + 1);
      return;
    }
    
    targetEl.classList.add('tour-highlighted');
    
    card.innerHTML = `
      <div class="tour-header">
        <span>${step.title[state.lang]}</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.4)">${idx + 1} / ${steps.length}</span>
      </div>
      <div class="tour-body">
        ${step.desc[state.lang]}
      </div>
      <div class="tour-actions">
        <button class="tour-btn skip" id="tour-skip-btn">${STRINGS[state.lang].skipBtn}</button>
        <div class="tour-step-dots">
          ${steps.map((_, sIdx) => `<div class="tour-dot ${sIdx === idx ? 'active' : ''}"></div>`).join('')}
        </div>
        <button class="tour-btn" id="tour-next-btn">${idx === steps.length - 1 ? (state.lang === 'es' ? 'Terminar' : 'Finish') : (state.lang === 'es' ? 'Siguiente' : 'Next')}</button>
      </div>
    `;
    
    positionTourCard(targetEl, card);
    
    $('#tour-skip-btn').addEventListener('click', () => {
      localStorage.setItem('dc-tour-seen', 'true');
      $$('.tour-highlighted').forEach(el => el.classList.remove('tour-highlighted'));
      overlay.remove();
    });
    
    $('#tour-next-btn').addEventListener('click', () => {
      showStep(idx + 1);
    });
  }
  
  function positionTourCard(targetEl, cardEl) {
    const rect = targetEl.getBoundingClientRect();
    const cardWidth = 320;
    const cardHeight = cardEl.offsetHeight || 180;
    const gap = 14;
    const vw = window.innerWidth, vh = window.innerHeight;
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    let left, top;
    const spaceBelow = vh - rect.bottom;
    const spaceRight = vw - rect.right;
    const isTall = rect.height > vh * 0.55;

    if (isTall && spaceRight > cardWidth + gap * 2) {
      // Panel alto (p. ej. sidebar): colócala al lado para no taparlo.
      left = rect.right + gap;
      top = clamp(rect.top, 16, vh - cardHeight - 16);
    } else if (spaceBelow > cardHeight + gap) {
      left = rect.left + (rect.width - cardWidth) / 2;
      top = rect.bottom + gap;
    } else {
      // Sin sitio debajo: encima del objetivo.
      left = rect.left + (rect.width - cardWidth) / 2;
      top = rect.top - cardHeight - gap;
    }

    left = clamp(left, 16, vw - cardWidth - 16);
    top = clamp(top, 16, vh - cardHeight - 16);

    cardEl.style.left = `${left}px`;
    cardEl.style.top = `${top}px`;
  }
  
  showStep(0);
}

/* ── Cargar Lección ──────────────────────────────────────────────────────── */
function loadLesson(lessonOrDayNum) {
  let lesson;
  let isCheatsheet = false;

  if (typeof lessonOrDayNum === 'number') {
    state.currentDay = lessonOrDayNum;
    state.currentRecipeId = null;
    lesson = state.currentCourse.days.find(d => d.day === lessonOrDayNum);
    if (lesson) state.currentLevel = levelOf(lesson);
  } else {
    // Es un objeto de receta de chuleta
    lesson = lessonOrDayNum;
    state.currentRecipeId = lesson.id;
    isCheatsheet = true;
  }

  renderSidebar();

  if (!lesson) return;
  
  // Render de cabecera de lección
  $('#lesson-title').textContent = lesson.title[state.lang];
  
  // Render de teoría
  const theoryBox = $('#theory-content');
  const markdownText = lesson.concept[state.lang] || '';
  theoryBox.innerHTML = renderMarkdown(markdownText);
  
  // Render de práctica
  $('#practice-text').textContent = lesson.practice[state.lang];
  
  // Limpiar e inicializar paneles interactivos
  const workspace = $('#workspace-panels');
  
  if (lesson.type === 'terminal') {
    // Configurar simulador de terminal
    workspace.innerHTML = `
      <div class="interactive-panel">
        <div class="workspace-explorer">
          <span class="explorer-title">${STRINGS[state.lang].explorerTitle}</span>
          <div class="explorer-files" id="explorer-files-list"></div>
        </div>
        <div class="git-graph-bar" id="git-graph-bar" style="display: none;">
          <div class="git-graph-nodes" id="git-graph-nodes"></div>
        </div>
        <div class="terminal-window" id="terminal-window">
          <div class="terminal-history" id="terminal-history">
            <div class="terminal-line output">${STRINGS[state.lang].emptyTerminal}</div>
            <div class="terminal-line output">${STRINGS[state.lang].terminalHelp}</div>
          </div>
          <form class="terminal-prompt-row" id="terminal-form">
            <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" autocapitalize="off" spellcheck="false" autofocus aria-label="${state.lang === 'es' ? 'Entrada de comandos del terminal' : 'Terminal command input'}">
          </form>
        </div>
      </div>
    `;
    
    // Inicializar estado del filesystem simulado
    state.fs = { ...(lesson.initialState?.fs || {}) };
    state.git = { ...(lesson.initialState?.git || { initialized: false, staged: [], commits: [], branch: 'main' }) };
    state.terminalHistory = [];
    state.historyIdx = -1;
    
    renderExplorerTree();
    renderGitGraph();
    
    const form = $('#terminal-form');
    form.addEventListener('submit', handleTerminalSubmit);
    
    const input = $('#terminal-input');
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.terminalHistory.length === 0) return;
        if (state.historyIdx === -1) {
          state.historyIdx = state.terminalHistory.length - 1;
        } else if (state.historyIdx > 0) {
          state.historyIdx--;
        }
        input.value = state.terminalHistory[state.historyIdx];
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.historyIdx !== -1) {
          if (state.historyIdx < state.terminalHistory.length - 1) {
            state.historyIdx++;
            input.value = state.terminalHistory[state.historyIdx];
          } else {
            state.historyIdx = -1;
            input.value = '';
          }
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value.trim().toLowerCase();
        if (!val) return;
        const commands = ['help', 'clear', 'touch', 'ls', 'git init', 'git status', 'git add', 'git commit', 'git branch', 'git checkout'];
        const match = commands.find(c => c.startsWith(val));
        if (match) {
          input.value = match;
        }
      }
    });
    
    // Enfocar terminal al hacer clic en el panel
    $('#terminal-window').addEventListener('click', () => {
      $('#terminal-input').focus();
    });
  } else {
    // Configurar editor de código
    const initCode = lesson.initialCode || '';
    const extension = state.currentCourse.id === 'python' ? '.py' : (state.currentCourse.id === 'php' ? '.php' : '.yml');
    const iconClass = state.currentCourse.id === 'python' ? 'ph-file-py' : 'ph-code';
    
    const rackHtml = getAnsibleRackHtml();
    const isCodeLang = state.currentCourse.id === 'python' || state.currentCourse.id === 'php';
    const inspectorHtml = isCodeLang ? `
      <div class="variable-inspector" id="variable-inspector" style="display: none;">
        <span class="inspector-title" style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;margin-right:12px;">Variables:</span>
        <div class="inspector-vars" id="inspector-vars-list"></div>
      </div>
    ` : '';

    workspace.innerHTML = `
      <div class="interactive-panel">
        <div class="editor-window">
          <div class="editor-header">
            <span class="editor-file-title"><i class="ph ${iconClass}"></i> workspace${extension}</span>
            <div class="editor-actions">
              <button class="editor-btn run" id="btn-run-code"><i class="ph ph-play"></i> ${STRINGS[state.lang].runBtn}</button>
            </div>
          </div>
          <div class="editor-body">
            <div class="editor-line-numbers" id="editor-lines">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10</div>
            <textarea class="editor-textarea" id="editor-textarea" spellcheck="false">${esc(initCode)}</textarea>
          </div>
          ${rackHtml}
          ${inspectorHtml}
          <div class="console-output">
            <div class="console-header">${STRINGS[state.lang].codeOutput}</div>
            <div class="console-body" id="console-body">> _</div>
          </div>
        </div>
      </div>
    `;
    
    // Evento de numeración de líneas y actualización de variables
    const textarea = $('#editor-textarea');
    const linesDiv = $('#editor-lines');
    textarea.addEventListener('input', () => {
      const linesCount = textarea.value.split('\n').length;
      linesDiv.innerHTML = Array.from({ length: Math.max(linesCount, 10) }, (_, i) => i + 1).join('<br>');
      updateVariableInspector();
    });
    
    $('#btn-run-code').addEventListener('click', handleCodeRun);
    updateVariableInspector();
  }
  
  // Auto-tour para nuevos usuarios en el día 1 (solo en modo academia)
  if (!isCheatsheet && !localStorage.getItem('dc-tour-seen') && lessonOrDayNum === 1) {
    setTimeout(startTour, 500);
  }

}

/* ── Simulador de Terminal (Git / Ansible Shell) ─────────────────────────── */
function renderGitGraph() {
  const bar = $('#git-graph-bar');
  const container = $('#git-graph-nodes');
  if (!bar || !container) return;
  
  if (!state.git || !state.git.initialized) {
    bar.style.display = 'none';
    return;
  }
  
  bar.style.display = 'flex';
  
  if (!state.git.commits || state.git.commits.length === 0) {
    container.innerHTML = `<span style="font-family:var(--font-mono);font-size:11px;color:rgba(255,255,255,0.4)">no commits yet</span>`;
    return;
  }
  
  container.innerHTML = state.git.commits.map((c, idx) => {
    const isLast = idx === state.git.commits.length - 1;
    const activeCls = isLast ? 'active-branch' : '';
    const branchLabel = isLast ? ` (${state.git.branch})` : '';
    
    const nodeHtml = `
      <div class="git-node ${activeCls}">
        <div class="git-node-dot"></div>
        <span>${esc(c.id)}: ${esc(c.message)}${esc(branchLabel)}</span>
      </div>
    `;
    
    if (idx < state.git.commits.length - 1) {
      return nodeHtml + `<span class="git-node-line"><i class="ph ph-arrow-right"></i></span>`;
    }
    return nodeHtml;
  }).join('');
}

function renderExplorerTree(newFilename = null) {
  const list = $('#explorer-files-list');
  if (!list) return;
  
  const files = Object.keys(state.fs);
  if (!files.length) {
    list.innerHTML = `<span style="font-family:var(--font-mono);font-size:11px;color:rgba(255,255,255,0.3)">carpeta vacía</span>`;
    return;
  }
  
  list.innerHTML = files.map(f => {
    let icon = 'ph-file';
    if (f.endsWith('.html')) icon = 'ph-file-html';
    if (f.endsWith('.css')) icon = 'ph-file-css';
    if (f.endsWith('.yml') || f.endsWith('.yaml')) icon = 'ph-file-code';
    
    const animClass = (newFilename && f === newFilename) ? 'file-created-anim' : '';
    return `<span class="file-tab ${animClass}"><i class="ph ${icon}"></i> ${esc(f)}</span>`;
  }).join('');
}

/* Helper asíncrono para revelar texto letra a letra (Efecto Typewriter) */
function typeText(element, text, speed = 8, onComplete = null, scrollContainer = null) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    } else {
      clearInterval(timer);
      if (onComplete) onComplete();
    }
  }, speed);
}

function printToTerminal(text, type = 'output') {
  const hist = $('#terminal-history');
  if (!hist) return;
  
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  hist.appendChild(line);
  
  const win = $('#terminal-window');
  if (type === 'command') {
    line.textContent = text;
    if (win) win.scrollTop = win.scrollHeight;
    renderGitGraph();
  } else {
    typeText(line, text, 8, () => renderGitGraph(), win);
  }
}

function handleTerminalSubmit(e) {
  e.preventDefault();
  const input = $('#terminal-input');
  const rawCmd = input.value.trim();
  input.value = '';
  
  if (!rawCmd) return;
  
  // Guardar en el historial de comandos
  state.terminalHistory.push(rawCmd);
  state.historyIdx = -1;
  
  // Agregar al historial visual
  printToTerminal(rawCmd, 'command');
  
  // Ejecutar comando
  const tokens = rawCmd.split(/\s+/);
  const command = tokens[0].toLowerCase();
  
  if (command === 'clear') {
    $('#terminal-history').innerHTML = '';
    return;
  }
  
  if (command === 'help') {
    printToTerminal('Comandos: help, clear, touch <archivo>, ls · git init/status/add/commit -m/branch/checkout · (intermedio) git log, git diff, git merge <rama>, git remote add <nombre> <url>, git push');
    return;
  }
  
  if (command === 'ls') {
    const files = Object.keys(state.fs);
    if (!files.length) printToTerminal('(directorio vacío)');
    else printToTerminal(files.join('   '));
    return;
  }
  
  if (command === 'touch') {
    const filename = tokens[1];
    if (!filename) {
      printToTerminal('touch: falta el operando de archivo', 'error');
      return;
    }
    state.fs[filename] = '';
    renderExplorerTree(filename);
    printToTerminal(`Creado archivo vacío: ${filename}`, 'output');
    
    // Validar Git Día 2 / Tarea 1: touch index.html
    checkTerminalLessonCompletion();
    return;
  }
  
  // COMANDOS DE GIT
  if (command === 'git') {
    const action = tokens[1]?.toLowerCase();
    
    if (!action) {
      printToTerminal('Escribe "git help" para ver el uso.', 'error');
      return;
    }
    
    if (action === 'init') {
      state.git.initialized = true;
      printToTerminal('Initialized empty Git repository in /workspace/.git/', 'output');
      renderExplorerTree();
      checkTerminalLessonCompletion();
      return;
    }
    
    if (!state.git.initialized) {
      printToTerminal('fatal: not a git repository (or any of the parent directories): .git', 'error');
      return;
    }
    
    if (action === 'status') {
      const files = Object.keys(state.fs);
      const unstaged = files.filter(f => !state.git.staged.includes(f));
      
      printToTerminal(`En la rama ${state.git.branch}`);
      if (state.git.commits.length === 0) {
        printToTerminal('No hay commits todavía');
      }
      
      if (state.git.staged.length > 0) {
        printToTerminal('Cambios listos para ser comprometidos:');
        state.git.staged.forEach(f => printToTerminal(`  (use "git rm --cached <file>..." para des-preparar)`));
        state.git.staged.forEach(f => printToTerminal(`\tnew file:   ${f}`, 'success'));
      }
      
      if (unstaged.length > 0) {
        printToTerminal('Archivos sin seguimiento:');
        printToTerminal('  (use "git add <archivo>..." para incluirlos en el commit)');
        unstaged.forEach(f => printToTerminal(`\t${f}`, 'error'));
      }
      
      if (state.git.staged.length === 0 && unstaged.length === 0) {
        printToTerminal('nada para hacer commit, el árbol de trabajo está limpio');
      }
      return;
    }
    
    if (action === 'add') {
      const fileTarget = tokens[2];
      if (!fileTarget) {
        printToTerminal('Falta especificar archivo (ej. "git add .")', 'error');
        return;
      }
      
      const files = Object.keys(state.fs);
      if (fileTarget === '.' || fileTarget === '*') {
        state.git.staged = [...files];
        printToTerminal(`Preparados ${files.length} archivos para commit`);
      } else {
        if (!state.fs[fileTarget]) {
          printToTerminal(`fatal: pathspec '${fileTarget}' did not match any files`, 'error');
          return;
        }
        if (!state.git.staged.includes(fileTarget)) {
          state.git.staged.push(fileTarget);
        }
        printToTerminal(`Preparado: ${fileTarget}`);
      }
      checkTerminalLessonCompletion();
      return;
    }
    
    if (action === 'commit') {
      const mFlag = tokens[2];
      const message = tokens[3];
      if (mFlag !== '-m' || !message) {
        printToTerminal('Uso: git commit -m "mensaje"', 'error');
        return;
      }
      
      if (state.git.staged.length === 0) {
        printToTerminal('nothing to commit, working tree clean', 'output');
        return;
      }
      
      const cleanMsg = message.replace(/"/g, '');
      const commit = {
        id: Math.random().toString(16).slice(2, 9),
        message: cleanMsg,
        files: [...state.git.staged]
      };
      
      state.git.commits.push(commit);
      state.git.staged = [];
      printToTerminal(`[${state.git.branch} ${commit.id}] ${commit.message}`);
      printToTerminal(` ${commit.files.length} file changed, ${commit.files.length} insertions(+)`);
      
      checkTerminalLessonCompletion();
      return;
    }
    
    if (action === 'branch') {
      const bname = tokens[2];
      state.git.branchList = state.git.branchList || [state.git.branch];
      if (!bname) {
        state.git.branchList.forEach(b => printToTerminal(`${b === state.git.branch ? '* ' : '  '}${b}`));
        return;
      }
      if (!state.git.branchList.includes(bname)) state.git.branchList.push(bname);
      printToTerminal(`Creada rama: ${bname}`);
      return;
    }

    if (action === 'checkout') {
      const targetBranch = tokens[2];
      if (!targetBranch) {
        printToTerminal('Checkout requiere nombre de rama o archivo', 'error');
        return;
      }
      state.git.branchList = state.git.branchList || [state.git.branch];
      if (!state.git.branchList.includes(targetBranch)) state.git.branchList.push(targetBranch);
      state.git.branch = targetBranch;
      printToTerminal(`Cambiado a la rama '${targetBranch}'`);
      checkTerminalLessonCompletion();
      return;
    }

    // ── Intermedio: historial, fusión y remotos ──
    if (action === 'log') {
      if (!state.git.commits.length) {
        printToTerminal('fatal: tu rama actual aún no tiene commits', 'error');
        return;
      }
      const head = state.git.commits[state.git.commits.length - 1];
      [...state.git.commits].reverse().forEach(c => {
        printToTerminal(`commit ${c.id}${c === head ? ` (HEAD -> ${state.git.branch})` : ''}`, 'success');
        printToTerminal(`    ${c.message}`);
      });
      state.git.logViewed = true;
      checkTerminalLessonCompletion();
      return;
    }

    if (action === 'diff') {
      const unstaged = Object.keys(state.fs).filter(f => !state.git.staged.includes(f));
      if (!unstaged.length) { printToTerminal('(sin cambios sin preparar)'); return; }
      unstaged.forEach(f => printToTerminal(`diff --git a/${f} b/${f}`));
      return;
    }

    if (action === 'merge') {
      const src = tokens[2];
      state.git.branchList = state.git.branchList || [state.git.branch];
      if (!src) { printToTerminal('Uso: git merge <rama>', 'error'); return; }
      if (!state.git.branchList.includes(src)) { printToTerminal(`merge: ${src} - no se encontró la rama`, 'error'); return; }
      if (src === state.git.branch) { printToTerminal('Ya está actualizado (Already up to date).'); return; }
      state.git.commits.push({ id: Math.random().toString(16).slice(2, 9), message: `Merge branch '${src}' into ${state.git.branch}`, files: [] });
      state.git.merged = true;
      printToTerminal(`Merge made by the 'ort' strategy.`, 'success');
      printToTerminal(` Fusionada la rama '${src}' en '${state.git.branch}'.`);
      checkTerminalLessonCompletion();
      return;
    }

    if (action === 'remote') {
      const sub = tokens[2];
      if (sub === 'add') {
        const name = tokens[3], remoteUrl = tokens[4];
        if (!name || !remoteUrl) { printToTerminal('Uso: git remote add <nombre> <url>', 'error'); return; }
        state.git.remote = { name, url: remoteUrl };
        printToTerminal(`Remoto '${name}' añadido → ${remoteUrl}`);
        checkTerminalLessonCompletion();
        return;
      }
      if (state.git.remote) printToTerminal(`${state.git.remote.name}\t${state.git.remote.url} (fetch & push)`);
      else printToTerminal('(sin remotos configurados)');
      return;
    }

    if (action === 'push') {
      if (!state.git.remote) { printToTerminal('fatal: sin destino de push. Usa "git remote add origin <url>".', 'error'); return; }
      if (!state.git.commits.length) { printToTerminal('Everything up-to-date'); return; }
      state.git.pushed = true;
      printToTerminal(`To ${state.git.remote.url}`, 'success');
      printToTerminal(` * [new branch]      ${state.git.branch} -> ${state.git.branch}`);
      checkTerminalLessonCompletion();
      return;
    }

    printToTerminal(`Comando de Git desconocido: ${action}`, 'error');
    return;
  }
  
  printToTerminal(`Comando no reconocido: ${command}. Escribe "help" para obtener ayuda.`, 'error');
}

/* ── Validaciones de Práctica de Terminal (Git) ────────────────────────── */
function checkTerminalLessonCompletion() {
  const courseId = state.currentCourse.id;
  const day = state.currentDay;
  
  if (courseId === 'git') {
    if (day === 1 && state.git.initialized) {
      completeDay(courseId, day);
    } 
    else if (day === 2) {
      // Día 2: touch index.html, git add, git commit
      const hasHtml = state.fs['index.html'] !== undefined;
      const hasCommits = state.git.commits.length > 0;
      if (hasHtml && hasCommits) {
        completeDay(courseId, day);
      }
    } 
    else if (day === 3) {
      // Día 3: rama feature, git checkout feature, crear style.css y hacer commit
      const isFeatureBranch = state.git.branch === 'feature';
      const hasCss = state.fs['style.css'] !== undefined;
      const hasCommits = state.git.commits.length > 1; // Ya venía con 1 del initialState
      if (isFeatureBranch && hasCss && hasCommits) {
        completeDay(courseId, day);
      }
    }
    // ── Nivel intermedio ──
    else if (day === 4) {
      // Día 4: inspeccionar el historial con git log (con ≥2 commits)
      if (state.git.logViewed && state.git.commits.length >= 2) completeDay(courseId, day);
    }
    else if (day === 5) {
      // Día 5: fusionar una rama de vuelta en main
      if (state.git.merged && state.git.branch === 'main') completeDay(courseId, day);
    }
    else if (day === 6) {
      // Día 6: añadir un remoto y hacer push
      if (state.git.remote && state.git.pushed) completeDay(courseId, day);
    }
  }
}

/* Helper para disparar partículas luminosas flotantes en el editor */
function triggerCodeParticles() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = $('.editor-window');
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99';
  container.style.position = 'relative';
  container.appendChild(canvas);
  
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  
  const ctx = canvas.getContext('2d');
  const particles = [];
  const colors = ['#cc5a37', '#e05e3f', '#f59e0b', '#38bdf8'];
  
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.3),
      radius: Math.random() * 3 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 1,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }
  
  let active = true;
  
  function animate() {
    if (!active) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let alive = false;
    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      p.alpha -= p.decay;
      
      if (p.alpha > 0 && p.y < canvas.height) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }
    });
    
    if (alive) {
      requestAnimationFrame(animate);
    } else {
      active = false;
      canvas.remove();
    }
  }
  
  animate();
}

/* ── Validador del Editor de Código (Ansible, AAP, PHP, Python) ─────────────── */
function handleCodeRun() {
  const code = $('#editor-textarea').value;
  const consoleBox = $('#console-body');
  
  // Disparar flujo de partículas luminosas
  triggerCodeParticles();
  
  // Retroalimentación visual: LEDs parpadeando en naranja
  $$('.server-node').forEach(node => {
    node.classList.add('running');
    node.classList.remove('active');
  });
  
  consoleBox.textContent = `> Conectando con los hosts de destino...\n> Transfiriendo archivos de configuración...\n> Ejecutando tareas de automatización...\n`;
  
  setTimeout(() => {
    const courseId = state.currentCourse.id;
    const day = state.currentDay;
    
    let success = false;
    let output = '';
    
    try {
    if (courseId === 'ansible') {
      if (day === 1) {
        // hosts.yml
        const hasTaller = code.includes('taller:');
        const hasImpresora = code.includes('impresora1:');
        const hasIp = code.includes('192.168.1.100') && code.includes('ansible_host:');
        if (hasTaller && hasImpresora && hasIp) {
          success = true;
          output = 'Inventario cargado correctamente.\n[OK] taller -> impresora1 (192.168.1.100)';
        } else {
          output = 'Error de validación:\nEl inventario debe definir el grupo "taller", la máquina "impresora1" y su IP "192.168.1.100" bajo "ansible_host".';
        }
      } 
      else if (day === 2) {
        // playbook.yml
        const hasHosts = code.replace(/\s+/g, '').includes('hosts:taller');
        const hasApt = code.includes('apt:');
        const hasPkg = code.includes('name: apache2') || code.includes('name: "apache2"');
        const hasState = code.includes('state: present') || code.includes('state: "present"');
        if (hasHosts && hasApt && hasPkg && hasState) {
          success = true;
          output = 'Playbook validado sintácticamente.\n[OK] Playbook de Ansible estructurado correctamente.\n[OK] Tarea: Instalar apache2.';
        } else {
          output = 'Error de validación:\nEl playbook debe actuar sobre "hosts: taller" y usar el módulo "apt" para instalar "apache2" asegurando "state: present".';
        }
      } 
      else if (day === 3) {
        // service playbook.yml
        const hasService = code.includes('service:');
        const hasName = code.includes('name: apache2') || code.includes('name: "apache2"');
        const hasStarted = code.includes('state: started') || code.includes('state: "started"');
        const hasEnabled = code.includes('enabled: yes') || code.includes('enabled: true');
        if (hasService && hasName && hasStarted && hasEnabled) {
          success = true;
          output = 'Playbook ejecutado de forma simulada.\n[OK] Tarea: Levantar servicio apache2.\n[OK] Servicio configurado para autoarranque (enabled=yes)';
        } else {
          output = 'Error de validación:\nEl playbook debe usar el módulo "service" sobre "apache2", marcando "state: started" y "enabled: yes" (o true).';
        }
      }
    } 
    else if (courseId === 'aap') {
      if (day === 1) {
        // project yaml
        const hasProjName = code.includes('proyecto-taller');
        const hasScmGit = code.includes('scm_type: git') || code.includes('git');
        const hasUrl = code.includes('https://github.com/zaswear/dev-codigo.git');
        if (hasProjName && hasScmGit && hasUrl) {
          success = true;
          output = '[AAP Controller] Proyecto sincronizado.\n[OK] Importado repositorio Git con éxito.';
        } else {
          output = 'Error:\nDefine el proyecto "proyecto-taller" con origen git y la URL de este repositorio.';
        }
      } 
      else if (day === 2) {
        // job template
        const hasName = code.includes('ejecutar-webserver');
        const hasProj = code.includes('proyecto-taller');
        const hasPlaybook = code.includes('playbook.yml');
        if (hasName && hasProj && hasPlaybook) {
          success = true;
          output = '[AAP Controller] Job Template creada.\n[OK] Vinculado playbook.yml correctamente.';
        } else {
          output = 'Error:\nLa Job Template debe llamarse "ejecutar-webserver", usar el proyecto "proyecto-taller" y el playbook "playbook.yml".';
        }
      } 
      else if (day === 3) {
        // workflow
        const hasSuccess = code.includes('success') || code.includes('on_success');
        const hasNginx = code.includes('Nginx') || code.includes('nginx');
        if (hasSuccess && hasNginx) {
          success = true;
          output = '[AAP Controller] Flujo de Trabajo (Workflow) guardado.\n[OK] Nodo 1: Instalar Nginx -> On Success -> Nodo 2: Iniciar Nginx';
        } else {
          output = 'Error:\nDiseña un flujo YAML donde la finalización con éxito (success) de Nginx dispare la tarea siguiente.';
        }
      }
    } 
    else if (courseId === 'php') {
      if (day === 1) {
        // php variables
        const hasTag = code.includes('<?php');
        const hasVar = code.includes('$material') && code.includes('PLA');
        const hasEcho = code.includes('echo') && (code.includes('$material') || code.includes('PLA'));
        if (hasTag && hasVar && hasEcho) {
          success = true;
          output = 'Material: PLA\n\n[PHP Executed] Script completado con éxito.';
        } else {
          output = 'Error de compilación:\nFalta etiqueta <?php, la variable $material con "PLA" o el comando echo.';
        }
      } 
      else if (day === 2) {
        // php arrays
        const hasArray = code.includes('$temperaturas') && code.includes('200') && code.includes('210') && code.includes('220');
        const hasForeach = code.includes('foreach') && code.includes('echo');
        if (hasArray && hasForeach) {
          success = true;
          output = '200 210 220 \n\n[PHP Executed] Bucle iterado con éxito.';
        } else {
          output = 'Error de compilación:\nFalta el array $temperaturas con los valores [200, 210, 220] o el bucle foreach para imprimirlos.';
        }
      } 
      else if (day === 3) {
        // php functions
        const hasFunc = code.includes('function calcularCoste');
        const hasReturn = code.includes('return') && code.includes('/') && code.includes('*');
        const hasTest = code.includes('calcularCoste(500, 24)') || code.includes('calcularCoste');
        if (hasFunc && hasReturn && hasTest) {
          success = true;
          output = '12\n\n[PHP Executed] Función calcularCoste cargada correctamente.';
        } else {
          output = 'Error de compilación:\nDefine la función "calcularCoste($pesoG, $precioKg)" que retorne el cálculo indicado.';
        }
      }
    } 
    else if (courseId === 'python') {
      if (day === 1) {
        // python variables
        const hasVar1 = code.includes('modelo') && code.includes('Gridfinity Box');
        const hasVar2 = code.includes('peso') && code.includes('45');
        const hasPrint = code.includes('print') && code.includes('Gridfinity Box') && code.includes('45g');
        if (hasVar1 && hasVar2 && hasPrint) {
          success = true;
          output = 'El modelo Gridfinity Box pesa 45g\n\n[Python Process Completed]';
        } else {
          output = 'Error de validación:\nLas variables "modelo" y "peso" deben existir, y debes usar print con el formato solicitado.';
        }
      } 
      else if (day === 2) {
        // python loops
        const hasList = code.includes('colores') && code.includes('Rojo') && code.includes('Azul') && code.includes('Verde');
        const hasFor = code.includes('for') && code.includes('in colores') && code.includes('print');
        const hasUpper = code.includes('.upper()');
        if (hasList && hasFor && hasUpper) {
          success = true;
          output = 'ROJO\nAZUL\nVERDE\n\n[Python Process Completed]';
        } else {
          output = 'Error:\nCrea la lista "colores" con los tres valores y usa un bucle for convirtiendo los elementos a mayúsculas con .upper().';
        }
      } 
      else if (day === 3) {
        // python functions
        const hasDef = code.includes('def calcular_coste');
        const hasTry = code.includes('try:') && code.includes('except');
        const hasTest = code.includes('calcular_coste');
        if (hasDef && hasTry && hasTest) {
          success = true;
          output = '5.0\n\n[Python Process Completed]';
        } else {
          output = 'Error:\nDefine la función "calcular_coste(peso_g, precio_kg)" manejando excepciones con try/except.';
        }
      }
      else if (day === 4) {
        // python diccionarios
        const hasDict = code.includes('pieza') && code.includes('nombre') && code.includes('Soporte') && code.includes('material') && code.includes('PLA') && code.includes('peso') && code.includes('30');
        const hasAccess = code.includes("pieza['") || code.includes('pieza["');
        const hasPrint = code.includes('print') && code.includes('30g');
        if (hasDict && hasAccess && hasPrint) {
          success = true;
          output = 'Soporte (PLA) pesa 30g\n\n[Python Process Completed]';
        } else {
          output = 'Error:\nCrea el diccionario "pieza" con nombre/material/peso y accede a sus claves dentro de un f-string.';
        }
      }
      else if (day === 5) {
        // python cadenas / f-strings
        const hasVar = code.includes('marca') && code.includes('prusa');
        const hasMethods = code.includes('.capitalize()') && code.includes('len(');
        const hasPrint = code.includes('print') && code.includes('5 letras');
        if (hasVar && hasMethods && hasPrint) {
          success = true;
          output = 'Prusa tiene 5 letras\n\n[Python Process Completed]';
        } else {
          output = 'Error:\nUsa marca="prusa", .capitalize() y len() en un f-string para imprimir "Prusa tiene 5 letras".';
        }
      }
      else if (day === 6) {
        // python comprensión de listas
        const hasList = code.includes('numeros');
        const hasComp = code.includes('for') && code.includes('in numeros') && code.includes('if') && code.includes('% 2');
        const hasDouble = code.includes('*2') || code.includes('* 2') || code.includes('2*') || code.includes('2 *');
        const hasPrint = code.includes('print') && code.includes('pares');
        if (hasList && hasComp && hasDouble && hasPrint) {
          success = true;
          output = '[4, 8, 12]\n\n[Python Process Completed]';
        } else {
          output = 'Error:\nUsa una comprensión de lista sobre "numeros" filtrando pares (% 2 == 0) y duplicando el valor en "pares".';
        }
      }
      else if (day === 7) {
        // python clases
        const hasClass = code.includes('class Impresora') && code.includes('__init__') && code.includes('self.modelo');
        const hasMethod = code.includes('def describir') && code.includes('return');
        const hasInstance = code.includes('Ender 3') && code.includes('.describir()') && code.includes('print');
        if (hasClass && hasMethod && hasInstance) {
          success = true;
          output = 'Impresora: Ender 3\n\n[Python Process Completed]';
        } else {
          output = 'Error:\nDefine class Impresora con __init__/self.modelo y el método describir(); instancia con "Ender 3" e imprime describir().';
        }
      }
      else if (day === 8) {
        // python excepciones
        const hasFunc = code.includes('def leer_config');
        const hasTry = code.includes('try:') && code.includes('except') && code.includes('finally');
        const hasInt = code.includes('int(');
        const hasPrint = code.includes('print') && code.includes('Comprobación finalizada');
        if (hasFunc && hasTry && hasInt && hasPrint) {
          success = true;
          output = 'Comprobación finalizada\nNone\n\n[Python Process Completed]';
        } else {
          output = 'Error:\nDefine leer_config(valor) con try/except ValueError/finally; en finally imprime "Comprobación finalizada".';
        }
      }
    }
  } catch (err) {
    output = `Compilación fallida: ${err.message}`;
  }
  
    const finalMsg = `> Ejecución de playbook terminada.\n\n` + output;
    typeText(consoleBox, finalMsg, 4, () => {
      // Quitar estado de ejecución parpadeante
      $$('.server-node').forEach(node => {
        node.classList.remove('running');
      });
      
      if (success) {
        // Activar luces verdes de estado
        $$('.server-node').forEach(node => {
          node.classList.add('active');
        });
        completeDay(courseId, day);
      }
    }, consoleBox);
  }, 1000);
}

/* ── Cambiar Idioma ──────────────────────────────────────────────────────── */
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('dc-lang', lang);
  
  // Actualizar botones de idioma activo
  $$('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Re-traducir elementos estáticos
  translateUI();
  
  // Re-renderizar vistas activas
  if (state.currentCourse) {
    renderSidebar();
    loadLesson(state.currentDay);
  } else {
    renderCoursesGrid();
  }
}

function translateUI() {
  const t = STRINGS[state.lang];
  
  // Logo
  $('#navbar-brand-name').innerHTML = `dev-<span class="brand-accent">codigo</span>`;
  
  // Sync Banner (si está presente)
  const syncBanner = $('#sync-banner');
  if (syncBanner) {
    syncBanner.querySelector('.sync-banner-text').textContent = t.syncBanner;
    const syncLink = syncBanner.querySelector('.btn-github');
    if (syncLink) {
      syncLink.innerHTML = `<i class="ph ph-github-logo"></i> ${t.signInGithub}`;
    }
  }
  
  // Botón de Login/User
  const authBtn = $('#auth-action-btn');
  if (authBtn) {
    if (state.user) {
      authBtn.innerHTML = `
        <div class="user-profile">
          <img class="user-avatar" src="${esc(state.user.avatar)}" alt="${esc(state.user.login)}">
          <span>${esc(state.user.login)}</span>
        </div>
      `;
    } else {
      authBtn.innerHTML = `<i class="ph ph-github-logo"></i> ${t.signInGithub}`;
    }
  }
}

/* ── Inicialización ───────────────────────────────────────────────────────── */
async function init() {
  // 1. Cargar token si viene en la URL
  const url = new URL(location.href);
  const tok = url.searchParams.get('token');
  if (tok) {
    state.jwt = tok;
    localStorage.setItem('dc-jwt', tok);
    url.searchParams.delete('token');
    history.replaceState({}, '', url);
  }
  
  // 2. Resolver usuario desde el token
  parseUserFromJWT();
  
  // 3. Sincronizar en la nube
  if (state.jwt) {
    await syncProgress();
  }
  
  // 4. Mostrar banner de sync local si no hay sesión y hay progreso
  const progressKeys = Object.keys(state.progress);
  const hasLocalProgress = progressKeys.length > 0 && progressKeys.some(k => state.progress[k].length > 0);
  
  if (!state.jwt && hasLocalProgress) {
    const banner = document.createElement('div');
    banner.className = 'sync-banner';
    banner.id = 'sync-banner';
    banner.innerHTML = `
      <span class="sync-banner-text">${STRINGS[state.lang].syncBanner}</span>
      <a class="btn-github" href="/api/auth/github?next=/"><i class="ph ph-github-logo"></i> ${STRINGS[state.lang].signInGithub}</a>
    `;
    $('#welcome-view').insertBefore(banner, $('#courses-grid'));
  }
  
  // 5. Configurar eventos de traducción
  $$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });
  
  // Evento botón login principal
  const authBtn = $('#auth-action-btn');
  if (authBtn && !state.user) {
    authBtn.addEventListener('click', () => {
      location.href = '/api/auth/github?next=/';
    });
  }
  
  // Evento botón de tour guide navbar
  const tourStartBtn = $('#btn-start-tour');
  if (tourStartBtn) {
    tourStartBtn.addEventListener('click', startTour);
  }
  
  // Evento del modal de celebración
  const modal = $('#celebration-modal');
  $('#modal-continue-btn').addEventListener('click', () => {
    modal.classList.remove('show');
    // Pasar al siguiente día si existe
    if (state.currentDay < state.currentCourse.days.length) {
      loadLesson(state.currentDay + 1);
    } else {
      // Volver al catálogo si terminó el curso
      state.currentCourse = null;
      $('#course-view').style.display = 'none';
      $('#welcome-view').style.display = 'block';
      renderCoursesGrid();
      
      // Mostrar toast de felicitación
      showToast(STRINGS[state.lang].courseDone);
    }
  });
  
  // Traducir y pintar
  setLanguage(state.lang);

  // ── Botones de modo Academia / Chuletas ──
  $('#mode-academy')?.addEventListener('click', () => setMode('academy'));
  $('#mode-cheatsheet')?.addEventListener('click', () => setMode('cheatsheet'));


}

function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ── Funciones de Control del Modo Chuletas y AI Coach ────────────────────── */

function setMode(mode) {
  state.mode = mode;
  const btnAcademy = $('#mode-academy');
  const btnCheatsheet = $('#mode-cheatsheet');
  
  if (mode === 'academy') {
    btnAcademy?.classList.add('active');
    btnCheatsheet?.classList.remove('active');
    loadLesson(state.currentDay);
  } else {
    btnCheatsheet?.classList.add('active');
    btnAcademy?.classList.remove('active');
    renderSidebar();
    
    // Cargar la primera receta del catálogo
    const courseId = state.currentCourse.id;
    const cat = CHEATSHEETS[courseId];
    if (cat && cat.recipes.length > 0) {
      loadLesson(cat.recipes[0]);
    }
  }
}



// Iniciar aplicación
document.addEventListener('DOMContentLoaded', init);
