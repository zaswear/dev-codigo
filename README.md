# dev-codigo

Una plataforma educativa bilingüe y totalmente interactiva para principiantes con cursos estructurados por días sobre **Git, Ansible, Ansible Automation Platform, PHP y Python**. 

La interfaz visual está inspirada en la estética limpia, tipografía literaria y tonos arena/terracota de **claude.ai**.

---

## Tecnologías Utilizadas

- **Frontend**: HTML5 · CSS3 Nativo · Vanilla JS (sin compilación)
- **Simuladores**: Intérpretes ligeros en JS que simulan comandos bash/git y compilan reglas de código de forma local.
- **Backend**: Vercel Serverless Edge Functions (`/api/`)
- **Base de Datos**: Neon PostgreSQL (almacenamiento de progreso de usuarios)
- **Autenticación**: GitHub OAuth + JWT firmados con la API Web Crypto de Edge.

---

## Puesta en Marcha en Local

### 1. Variables de Entorno
Copia el archivo `.env.example` a un nuevo archivo `.env` en la raíz del proyecto y rellena los datos correspondientes:

```bash
DATABASE_URL="postgres://usuario:contraseña@host-neon/neondb?sslmode=require"
GITHUB_CLIENT_ID="tu_oauth_client_id"
GITHUB_CLIENT_SECRET="tu_oauth_client_secret"
JWT_SECRET="tu_firma_jwt_secreta"
OWNER="zaswear"
```

### 2. Configurar Base de Datos
Importa las tablas ejecutando el script SQL en tu base de datos de Neon:

```bash
psql "$DATABASE_URL" < scripts/schema.sql
```

### 3. Instalar y Correr
Instala las dependencias de Node.js y arranca el servidor local de desarrollo usando la CLI de Vercel:

```bash
npm install
npx vercel dev
```

La aplicación estará lista en [http://localhost:3000](http://localhost:3000).

---

## Despliegue en Producción

Para desplegar en Vercel, simplemente vincula tu repositorio remoto con tu cuenta de Vercel e ingresa las mismas variables de entorno del `.env` en la sección de ajustes de Vercel. Asegúrate de actualizar el Callback de tu GitHub OAuth App con la URL de producción: `https://tu-proyecto.vercel.app/api/auth/callback`.
