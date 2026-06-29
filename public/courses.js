// dev-codigo — Curriculum de Cursos Bilingües e Interactivos
'use strict';

export const COURSES = {
  git: {
    id: 'git',
    color: '#F05032',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6M12 4v16" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: { es: 'Fundamentos de Git', en: 'Git Essentials' },
    desc: {
      es: 'Aprende control de versiones desde cero: inicia repositorios, gestiona el área de preparación (staging) y fusiona ramas.',
      en: 'Learn version control from scratch: initialize repositories, manage the staging area, and merge branches.'
    },
    days: [
      {
        day: 1,
        title: { es: 'Día 1: Inicialización', en: 'Day 1: Initialization' },
        concept: {
          es: `Git es un sistema de control de versiones distribuido. Te permite registrar el historial de cambios de tus archivos de código.\n\n### Comandos Clave:\n- \`git init\`: Inicializa un repositorio Git vacío en el directorio actual. Crea la carpeta oculta \`.git\` donde guarda todo el historial.\n- \`git status\`: Muestra el estado del directorio de trabajo y del área de preparación (staging).\n- \`git config --global user.name "TuNombre"\`: Configura tu nombre de usuario para los commits.`,
          en: `Git is a distributed version control system. It allows you to track the change history of your code files.\n\n### Key Commands:\n- \`git init\`: Initializes an empty Git repository in the current directory. Creates the hidden \`.git\` folder where it stores all history.\n- \`git status\`: Shows the state of the working directory and the staging area.\n- \`git config --global user.name "YourName"\`: Configures your username for commits.`
        },
        practice: {
          es: 'Escribe el comando para inicializar un nuevo repositorio Git vacío en tu taller actual. Luego, comprueba su estado con `git status`.',
          en: 'Write the command to initialize a new empty Git repository in your current workspace. Then, check its status with `git status`.'
        },
        type: 'terminal',
        goal: 'git init',
        initialState: {
          fs: {
            'README.md': 'Welcome to dev-codigo'
          },
          git: {
            initialized: false,
            staged: [],
            commits: [],
            branch: 'main'
          }
        }
      },
      {
        day: 2,
        title: { es: 'Día 2: Staging y Commits', en: 'Day 2: Staging & Commits' },
        concept: {
          es: `Para guardar cambios en Git, primero debes agregarlos al **Staging Area** (área de preparación) y luego consolidarlos en un **Commit**.\n\n### Flujo de Trabajo:\n1. Modificas un archivo en el directorio de trabajo.\n2. Ejecutas \`git add <archivo>\` (o \`git add .\` para añadir todo) para preparar el archivo.\n3. Ejecutas \`git commit -m "Mensaje explicativo"\` para congelar ese estado en el historial de forma permanente.`,
          en: `To save changes in Git, you must first add them to the **Staging Area** and then consolidate them in a **Commit**.\n\n### Workflow:\n1. Modify a file in the working directory.\n2. Run \`git add <file>\` (or \`git add .\` to add all) to stage the file.\n3. Run \`git commit -m "Explanatory message"\` to freeze that state in the history permanently.`
        },
        practice: {
          es: 'Crea un nuevo archivo con el comando `touch index.html`. Luego añádelo al staging area con `git add index.html`, y finalmente crea tu primer commit con el mensaje `"Primer commit"`.',
          en: 'Create a new file with the command `touch index.html`. Then add it to the staging area with `git add index.html`, and finally create your first commit with the message `"First commit"`.'
        },
        type: 'terminal',
        goal: 'git commit',
        initialState: {
          fs: {
            'README.md': 'Welcome to dev-codigo'
          },
          git: {
            initialized: true,
            staged: [],
            commits: [],
            branch: 'main'
          }
        }
      },
      {
        day: 3,
        title: { es: 'Día 3: Ramas (Branching)', en: 'Day 3: Branching & Merging' },
        concept: {
          es: `Las ramas te permiten trabajar en nuevas características de forma aislada sin afectar la versión estable principal (\`main\` o \`master\`).\n\n### Comandos de Ramas:\n- \`git branch <nombre-rama>\`: Crea una nueva rama.\n- \`git checkout <nombre-rama>\`: Cambia a la rama especificada.\n- \`git merge <rama-a-fusionar>\`: Une la rama especificada dentro de la rama actual en la que te encuentras.`,
          en: `Branches allow you to work on new features in isolation without affecting the main stable version (\`main\` or \`master\`).\n\n### Branch Commands:\n- \`git branch <branch-name>\`: Creates a new branch.\n- \`git checkout <branch-name>\`: Switches to the specified branch.\n- \`git merge <branch-to-merge>\`: Merges the specified branch into the current branch you are on.`
        },
        practice: {
          es: 'Crea una rama llamada `feature`. Cambia a ella usando `git checkout feature`. Luego crea un archivo llamado `style.css` y haz un commit con `"Añade estilos"`.',
          en: 'Create a branch named `feature`. Switch to it using `git checkout feature`. Then create a file named `style.css` and commit it with `"Add styles"`.'
        },
        type: 'terminal',
        goal: 'git branch-merge',
        initialState: {
          fs: {
            'README.md': 'Welcome to dev-codigo',
            'index.html': '<h1>Hello World</h1>'
          },
          git: {
            initialized: true,
            staged: [],
            commits: [{ id: 'a1b2c3d', message: 'Initial commit' }],
            branch: 'main'
          }
        }
      },
      {
        day: 4,
        level: 'intermedio',
        title: { es: 'Día 4: Historial y Diferencias', en: 'Day 4: History & Diffs' },
        concept: {
          es: `Git guarda un historial completo de tus commits. Para revisarlo usas \`git log\`, y para ver qué ha cambiado, \`git diff\`.\n\n### Comandos:\n- \`git log\`: lista los commits del más reciente al más antiguo (hash, mensaje y rama HEAD).\n- \`git log --oneline\`: versión compacta, un commit por línea.\n- \`git diff\`: muestra los cambios que aún no has preparado (staged).`,
          en: `Git keeps a full history of your commits. Review it with \`git log\`, and see what changed with \`git diff\`.\n\n### Commands:\n- \`git log\`: lists commits newest-first (hash, message and HEAD branch).\n- \`git log --oneline\`: compact, one commit per line.\n- \`git diff\`: shows changes you haven't staged yet.`
        },
        practice: {
          es: 'Tu taller ya tiene dos commits. Ejecuta `git log` para inspeccionar el historial completo del repositorio.',
          en: 'Your workspace already has two commits. Run `git log` to inspect the full repository history.'
        },
        type: 'terminal',
        goal: 'git-log',
        initialState: {
          fs: { 'README.md': 'Welcome to dev-codigo', 'index.html': '<h1>Hello World</h1>' },
          git: {
            initialized: true,
            staged: [],
            commits: [
              { id: 'a1b2c3d', message: 'Initial commit' },
              { id: 'b2c3d4e', message: 'Add index.html' }
            ],
            branch: 'main'
          }
        }
      },
      {
        day: 5,
        level: 'intermedio',
        title: { es: 'Día 5: Fusión de Ramas', en: 'Day 5: Merging Branches' },
        concept: {
          es: `Las ramas permiten desarrollar en paralelo; \`git merge\` integra el trabajo de una rama en otra.\n\n### Flujo típico:\n1. \`git branch hotfix\` y \`git checkout hotfix\` para aislar el cambio.\n2. Trabajas y haces commit en la rama.\n3. Vuelves a \`main\` con \`git checkout main\`.\n4. \`git merge hotfix\` fusiona los cambios en \`main\`.`,
          en: `Branches let you work in parallel; \`git merge\` integrates one branch's work into another.\n\n### Typical flow:\n1. \`git branch hotfix\` and \`git checkout hotfix\` to isolate the change.\n2. Work and commit on the branch.\n3. Return to \`main\` with \`git checkout main\`.\n4. \`git merge hotfix\` merges the changes into \`main\`.`
        },
        practice: {
          es: 'Crea la rama `hotfix` y cámbiate a ella. Crea `fix.txt` (`touch fix.txt`), añádelo y haz un commit. Vuelve a `main` y ejecuta: `git merge hotfix`.',
          en: 'Create branch `hotfix` and switch to it. Create `fix.txt` (`touch fix.txt`), add and commit it. Switch back to `main` and run: `git merge hotfix`.'
        },
        type: 'terminal',
        goal: 'git-merge',
        initialState: {
          fs: { 'README.md': 'Welcome to dev-codigo' },
          git: {
            initialized: true,
            staged: [],
            commits: [{ id: 'a1b2c3d', message: 'Initial commit' }],
            branch: 'main',
            branchList: ['main']
          }
        }
      },
      {
        day: 6,
        level: 'intermedio',
        title: { es: 'Día 6: Repositorios Remotos', en: 'Day 6: Remote Repositories' },
        concept: {
          es: `Un remoto es una copia del repositorio alojada en un servidor (p. ej. GitHub). \`git push\` sube tus commits locales al remoto.\n\n### Comandos:\n- \`git remote add origin <url>\`: vincula tu repo local con el remoto llamado \`origin\`.\n- \`git remote -v\`: lista los remotos configurados.\n- \`git push -u origin main\`: sube la rama \`main\` y la deja enlazada (upstream).`,
          en: `A remote is a copy of the repository hosted on a server (e.g. GitHub). \`git push\` uploads your local commits to it.\n\n### Commands:\n- \`git remote add origin <url>\`: links your local repo with the remote named \`origin\`.\n- \`git remote -v\`: lists configured remotes.\n- \`git push -u origin main\`: pushes the \`main\` branch and sets its upstream.`
        },
        practice: {
          es: 'Conecta un remoto con `git remote add origin https://github.com/tu-usuario/proyecto.git` y sube tu trabajo con `git push -u origin main`.',
          en: 'Connect a remote with `git remote add origin https://github.com/your-user/project.git` and push your work with `git push -u origin main`.'
        },
        type: 'terminal',
        goal: 'git-remote',
        initialState: {
          fs: { 'README.md': 'Welcome to dev-codigo', 'index.html': '<h1>Hello World</h1>' },
          git: {
            initialized: true,
            staged: [],
            commits: [{ id: 'a1b2c3d', message: 'Initial commit' }],
            branch: 'main'
          }
        }
      }
    ]
  },
  ansible: {
    id: 'ansible',
    color: '#000000',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-linejoin="round"/><path d="M12 8v8M8 12h8" stroke-linecap="round"/></svg>`,
    title: { es: 'Ansible para Automatización', en: 'Ansible Automation' },
    desc: {
      es: 'Automatiza configuraciones de servidores sin agentes. Escribe inventarios, comandos directos y playbooks declarativos.',
      en: 'Automate server configurations agentlessly. Write inventories, direct ad-hoc commands, and declarative playbooks.'
    },
    days: [
      {
        day: 1,
        title: { es: 'Día 1: Inventarios y Hosts', en: 'Day 1: Inventories & Hosts' },
        concept: {
          es: `Ansible utiliza un archivo de **Inventario** (usualmente escrito en YAML o INI) para definir los servidores en los que ejecutará tareas.\n\n### Ejemplo de Inventario YAML:\n\`\`\`yaml\nwebservers:\n  hosts:\n    servidor1.com:\n      ansible_host: 192.168.1.50\n    servidor2.com:\n      ansible_host: 192.168.1.51\n\`\`\``,
          en: `Ansible uses an **Inventory** file (usually written in YAML or INI format) to define the servers on which it will run tasks.\n\n### YAML Inventory Example:\n\`\`\`yaml\nwebservers:\n  hosts:\n    server1.com:\n      ansible_host: 192.168.1.50\n    server2.com:\n      ansible_host: 192.168.1.51\n\`\`\``
        },
        practice: {
          es: 'Crea un inventario en un archivo YAML llamado `hosts.yml`. Define un grupo llamado `taller` con un host llamado `impresora1` que tenga la IP `192.168.1.100` bajo `ansible_host`.',
          en: 'Create an inventory in a YAML file named `hosts.yml`. Define a group named `taller` with a host named `impresora1` having the IP `192.168.1.100` under `ansible_host`.'
        },
        type: 'code',
        goal: 'ansible-inventory',
        initialCode: `# Escribe tu inventario hosts.yml aquí\n`
      },
      {
        day: 2,
        title: { es: 'Día 2: Tu Primer Playbook', en: 'Day 2: Your First Playbook' },
        concept: {
          es: `Los **Playbooks** son archivos YAML donde defines una lista de tareas que quieres automatizar en tus hosts. Utilizan módulos reutilizables.\n\n### Ejemplo de Tarea:\n\`\`\`yaml\n- name: Instalar nginx\n  apt:\n    name: nginx\n    state: present\n\`\`\``,
          en: `**Playbooks** are YAML files where you define a list of tasks you want to automate on your hosts. They utilize reusable modules.\n\n### Task Example:\n\`\`\`yaml\n- name: Install nginx\n  apt:\n    name: nginx\n    state: present\n\`\`\``
        },
        practice: {
          es: 'Escribe un playbook llamado `playbook.yml` que actúe sobre los hosts `taller`. Añade una tarea que use el módulo `apt` para instalar `apache2` y asegurar que su estado sea `present`.',
          en: 'Write a playbook named `playbook.yml` targeting hosts `taller`. Add a task that uses the `apt` module to install `apache2` and ensures its state is `present`.'
        },
        type: 'code',
        goal: 'ansible-playbook',
        initialCode: `---
- name: Configurar Servidores del Taller
  hosts: taller
  become: yes
  tasks:
    # Escribe la tarea para instalar apache2 usando apt aquí
`
      },
      {
        day: 3,
        title: { es: 'Día 3: Variables y Servicios', en: 'Day 3: Variables & Services' },
        concept: {
          es: `Puedes parametrizar tus playbooks usando **variables** y controlar servicios usando el módulo \`service\` o \`systemd\` para iniciarlos, reiniciarlos o detenerlos.\n\n### Estructura de Variables:\n\`\`\`yaml\n  vars:\n    puerto_puente: 8080\n\`\`\``,
          en: `You can parameterize your playbooks using **variables** and control services using the \`service\` or \`systemd\` modules to start, restart, or stop them.\n\n### Variables Structure:\n\`\`\`yaml\n  vars:\n    bridge_port: 8080\n\`\`\``
        },
        practice: {
          es: 'Modifica el playbook para incluir una tarea que inicie y habilite el servicio `apache2` usando el módulo `service` con `state: started` y `enabled: yes`.',
          en: 'Modify the playbook to include a task that starts and enables the `apache2` service using the `service` module with `state: started` and `enabled: yes`.'
        },
        type: 'code',
        goal: 'ansible-service',
        initialCode: `---
- name: Gestionar Servicio Apache
  hosts: taller
  become: yes
  tasks:
    # Escribe la tarea de service para arrancar apache2
`
      }
    ]
  },
  aap: {
    id: 'aap',
    color: '#EE0000',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: { es: 'Ansible Automation Platform', en: 'Ansible Automation Platform' },
    desc: {
      es: 'Automatización a escala empresarial. Configura Automation Controllers, Job Templates, Inventarios Dinámicos y flujos de trabajo.',
      en: 'Enterprise-scale automation. Configure Automation Controllers, Job Templates, Dynamic Inventories, and workflows.'
    },
    days: [
      {
        day: 1,
        title: { es: 'Día 1: Controlador y Proyectos', en: 'Day 1: Controller & Projects' },
        concept: {
          es: `**Ansible Automation Platform (AAP)** introduce el Controller (antiguamente Tower), una interfaz gráfica y API para gestionar playbooks de forma centralizada y segura.\n\n### Concepto de Proyecto:\nUn **Project** en AAP es un enlace lógico a un repositorio Git que contiene tus Playbooks de Ansible. El Controller descarga el repositorio automáticamente para ejecutar las tareas.`,
          en: `**Ansible Automation Platform (AAP)** introduces the Controller (formerly Tower), a graphical interface and API to manage playbooks centrally and securely.\n\n### Project Concept:\nA **Project** in AAP is a logical link to a Git repository containing your Ansible Playbooks. The Controller downloads the repository automatically to run jobs.`
        },
        practice: {
          es: 'Escribe un fragmento YAML que configure un Proyecto en AAP. Define el nombre `proyecto-taller` y el origen SCM `git` con la URL `https://github.com/zaswear/dev-codigo.git`.',
          en: 'Write a YAML snippet configuring a Project in AAP. Define the name as `proyecto-taller` and the SCM source as `git` with the URL `https://github.com/zaswear/dev-codigo.git`.'
        },
        type: 'code',
        goal: 'aap-project',
        initialCode: `# Define la configuración del proyecto AAP en YAML\n`
      },
      {
        day: 2,
        title: { es: 'Día 2: Job Templates', en: 'Day 2: Job Templates' },
        concept: {
          es: `Una **Job Template** en AAP es una receta que define cómo ejecutar un playbook. Junta:\n1. Un **Proyecto** (los ficheros YAML).\n2. Un **Inventario** (en qué servidores actuar).\n3. Una **Credencial** (claves SSH/tokens para acceder a las máquinas).`,
          en: `A **Job Template** in AAP is a definition that outlines how to execute a playbook. It merges:\n1. A **Project** (the YAML files).\n2. An **Inventory** (which servers to target).\n3. A **Credential** (SSH keys/tokens to access machines).`
        },
        practice: {
          es: 'Crea la configuración de una Job Template en YAML. Nómbrala `ejecutar-webserver`, enlaza el proyecto `proyecto-taller` y especifica el archivo de playbook `playbook.yml`.',
          en: 'Create a Job Template configuration in YAML. Name it `ejecutar-webserver`, link the project `proyecto-taller`, and specify the playbook file `playbook.yml`.'
        },
        type: 'code',
        goal: 'aap-template',
        initialCode: `# Escribe la configuración de la Job Template\n`
      },
      {
        day: 3,
        title: { es: 'Día 3: Workflow Templates', en: 'Day 3: Workflows' },
        concept: {
          es: `Las **Workflow Templates** conectan múltiples Job Templates en un flujo lógico. Te permiten decidir qué hacer si una tarea tiene éxito (\`On Success\`) o falla (\`On Failure\`).`,
          en: `**Workflow Templates** connect multiple Job Templates into a logical pipeline. They allow you to decide what to execute depending on success (\`On Success\`) or failure (\`On Failure\`).`
        },
        practice: {
          es: 'Crea un flujo de trabajo sencillo. Si la tarea `Instalar Nginx` tiene éxito (`success`), arranca la tarea `Iniciar Servicio Nginx`. Escríbelo en formato YAML declarativo.',
          en: 'Create a simple workflow. If the task `Install Nginx` succeeds (`success`), trigger the task `Start Nginx Service`. Write it in declarative YAML format.'
        },
        type: 'code',
        goal: 'aap-workflow',
        initialCode: `# Configuración de Workflow en AAP\n`
      }
    ]
  },
  php: {
    id: 'php',
    color: '#777BB4',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linejoin="round"/></svg>`,
    title: { es: 'Programación en PHP', en: 'PHP Programming' },
    desc: {
      es: 'El motor de la web dinámica. Comprende la sintaxis, variables, estructuras condicionales, arrays y creación de funciones.',
      en: 'The engine of the dynamic web. Understand syntax, variables, conditional statements, arrays, and writing functions.'
    },
    days: [
      {
        day: 1,
        title: { es: 'Día 1: Sintaxis y Variables', en: 'Day 1: Syntax & Variables' },
        concept: {
          es: `PHP es un lenguaje de script del lado del servidor. El código PHP se escribe entre las etiquetas \`<?php\` y \`?>\`.\n\n### Conceptos Básicos:\n- Las variables comienzan con el símbolo \`$\` (ej. \`$nombre = "Juan";\`).\n- Cada instrucción termina con punto y coma (\`;\`).\n- \`echo\`: Se utiliza para imprimir texto en la página.`,
          en: `PHP is a server-side scripting language. PHP code is enclosed within \`<?php\` and \`?>\` tags.\n\n### Basic Concepts:\n- Variables start with a \`$\` sign (e.g. \`$name = "John";\`).\n- Every statement ends with a semicolon (\`;\`).\n- \`echo\`: Used to output text to the page.`
        },
        practice: {
          es: 'Escribe un script PHP básico. Define una variable llamada `$material` con el valor `"PLA"`, e imprímela usando `echo` con el formato `"Material: PLA"`.',
          en: 'Write a basic PHP script. Define a variable named `$material` with the value `"PLA"`, and output it using `echo` formatted as `"Material: PLA"`.'
        },
        type: 'code',
        goal: 'php-variables',
        initialCode: `<?php
// Escribe tu código aquí

?>`
      },
      {
        day: 2,
        title: { es: 'Día 2: Condicionales y Listas', en: 'Day 2: Conditionals & Arrays' },
        concept: {
          es: `PHP soporta arrays indexados y asociativos (clave-valor). Puedes usar \`if-else\` para tomar decisiones y \`foreach\` para recorrer arrays.\n\n### Ejemplo:\n\`\`\`php\n$colores = ["rojo", "azul"];\nforeach ($colores as $c) {\n  echo $c;\n}\n\`\`\``,
          en: `PHP supports both indexed and associative (key-value) arrays. You can use \`if-else\` to make decisions and \`foreach\` to iterate over arrays.\n\n### Example:\n\`\`\`php\n$colors = ["red", "blue"];\nforeach ($colors as $c) {\n  echo $c;\n}\n\`\`\``
        },
        practice: {
          es: 'Crea un array llamado `$temperaturas` con tres números: `200`, `210`, y `220`. Usa un bucle `foreach` para imprimir cada temperatura seguida de un espacio.',
          en: 'Create an array named `$temperaturas` with three numbers: `200`, `210`, and `220`. Use a `foreach` loop to print each temperature followed by a space.'
        },
        type: 'code',
        goal: 'php-arrays',
        initialCode: `<?php
// Escribe tu código aquí

?>`
      },
      {
        day: 3,
        title: { es: 'Día 3: Funciones Utilitarias', en: 'Day 3: Functions' },
        concept: {
          es: `Las funciones agrupan trozos de código reutilizables. Se declaran usando la palabra reservada \`function\`.\n\n### Estructura:\n\`\`\`php\nfunction duplicar($n) {\n  return $n * 2;\n}\n\`\`\``,
          en: `Functions group reusable blocks of code. They are declared using the \`function\` keyword.\n\n### Structure:\n\`\`\`php\nfunction double($n) {\n  return $n * 2;\n}\n\`\`\``
        },
        practice: {
          es: 'Define una función llamada `calcularCoste` que reciba dos parámetros: `$pesoG` y `$precioKg`. Debe calcular y retornar el coste: `($pesoG / 1000) * $precioKg`. Prueba la función con `echo calcularCoste(500, 24);`.',
          en: 'Define a function named `calcularCoste` that accepts two parameters: `$pesoG` and `$precioKg`. It must calculate and return the cost: `($pesoG / 1000) * $precioKg`. Test the function using `echo calcularCoste(500, 24);`.'
        },
        type: 'code',
        goal: 'php-functions',
        initialCode: `<?php
// Escribe tu función calcularCoste aquí

?>`
      }
    ]
  },
  python: {
    id: 'python',
    color: '#3776AB',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: { es: 'Programación en Python', en: 'Python Programming' },
    desc: {
      es: 'El lenguaje más popular para scripting y datos. Conoce las variables, listas de datos, diccionarios, bucles for y funciones básicas.',
      en: 'The most popular language for scripting and data. Learn variables, data lists, dictionaries, for loops, and basic functions.'
    },
    days: [
      {
        day: 1,
        title: { es: 'Día 1: Variables y Cadenas', en: 'Day 1: Variables & Strings' },
        concept: {
          es: `Python es conocido por su sintaxis limpia y legible. No requiere punto y coma al final de las líneas ni declaración de tipos de variables.\n\n### Características:\n- Variables asignadas directamente: \`filamento = "PLA"\`.\n- Formateo de texto fácil con f-strings: \`print(f"Material: {filamento}")\`.`,
          en: `Python is famous for its clean, readable syntax. It does not require semicolons at the end of lines or explicit variable type declarations.\n\n### Features:\n- Direct variable assignment: \`filament = "PLA"\`.\n- Easy string formatting with f-strings: \`print(f"Material: {filament}")\`.`
        },
        practice: {
          es: 'Crea una variable llamada `modelo` con el texto `"Gridfinity Box"` y otra `peso` con el valor `45`. Imprime una frase que diga `"El modelo Gridfinity Box pesa 45g"` usando f-strings.',
          en: 'Create a variable named `modelo` with the text `"Gridfinity Box"` and another named `peso` with the value `45`. Output a formatted string: `"El modelo Gridfinity Box pesa 45g"` using f-strings.'
        },
        type: 'code',
        goal: 'python-variables',
        initialCode: `# Escribe tu código Python aquí\n`
      },
      {
        day: 2,
        title: { es: 'Día 2: Listas y Bucles', en: 'Day 2: Lists & Loops' },
        concept: {
          es: `Las listas almacenan múltiples elementos en orden. Los diccionarios guardan pares clave-valor. La indentación (espacios al principio de la línea) define los bloques de código en los bucles.\n\n### Ejemplo:\n\`\`\`python\nfrutas = ["manzana", "pera"]\nfor f in frutas:\n    print(f)\n\`\`\``,
          en: `Lists store multiple ordered items. Dictionaries store key-value pairs. Indentation (whitespace at the start of a line) defines block scopes in loops.\n\n### Example:\n\`\`\`python\nfruits = ["apple", "pear"]\nfor f in fruits:\n    print(f)\n\`\`\``
        },
        practice: {
          es: 'Crea una lista llamada `colores` con `"Rojo"`, `"Azul"` y `"Verde"`. Escribe un bucle `for` para imprimir cada color convertido a mayúsculas usando `.upper()`.',
          en: 'Create a list named `colores` containing `"Rojo"`, `"Azul"`, and `"Verde"`. Write a `for` loop to print each color converted to uppercase using `.upper()`.'
        },
        type: 'code',
        goal: 'python-loops',
        initialCode: `# Escribe tu código con la lista y el bucle aquí\n`
      },
      {
        day: 3,
        title: { es: 'Día 3: Funciones y Control', en: 'Day 3: Functions & Exceptions' },
        concept: {
          es: `Las funciones se declaran usando \`def\`. Puedes usar \`try-except\` para capturar fallos inesperados y evitar que tu script se detenga abruptamente.\n\n### Ejemplo:\n\`\`\`python\ndef sumar(a, b):\n    return a + b\n\`\`\``,
          en: `Functions are declared using the \`def\` keyword. You can use \`try-except\` blocks to catch unexpected errors and prevent your script from crashing.\n\n### Example:\n\`\`\`python\ndef add(a, b):\n    return a + b\n\`\`\``
        },
        practice: {
          es: 'Crea una función llamada `calcular_coste` que reciba `peso_g` y `precio_kg`. Retorna el coste. Si se pasa un valor que no sea un número, captura la excepción y retorna `0`. Testea con `print(calcular_coste(250, 20))`.',
          en: 'Create a function named `calcular_coste` accepting `peso_g` and `precio_kg`. Return the calculated cost. If a non-numeric value is passed, catch the exception and return `0`. Test it with `print(calcular_coste(250, 20))`.'
        },
        type: 'code',
        goal: 'python-functions',
        initialCode: `# Define tu función calcular_coste aquí\n`
      },
      {
        day: 4,
        title: { es: 'Día 4: Diccionarios', en: 'Day 4: Dictionaries' },
        concept: {
          es: `Un diccionario guarda pares clave-valor entre llaves \`{}\`. Accedes a un valor por su clave y puedes recorrerlo con \`.items()\`.\n\n### Ejemplo:\n\`\`\`python\npieza = {"nombre": "Tuerca", "peso": 5}\nprint(pieza["nombre"])  # Tuerca\nfor clave, valor in pieza.items():\n    print(clave, valor)\n\`\`\``,
          en: `A dictionary stores key-value pairs inside braces \`{}\`. You access a value by its key and can iterate with \`.items()\`.\n\n### Example:\n\`\`\`python\npiece = {"name": "Nut", "weight": 5}\nprint(piece["name"])  # Nut\nfor key, value in piece.items():\n    print(key, value)\n\`\`\``
        },
        practice: {
          es: 'Crea un diccionario `pieza` con `nombre`="Soporte", `material`="PLA" y `peso`=30. Imprime con un f-string accediendo a las claves: `"Soporte (PLA) pesa 30g"`.',
          en: 'Create a dictionary `pieza` with `nombre`="Soporte", `material`="PLA" and `peso`=30. Print with an f-string accessing the keys: `"Soporte (PLA) pesa 30g"`.'
        },
        type: 'code',
        goal: 'python-dict',
        initialCode: `# Crea el diccionario pieza e imprímelo aquí\n`
      },
      {
        day: 5,
        title: { es: 'Día 5: Cadenas y f-strings', en: 'Day 5: Strings & f-strings' },
        concept: {
          es: `Las cadenas tienen métodos muy útiles: \`.upper()\`, \`.lower()\`, \`.strip()\`, \`.replace()\`, \`.capitalize()\`, y \`len()\` para su longitud.\n\n### Ejemplo:\n\`\`\`python\ntexto = " hola "\nprint(texto.strip().upper())  # HOLA\nprint(len("PLA"))  # 3\n\`\`\``,
          en: `Strings have handy methods: \`.upper()\`, \`.lower()\`, \`.strip()\`, \`.replace()\`, \`.capitalize()\`, and \`len()\` for their length.\n\n### Example:\n\`\`\`python\ntext = " hi "\nprint(text.strip().upper())  # HI\nprint(len("PLA"))  # 3\n\`\`\``
        },
        practice: {
          es: 'Crea `marca = "prusa"`. Usa `.capitalize()` y `len()` dentro de un f-string para imprimir exactamente: `"Prusa tiene 5 letras"`.',
          en: 'Create `marca = "prusa"`. Use `.capitalize()` and `len()` inside an f-string to print exactly: `"Prusa tiene 5 letras"`.'
        },
        type: 'code',
        goal: 'python-strings',
        initialCode: `# Trabaja la cadena marca aquí\n`
      },
      {
        day: 6,
        level: 'intermedio',
        title: { es: 'Día 6: Comprensión de Listas', en: 'Day 6: List Comprehensions' },
        concept: {
          es: `Una comprensión de lista crea una lista nueva en una sola línea: \`[expresión for elem in iterable if condición]\`. Es más conciso que un bucle con \`append\`.\n\n### Ejemplo:\n\`\`\`python\ncuadrados = [n * n for n in range(5)]\npares = [n for n in range(10) if n % 2 == 0]\n\`\`\``,
          en: `A list comprehension builds a new list in one line: \`[expression for item in iterable if condition]\`. More concise than a loop with \`append\`.\n\n### Example:\n\`\`\`python\nsquares = [n * n for n in range(5)]\nevens = [n for n in range(10) if n % 2 == 0]\n\`\`\``
        },
        practice: {
          es: 'A partir de `numeros = [1, 2, 3, 4, 5, 6]`, crea con UNA comprensión de lista la variable `pares` con el doble de los números pares. Imprime `pares` (resultado esperado: `[4, 8, 12]`).',
          en: 'From `numeros = [1, 2, 3, 4, 5, 6]`, build `pares` with a SINGLE list comprehension holding the double of the even numbers. Print `pares` (expected: `[4, 8, 12]`).'
        },
        type: 'code',
        goal: 'python-comprehension',
        initialCode: `numeros = [1, 2, 3, 4, 5, 6]\n# Escribe aquí la comprensión de lista\n`
      },
      {
        day: 7,
        level: 'intermedio',
        title: { es: 'Día 7: Clases y Objetos', en: 'Day 7: Classes & Objects' },
        concept: {
          es: `Las clases definen objetos. \`__init__\` es el constructor y \`self\` referencia a la instancia actual.\n\n### Ejemplo:\n\`\`\`python\nclass Pieza:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    def describir(self):\n        return f"Pieza: {self.nombre}"\n\`\`\``,
          en: `Classes define objects. \`__init__\` is the constructor and \`self\` refers to the current instance.\n\n### Example:\n\`\`\`python\nclass Part:\n    def __init__(self, name):\n        self.name = name\n    def describe(self):\n        return f"Part: {self.name}"\n\`\`\``
        },
        practice: {
          es: 'Crea una clase `Impresora` con `__init__(self, modelo)` que guarde `self.modelo`, y un método `describir(self)` que retorne `f"Impresora: {self.modelo}"`. Instánciala con modelo `"Ender 3"` e imprime el resultado de `describir()`.',
          en: 'Create a class `Impresora` with `__init__(self, modelo)` storing `self.modelo`, and a method `describir(self)` returning `f"Impresora: {self.modelo}"`. Instantiate it with model `"Ender 3"` and print the result of `describir()`.'
        },
        type: 'code',
        goal: 'python-classes',
        initialCode: `# Define la clase Impresora y úsala aquí\n`
      },
      {
        day: 8,
        level: 'intermedio',
        title: { es: 'Día 8: Excepciones y finally', en: 'Day 8: Exceptions & finally' },
        concept: {
          es: `\`try/except/finally\` controla los errores sin que el programa se detenga. El bloque \`finally\` se ejecuta siempre, falle o no.\n\n### Ejemplo:\n\`\`\`python\ntry:\n    n = int("abc")\nexcept ValueError:\n    n = None\nfinally:\n    print("Listo")\n\`\`\``,
          en: `\`try/except/finally\` handles errors without crashing the program. The \`finally\` block always runs, success or failure.\n\n### Example:\n\`\`\`python\ntry:\n    n = int("abc")\nexcept ValueError:\n    n = None\nfinally:\n    print("Done")\n\`\`\``
        },
        practice: {
          es: 'Escribe `leer_config(valor)` que intente `int(valor)` y lo retorne. Si lanza `ValueError`, captúralo y retorna `None`. En `finally`, imprime `"Comprobación finalizada"`. Testea con `print(leer_config("abc"))`.',
          en: 'Write `leer_config(valor)` that tries `int(valor)` and returns it. On `ValueError`, catch it and return `None`. In `finally`, print `"Comprobación finalizada"`. Test with `print(leer_config("abc"))`.'
        },
        type: 'code',
        goal: 'python-exceptions',
        initialCode: `# Define leer_config(valor) aquí\n`
      }
    ]
  }
};

