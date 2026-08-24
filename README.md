# SmartFlash

Aplicacion de flashcards para crear tarjetas de estudio, repasarlas por tema, practicar en modo quiz y consultar estadisticas de progreso. El proyecto fue migrado desde React + Vite a Next.js con App Router.

## Integrantes

| Integrante | Desafio / tarea | Rama sugerida |
|------------|------------------|---------------|
| Facundo Ferreyra | Migracion base a Next.js App Router | `feat/next-migration-app-router` |
|  | Revision, documentacion y flujo Git | `docs/readme-next-migration` |
|  | Metadata, SEO y rutas nativas | `feat/metadata-seo` |
|  | Accesibilidad y semantica | `fix/accessibility-semantics` |
|  | Estado global e hidratacion | `fix/zustand-hydration` |
|  | Optimizacion y deploy |  |

## Tecnologias

Next.js 16 · React 19 · TypeScript · Tailwind CSS v3 · Zustand · date-fns · lucide-react · ESLint

## Funcionalidades

- Home con accesos a los modulos principales.
- CRUD de tarjetas de estudio.
- Creacion y edicion de tarjetas con pregunta, respuesta, tema y dificultad.
- Listado con busqueda, filtro por tema y restauracion de tarjetas semilla.
- Modo repaso por mazo o por todas las tarjetas.
- Modo quiz con registro de aciertos y errores.
- Progreso general con racha actual, mejor racha, aciertos, errores e historial de sesiones.
- Persistencia local con Zustand y `localStorage`.
- Cambio de tema dia/noche.

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/` | Inicio |
| `/cards` | Mis tarjetas |
| `/new` | Crear tarjeta |
| `/edit/[id]` | Editar tarjeta |
| `/study/review` | Modo repaso |
| `/study/quiz` | Modo quiz |
| `/progress` | Progreso |

## Links

- Deploy: pendiente
- Repositorio original: pendiente
- Repositorio migrado: pendiente

## Instalacion local

```bash
git clone <url-del-repositorio>
cd Flashcards-G7
npm install
npm run dev
```

Luego abrir:

```txt
http://127.0.0.1:3000
```

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor de desarrollo de Next.js.

```bash
npm run build
```

Genera el build de produccion y valida TypeScript.

```bash
npm run start
```

Ejecuta el build de produccion.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

## Migracion a Next.js

La migracion realizada reemplaza la estructura de Vite y React Router por App Router de Next.js.

Cambios principales:

- `vite.config.ts`, `index.html`, `src/main.tsx` y `src/App.tsx` fueron eliminados.
- Se agrego `next.config.ts`.
- Se creo `src/app/layout.tsx` como layout raiz.
- Se crearon rutas en `src/app` para todas las pantallas originales.
- Las pantallas originales se movieron de `src/pages` a `src/views` para evitar que Next active Pages Router.
- `react-router-dom` fue reemplazado por `next/link` y `next/navigation`.
- `package.json`, `tsconfig.json`, `tailwind.config.js`, `.gitignore` y `eslint.config.js` fueron actualizados para Next.js.

## Estructura principal

```txt
src/
  app/
    layout.tsx
    page.tsx
    cards/page.tsx
    new/page.tsx
    edit/[id]/page.tsx
    progress/page.tsx
    study/review/page.tsx
    study/quiz/page.tsx
  views/
    HomePage.tsx
    CardsPage.tsx
    ProgressPage.tsx
    QuizPage.tsx
    ReviewPage.tsx
  components/
  features/
```

## Validacion

Ultimas verificaciones realizadas:

```bash
npm run lint
npm run build
npm audit --audit-level=high
```

Resultado:

- Lint sin errores.
- Build de Next.js correcto.
- Auditoria npm sin vulnerabilidades altas reportadas.

## Trabajo pendiente

- Agregar metadata especifica por ruta con `export const metadata`.
- Reemplazar los `document.title` de las vistas por metadata nativa de Next.
- Cargar la fuente con `next/font/google`.
- Agregar `src/app/robots.ts` y `src/app/sitemap.ts`.
- Revisar hidratacion de los stores persistidos de Zustand.
- Mejorar semantica de headings y labels de accesibilidad.
- Completar links de repositorio y deploy.

## Flujo Git recomendado

La migracion base se trabaja en:

```bash
feat/next-migration-app-router
```

Despues de subir esa rama, conviene abrir un Pull Request hacia `main` y continuar con cambios chicos en ramas separadas:

```txt
feat/metadata-seo
perf/next-font
fix/zustand-hydration
fix/accessibility-semantics
docs/update-readme-migration
```

Antes de integrar a `main`, correr:

```bash
npm run lint
npm run build
```
