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
      }
    ]
  }
};