export const CHEATSHEETS = {
  git: {
    id: 'git',
    title: { es: 'Chuletas de Git', en: 'Git Cheatsheets' },
    recipes: [
      {
        id: 'git-stash',
        title: { es: 'Guardar Trabajo Temporal (Git Stash)', en: 'Save Work Temporarily (Git Stash)' },
        concept: {
          es: `\`git stash\` guarda de forma temporal tus cambios locales no confirmados para que puedas tener un directorio de trabajo limpio sin necesidad de hacer un commit.\n\n### Comandos:\n- \`git stash\`: Guarda tus cambios locales.\n- \`git stash pop\`: Recupera y aplica tus cambios guardados más recientes.`,
          en: `\`git stash\` temporarily saves your uncommitted local changes so you can have a clean working directory without committing.\n\n### Commands:\n- \`git stash\`: Saves your local changes.\n- \`git stash pop\`: Retrieves and applies your most recently saved changes.`
        },
        practice: {
          es: 'Ejecuta `git stash` para guardar los cambios de tu archivo index.html en el stash. Luego verifica el estado con `git status`.',
          en: 'Run `git stash` to save the changes in index.html into the stash. Then check status with `git status`.'
        },
        type: 'terminal',
        goal: 'git stash',
        initialState: {
          fs: {
            'README.md': 'Welcome to dev-codigo',
            'index.html': '<h1>Modificaciones locales</h1>'
          },
          git: {
            initialized: true,
            staged: [],
            commits: [{ id: 'a1b2c3d', message: 'Initial commit' }],
            branch: 'main'
          }
        }
      },
      {
        id: 'git-cherry-pick',
        title: { es: 'Aplicar Commit Específico (Cherry Pick)', en: 'Apply Specific Commit (Cherry Pick)' },
        concept: {
          es: `\`git cherry-pick <commit-hash>\` te permite aplicar los cambios de un commit específico de cualquier otra rama en tu rama activa actual.\n\n### Comando:\n- \`git cherry-pick <hash>\`: Copia y aplica el commit con ese hash en tu rama actual.`,
          en: `\`git cherry-pick <commit-hash>\` allows you to apply changes from a specific commit from any other branch to your currently active branch.\n\n### Command:\n- \`git cherry-pick <hash>\`: Copies and applies the commit with that hash to your current branch.`
        },
        practice: {
          es: 'Aplica el commit con hash `e3d4c5b` (de la rama feature) en tu rama main actual usando `git cherry-pick e3d4c5b`.',
          en: 'Apply the commit with hash `e3d4c5b` (from feature branch) onto your current main branch using `git cherry-pick e3d4c5b`.'
        },
        type: 'terminal',
        goal: 'git cherry-pick',
        initialState: {
          fs: { 'README.md': 'Welcome' },
          git: {
            initialized: true,
            staged: [],
            commits: [{ id: 'a1b2c3d', message: 'Initial commit' }],
            branch: 'main'
          }
        }
      }
    ]
  },
  ansible: {
    id: 'ansible',
    title: { es: 'Chuletas de Ansible', en: 'Ansible Cheatsheets' },
    recipes: [
      {
        id: 'ansible-ping',
        title: { es: 'Comando Ad-Hoc (Ping)', en: 'Ad-Hoc Command (Ping)' },
        concept: {
          es: `Los comandos ad-hoc de Ansible te permiten ejecutar tareas rápidas en tus hosts sin escribir un playbook completo.\n\n### Sintaxis:\n\`ansible <patrón-hosts> -m <módulo> -i <inventario>\`\n\n- \`-m ping\`: Usa el módulo ping para comprobar conectividad SSH y disponibilidad de python.`,
          en: `Ansible ad-hoc commands allow you to run quick, one-off tasks on your hosts without writing a complete playbook.\n\n### Syntax:\n\`ansible <host-pattern> -m <module> -i <inventory>\`\n\n- \`-m ping\`: Uses the ping module to check SSH connectivity and Python availability.`
        },
        practice: {
          es: 'Escribe un comando ad-hoc para hacer un ping a todos los hosts (\`all\`) usando el inventario \`hosts.yml\`. Recuerda usar \`ansible all -m ping -i hosts.yml\`.',
          en: 'Write an ad-hoc command to ping all hosts (\`all\`) using the inventory \`hosts.yml\`. Remember to use \`ansible all -m ping -i hosts.yml\`.'
        },
        type: 'terminal',
        goal: 'ansible-ping',
        initialState: {
          fs: {
            'hosts.yml': 'webservers:\n  hosts:\n    localhost:\n      ansible_connection: local'
          }
        }
      },
      {
        id: 'ansible-handlers',
        title: { es: 'Uso de Handlers', en: 'Using Handlers' },
        concept: {
          es: `Los **Handlers** son tareas especiales que solo se ejecutan cuando son notificados por otra tarea usando la directiva \`notify\`. Se usan comúnmente para reiniciar servicios tras un cambio de configuración.\n\n### Estructura:\n\`\`\`yaml\n  tasks:\n    - name: Configurar apache\n      template: src=ports.conf dest=/etc/apache2/\n      notify: Reiniciar apache\n  handlers:\n    - name: Reiniciar apache\n      service: name=apache2 state=restarted\n\`\`\``,
          en: `**Handlers** are special tasks that only run when notified by another task using the \`notify\` directive. They are commonly used to restart services after configuration changes.\n\n### Structure:\n\`\`\`yaml\n  tasks:\n    - name: Configure apache\n      template: src=ports.conf dest=/etc/apache2/\n      notify: Restart apache\n  handlers:\n    - name: Restart apache\n      service: name=apache2 state=restarted\n\`\`\``
        },
        practice: {
          es: 'Escribe un playbook completo que configure apache en localhost. Añade una tarea que copie un archivo ficticio y notifique al handler \`Reiniciar apache\`. Define el handler correspondiente para reiniciar el servicio apache2.',
          en: 'Write a complete playbook configuring apache on localhost. Add a task that copies a dummy file and notifies the handler \`Restart apache\`. Define the corresponding handler to restart the apache2 service.'
        },
        type: 'code',
        goal: 'ansible-handlers',
        initialCode: `---
- name: Playbook con Handlers
  hosts: localhost
  become: yes
  tasks:
    - name: Copiar configuracion de puertos
      copy:
        content: "Listen 8080"
        dest: /etc/apache2/ports.conf
      notify: Reiniciar apache

  handlers:
    # Define el handler 'Reiniciar apache' que inicie apache2 en state=restarted aquí
`
      }
    ]
  }
};
