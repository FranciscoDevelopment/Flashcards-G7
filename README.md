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

Se cambió toda la base de Vite + React Router por el App Router de Next.js. En resumen:

- Se sacaron `vite.config.ts`, `index.html`, `src/main.tsx` y `src/App.tsx`, y se agregó `next.config.ts`.
- `src/app/layout.tsx` pasó a ser el layout raíz del sitio.
- Cada pantalla original tiene ahora su carpeta y `page.tsx` dentro de `src/app`.
- Las vistas se movieron de `src/pages` a `src/views`, para que Next no las confunda con el Pages Router.
- `react-router-dom` se reemplazó por `next/link` y `next/navigation`.
- Se actualizaron `package.json`, `tsconfig.json`, `tailwind.config.js`, `.gitignore` y `eslint.config.js` para que todo funcione con Next.

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

**Tema día/noche con flash al cargar.** El toggle dependía solo del estado de React, así que al recargar la página aparecía un flash antes de aplicar el tema guardado en `localStorage`. Se arregló inicializando el tema en el cliente antes del primer render (rama `fix/theme-by-client-state`).

**Títulos de pestaña seteados a mano.** Quedó de la versión en Vite: cada vista hacía `document.title = "..."` dentro de un `useEffect`. Se reemplazó por `metadata` nativa de Next en cada `page.tsx`, y se sacaron los `useEffect` que ya no servían para nada.

**El build de producción fallaba.** Quedó dando vueltas el `vite.config.ts` viejo, y como ya no están instaladas sus dependencias, TypeScript no lo podía tipar y rompía `npm run build`. Se borró el archivo.

**Las pantallas mostraban datos vacíos por un instante.** Los componentes leían el estado de Zustand antes de que terminara de hidratarse desde `localStorage`, entonces por una fracción de segundo se veían tarjetas semilla o listas vacías en vez de lo guardado. Se agregó un chequeo de `hasHydrated` en Cards, Quiz, Repaso y Progreso para mostrar un "cargando" corto mientras tanto.

**Jerarquía de encabezados rota.** El único `<h1>` de todo el sitio era el logo del navbar, repetido igual en cada pantalla — y los títulos reales de cada página (Mis Tarjetas, Progreso, etc.) estaban como `<h2>`. Para alguien navegando con lector de pantalla esto no ayuda a saber en qué pantalla está. Se corrigió: cada pantalla tiene su propio `<h1>` y el logo pasó a texto normal.

## Trabajo pendiente

Por ahora no queda nada pendiente que sepamos. Última vuelta de chequeo: lint y build sin errores, hidratación de Zustand controlada, y jerarquía de headings corregida.

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
