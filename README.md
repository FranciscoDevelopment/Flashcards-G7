# SmartFlash

Aplicacion de flashcards para crear tarjetas de estudio, repasarlas por tema, practicar en modo quiz y consultar estadisticas de progreso. El proyecto fue migrado desde React + Vite a Next.js con App Router.

## Integrantes

| Integrante | Desafio / tarea | Rama |
|------------|------------------|---------------|
| Facundo Ferreyra | Migracion base a Next.js App Router | `feat/next-migration-app-router` |
| Francisco Chiressi | Fix de tema dia/noche, revision y flujo Git | `fix/theme-by-client-state` |
| Irina D'Andrea | Metadata, SEO, sitemap, robots, next/font y deploy | `feat/metadata-seo` |
| Camila Ferro | Accesibilidad y semantica | `fix/accessibility-semantics` |
| Luca Almiron | Estado global e hidratacion | `fix/zustand-hydration` |

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

- Deploy: https://flashcards-g7.vercel.app
- Repositorio original: https://github.com/Bran-Nick/Flashcards-
- Repositorio migrado: https://github.com/FranciscoDevelopment/Flashcards-G7

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

## Bugs encontrados y corregidos

| Bug | Causa | Solucion |
|-----|-------|----------|
| El tema dia/noche no persistia bien y generaba parpadeo (flash) al cargar | El toggle de tema dependia solo de estado de React sin sincronizarse con `localStorage` antes del primer render | Se implemento inicializacion del tema en el cliente con un script embebido en `layout.tsx` y manejo de estado client-side (rama `fix/theme-by-client-state`) |
| Los titulos de pestana se seteaban a mano con `document.title` dentro de `useEffect` en cada vista | Patron heredado de la version en React + Vite, incompatible con el modelo de metadata de Next.js | Se reemplazo por `export const metadata` (o metadata por ruta) en cada `page.tsx`, y se eliminaron los `document.title` y los `useEffect` que ya no se usaban |
| El build fallaba en produccion (`npm run build`) por errores de TypeScript en `vite.config.ts` | Quedo un archivo residual de la version en Vite que ya no tiene sus dependencias instaladas | Se elimino `vite.config.ts` del repositorio |
| Las pantallas mostraban datos vacios o semilla por un instante antes de cargar lo guardado en `localStorage` | Los componentes leian el estado de Zustand sin esperar a que la persistencia terminara de hidratarse | Se agrego un chequeo de `hasHydrated` en `CardsPage`, `QuizPage`, `ReviewPage` y `ProgressPage`, mostrando un estado de carga hasta que los datos reales estan listos |
| Cada pantalla usaba `h2` como titulo principal y el unico `h1` del sitio era el logo repetido en la barra de navegacion | Patron heredado de la version original, afecta la navegacion por encabezados de lectores de pantalla | Se convirtio el titulo principal de cada pantalla en `h1` y el logo paso a texto sin rol de encabezado |

## Trabajo pendiente

No quedan pendientes conocidos. Ultima verificacion: lint y build de produccion sin errores, hidratacion de Zustand controlada con `hasHydrated`, jerarquia de headings corregida (un `h1` por pantalla).

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
