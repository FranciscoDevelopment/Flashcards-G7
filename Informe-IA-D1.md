# Informe de Desarrollo - AethelFlash (Día 1)

Este informe resume todo el trabajo de inicialización y desarrollo de la aplicación de tarjetas de estudio con repetición espaciada **AethelFlash** realizado hasta el momento.

---

## 🛠️ Tecnologías y Configuración de Estilos

### Dependencias Instaladas
Se instalaron las siguientes dependencias de producción y desarrollo para soportar la navegación, gestión de estados persistentes, interfaz gráfica y estilos:

*   **Producción (`dependencies`):**
    *   `react-router-dom` (v7.18.0) — Sistema de enrutamiento dinámico para navegar entre páginas.
    *   `zustand` (v5.0.14) — Gestor de estado atómico ligero con sincronización persistente en `localStorage`.
    *   `lucide-react` (v1.21.0) — Set de iconos modernos y consistentes.
    *   `clsx` (v2.1.1) y `tailwind-merge` (v3.6.0) — Utilidades para la combinación dinámica y segura de clases CSS.
*   **Desarrollo (`devDependencies`):**
    *   `tailwindcss` (v3.x) — Motor de estilos basado en clases de utilidad. **Se decidió utilizar la versión Tailwind CSS v3** a petición del usuario.
    *   `postcss` y `autoprefixer` — Herramientas de procesamiento y prefijado CSS necesarias para Tailwind.

---

## 📁 Estructura del Proyecto

A continuación se muestra la distribución física de directorios y archivos dentro del espacio de trabajo `Flashcards-2.1`:

```text
Flashcards-2.1/
├── C:\Users\brand\Desktop\Flashcards-2.1\
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── Informe-IA-D1.md  <-- Este archivo
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── public/
│   │   └── favicon.svg
│   └── src/
        ├── App.tsx
        ├── index.css
        ├── App.css
        ├── main.tsx
        ├── app/
        │   └── router.tsx        <-- Nuevo sistema de enrutamiento
        ├── types/
        │   └── index.ts          <-- Modelos heredados
        ├── utils/
        │   └── leitner.ts        <-- Utilidades Leitner (preservadas)
        ├── store/
        │   └── useDeckStore.ts   <-- Store heredado
        ├── components/
        │   ├── Navbar.tsx        <-- Barra de navegación horizontal superior
        │   └── Flashcard.tsx     <-- Tarjeta 3D interactiva (preservada para I2)
        └── features/              <-- Estructura modular para características (Features)
            ├── home/
            │   └── HomePage.tsx   <-- Dashboard de bienvenida y accesos rápidos
            ├── night-or-day/      <-- Módulo de alternancia de tema visual (Modo Noche / Día)
            │   └── night-or-day.tsx <-- Componente ThemeToggle con inyección dinámica de estilos CSS
            └── cards/             <-- Módulo específico de gestión de tarjetas
                ├── CardsPage.tsx  <-- Página dedicada para administración, filtros y estadísticas
                ├── seed.ts
                ├── store.ts
                ├── types.ts
                └── components/
                    ├── CardForm.tsx
                    ├── CardItem.tsx
                    └── CardList.tsx
```

---

## 📝 Componentes Creados y su Justificación (El Qué y el Porqué)

A continuación se detallan los módulos creados en el código y la lógica detrás de su diseño:

### 1. Núcleo de Lógica y Datos
*   **[src/types/index.ts](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/types/index.ts) (Tipado Estricto)**
    *   *Qué:* Define las interfaces `Card`, `Deck` y `StudySessionLog`.
    *   *Por qué:* Mantiene la consistencia de datos a lo largo de toda la aplicación TypeScript, evitando inconsistencias al crear, actualizar o guardar datos.
*   **[src/utils/leitner.ts](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/utils/leitner.ts) (Algoritmo de Memorización)**
    *   *Qué:* Contiene las funciones de progresión y retroceso de tarjetas (Leitner) y cálculos de tiempos (`isCardDue`, `reviewCard`).
    *   *Por qué:* Aísla la ciencia cognitiva de repetición espaciada de la capa de vista de React, facilitando pruebas unitarias y reusabilidad del algoritmo.
*   **[src/store/useDeckStore.ts](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/store/useDeckStore.ts) (Estado Persistente)**
    *   *Qué:* Almacén Zustand con middleware `persist` que guarda decks y tarjetas directamente en el navegador. Contiene datos semillas iniciales (Frontend, Spaced Repetition y JS Tricks).
    *   *Por qué:* Evita la necesidad de una base de datos externa para un uso personal rápido, permitiendo al usuario continuar sus estudios exactamente donde los dejó incluso después de cerrar el navegador.

### 2. Estructura de Navegación, Enrutamiento y Páginas
*   **[src/app/router.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/app/router.tsx) (Sistema de Enrutamiento)**
    *   *Qué:* Centraliza todas las rutas de la aplicación de forma limpia usando React Router.
    *   *Por qué:* Aísla la configuración de rutas fuera del archivo raíz `App.tsx` para mejorar la mantenibilidad y organización del proyecto.
*   **[src/components/Navbar.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/Navbar.tsx) (Barra de Navegación)**
    *   *Qué:* Barra superior horizontal con diseño glassmorphic y enlaces de navegación (`NavLink`) hacia Tarjetas (`/`), Nueva Tarjeta (`/new`), y placeholders de Repaso y Quiz.
    *   *Por qué:* Reemplaza la barra lateral por un menú superior centralizado que optimiza el espacio de lectura y mantiene siempre visible la sección activa.

### 3. Componentes y Modales Interactivos
*   **[src/components/Flashcard.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/Flashcard.tsx) (Tarjeta 3D)**
    *   *Qué:* Tarjeta de estudio con animaciones de volteo en 3D basadas en perspectiva CSS.
    *   *Por qué:* Se preserva como componente reutilizable para que el desarrollador I2 pueda importarlo en los módulos interactivos de repaso y quiz.

### 4. Arquitectura Modular (Módulo de Características - Features)
*   **[src/features/cards/](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/) (Módulo de Tarjetas)**
    *   *Qué:* Estructura modular independiente diseñada para encapsular toda la lógica de negocio, tipos, semillas y componentes visuales relacionados exclusivamente con la entidad de las tarjetas (`CardForm.tsx`, `CardItem.tsx`, `CardList.tsx`).
    *   *Por qué:* Prepara la base de código para escalar de manera organizada, aislando el dominio de tarjetas para que sea altamente reutilizable, fácil de testear y modular.
    *   *Módulos Internos Creados:*
        *   [types.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/types.ts): Modelo de datos formal de la tarjeta (`Card` y `CardDifficulty`).
        *   [seed.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/seed.ts): Datos iniciales pre-poblados organizados por temas (Programación, Redes, Hardware, Ciberseguridad).
        *   [store.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/store.ts): Almacén de estado de Zustand + middleware `persist` que implementa las acciones CRUD principales y reserva el slot `recordResult`.
        *   [components/CardList.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardList.tsx): Tablero principal del dashboard que renderiza las tarjetas, calcula estadísticas generales, e implementa buscadores de texto y filtros dinámicos por tema.
        *   [components/CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx): Formulario unificado de creación y edición que detecta parámetros de ruta de React Router y ofrece una vista previa interactiva del anverso y reverso.
        *   [components/CardItem.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardItem.tsx): Componente ligero para visualizar una tarjeta individual, sus estadísticas de Quiz (hits/misses) y botones para editar o eliminar.

---

## 🔄 Últimos Cambios Realizados (Entrega D1 - Enrutamiento y CRUD de Tarjetas)

Se llevó a cabo una importante refactorización de la arquitectura de la aplicación para simplificar la navegación, eliminar el exceso de modales y modularizar la lógica de negocio en torno al Módulo de Tarjetas:

1. **Centralización de Rutas con React Router v7:** Se implementó [router.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/app/router.tsx) como gestor único de enrutamiento y se limpió [App.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/App.tsx) para renderizar únicamente la configuración de rutas raíz.
2. **Layout Base con Navbar Superior:** Se retiró el menú lateral `Sidebar` y se implementó un encabezado horizontal [Navbar.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Navbar.tsx) que envuelve dinámicamente el contenido mediante `<Outlet />` con resaltado activo.
3. **Tablero de Tarjetas (CRUD y Dashboard):** Se implementó [CardList.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardList.tsx) en el path `/` que calcula estadísticas, gestiona el listado y filtra por búsqueda de texto y temas.
4. **Formulario Unificado con Vista Previa:** Se implementó [CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx) en los paths `/new` y `/edit/:id` para creación y edición, integrando un simulador interactivo de tarjetas.
5. **Store Persistente con Zustand:** Se configuró el almacén global unificado en [store.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/store.ts) que sincroniza datos de tarjetas automáticamente en `localStorage` usando el middleware `persist`.
6. **Módulos Vacíos (Placeholders) para I2:** Se registraron las rutas `/review` (repaso) y `/quiz` (evaluación) con placeholders de carga limpia en el enrutador, y se dejó preparada la firma del método `recordResult(id, result)` en el store para asegurar la integración inmediata de I2.

La estructura final de los archivos del módulo es:
```text
src/
└── features/
    ├── home/
    │   └── HomePage.tsx       <-- Dashboard de bienvenida y accesos rápidos
    ├── night-or-day/          <-- Módulo de alternancia de tema visual
    │   └── night-or-day.tsx   <-- Componente ThemeToggle (Modo Noche / Día)
    └── cards/
        ├── CardsPage.tsx      <-- Página dedicada para administración, filtros y estadísticas
        ├── types.ts           <-- Interfaz Card y CardDifficulty (Modelo de Datos)
        ├── seed.ts            <-- Datos semilla de prueba iniciales (INITIAL_SEED_CARDS)
        ├── store.ts           <-- Store global de Zustand (useCardStore)
        └── components/
            ├── CardForm.tsx   <-- Formulario de creación/edición con vista previa
            ├── CardItem.tsx   <-- Renderizado de tarjeta con placeholder de métricas para D3
            └── CardList.tsx   <-- Tablero de listado presentacional puro
```

**Archivos modificados en este paso (Enrutador, Layout y CRUD):**
*   [src/app/router.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/app/router.tsx) — Configuración del enrutamiento y layout base.
*   [src/App.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/App.tsx) — Punto de entrada simplificado que delega la vista al enrutador.
*   [src/components/Navbar.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Navbar.tsx) — Barra de navegación superior horizontal.
*   [src/features/cards/components/CardList.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardList.tsx) — Dashboard principal y listado de tarjetas.
*   [src/features/cards/components/CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx) — Formulario unificado de creación y edición.
*   [src/features/cards/components/CardItem.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardItem.tsx) — Visualización de tarjeta individual dentro del listado.

---

## 🛠️ Detalle de Archivos Tocados en este Paso y Justificación

A continuación se resume la lista de archivos que fueron creados, modificados o eliminados en esta última etapa, junto con la justificación técnica de cada cambio:

### 1. Archivos Creados (Nuevos Módulos)
*   **[src/components/Navbar.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Navbar.tsx):**
    *   *Por qué:* Crea una barra superior horizontal unificada para la navegación del sitio en reemplazo del menú lateral (`Sidebar`). Mantiene accesos rápidos a Tarjetas (`/`), Nueva Tarjeta (`/new`), y placeholders estáticos para Repaso (`/review`) y Quiz (`/quiz`).
*   **[src/features/home/HomePage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/home/HomePage.tsx):**
    *   *Por qué:* Dashboard de bienvenida en el path `/` que permite acceder a los distintos modos de estudio y muestra la racha activa de estudio.
*   **[src/features/cards/CardsPage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/CardsPage.tsx):**
    *   *Por qué:* Página dedicada en `/cards` para la administración y listado de las tarjetas, manejando la lógica de filtrado y el contador de tarjetas/temas.
*   **[src/features/cards/components/CardList.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardList.tsx):**
    *   *Por qué:* Componente presentacional que renderiza la cuadrícula de tarjetas o la pantalla de estado vacío en base a las propiedades recibidas.
*   **[src/features/cards/components/CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx):**
    *   *Por qué:* Formulario único reutilizado para crear y editar tarjetas por ID. Lee los parámetros de ruta de React Router y ofrece una vista previa interactiva en tiempo real del anverso y reverso de la tarjeta.
*   **[src/features/cards/components/CardItem.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardItem.tsx):**
    *   *Por qué:* Renders de tarjetas individuales dentro de la cuadrícula general de la app, mostrando etiquetas de tema/dificultad, contadores de hits/misses para D2 y botones de acción rápida.

### 2. Archivos Modificados (Configuración Global)
*   **[src/app/router.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/app/router.tsx):**
    *   *Por qué:* Se reestructuró para montar la jerarquía de rutas raíz del entregable D1 y registrar las rutas vacías `/review` y `/quiz` de D2. Envuelve todas las vistas en un Layout que incluye el `Navbar` persistente y un `<Outlet />` de renderizado hijo.
*   **[src/App.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/App.tsx):**
    *   *Por qué:* Se simplificó para remover el menú lateral `Sidebar` y delegar todo el renderizado de la estructura visual y de enrutamiento al componente `<AppRouter />`.

### 3. Archivos Eliminados (Código Obsoleto)
*   **Las páginas antiguas basadas en mazos de `src/pages/` (`EditCardPage.tsx`, `FlashcardsPage.tsx`, `NewCardPage.tsx` y el viejo `HomePage.tsx` basado en barajas):**
    *   *Por qué:* Estas páginas pertenecían al flujo anterior basado en mazos de estudio. Al pasar a una estructura plana por temas ("Topics") y con Navbar superior, fueron depuradas de los directorios del proyecto.
*   **`src/components/Sidebar.tsx`, `src/components/DeckCard.tsx` y `src/components/CreateDeckModal.tsx`:**
    *   *Por qué:* Removidos de la carpeta de componentes globales para evitar código muerto, ya que la navegación lateral y el flujo de barajas fueron sustituidos por la barra superior horizontal (`Navbar`) y la gestión plana de categorías.

---

## 🚀 Estado de la Compilación y Ejecución

*   **Compilación de Producción:** El comando `npm run build` compila de manera exitosa sin errores de TypeScript ni de bundler, generando la carpeta optimizada de distribución `dist/`.
*   **Servidor de Desarrollo Local:** Ejecutándose en segundo plano y accesible en el puerto local predeterminado de Vite:
    👉 **[http://localhost:5173/](http://localhost:5173/)**


## Nota
* Se eligió usar Tailwind CSS v3 y aquí solo se instalaron las dependencias `react-router-dom`, `zustand`, `tailwindcss`, `lucide-react`, `clsx`, `tailwind-merge`. Los archivos de `postcss.config.js` y `tailwind.config.js` se generaron automáticamente al instalar Tailwind CSS v3. Los archivos `tsconfig.json`, `tsconfig.app.json` y `tsconfig.node.json` se generaron automáticamente al inicializar el proyecto con Vite.

* Se definió e implementó la interfaz `Card` y el tipo `CardDifficulty` en [src/features/cards/types.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/types.ts) con las propiedades requeridas (`id`, `question`, `answer`, `topic`, `difficulty`, `hits`, `misses`, `createdAt`, `lastReviewedAt`). Este archivo servirá como definición compartida estándar para el equipo de desarrollo para la gestión y evolución del módulo de tarjetas.

---

## 🐞 Corrección de Error en Tiempo de Ejecución (Infinite Loop en Zustand)

Durante las pruebas en el navegador, se identificó un error crítico que impedía visualizar la página principal:
> `Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside...`

### Causa del Problema
En los componentes [CardList.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardList.tsx) y [CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx), la llamada al store de Zustand destructuraba el estado creando un objeto nuevo en cada evaluación de la función selectora:
```typescript
const { cards, deleteCard, resetCards } = useCardStore((state) => ({
  cards: state.cards,
  deleteCard: state.deleteCard,
  resetCards: state.resetCards,
}));
```
Al retornar una nueva referencia de objeto (`{ ... }`) en cada ciclo de render, la comparación por identidad de Zustand (`===`) consideraba siempre que el estado había cambiado. Esto gatillaba una actualización del estado de React (`setState`), que a su vez iniciaba un nuevo ciclo de renderizado, resultando en un bucle infinito ("Maximum update depth exceeded").

### Solución Implementada
Se reescribieron los selectores del hook `useCardStore` de forma atómica para retornar referencias directas y estables del estado:
```typescript
const cards = useCardStore((state) => state.cards);
const deleteCard = useCardStore((state) => state.deleteCard);
const resetCards = useCardStore((state) => state.resetCards);
```
Esta práctica estándar en Zustand asegura que la comparación de identidad de React/Zustand funcione correctamente y no dispare renders innecesarios. Se aplicó con éxito en ambos componentes y la aplicación ahora se renderiza perfectamente en el navegador.

### Archivos Modificados por esta Corrección
*   [src/features/cards/components/CardList.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardList.tsx) — Se reemplazó el selector de objeto destructurado por selectores individuales estables para evitar renders cíclicos al listar tarjetas y estadísticas.
*   [src/features/cards/components/CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx) — Se implementaron selectores estables individuales en el formulario de creación y edición.

---

## 🎛️ Refactorización de Arquitectura, Dashboard de Bienvenida y Solución de Advertencias (Warnings)

Recientemente se reestructuró la aplicación para incorporar un Dashboard de Bienvenida y corregir advertencias de rendimiento y calidad reportadas por ESLint.

### 1. Reestructuración de Vistas y Rutas
* **[src/features/home/HomePage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/home/HomePage.tsx) (Dashboard de Bienvenida)**
  * *Qué:* Se transformó en un panel de bienvenida oscuro con accesos dinámicos a los modos de estudio ("Mis tarjetas", "Modo repaso" - bloqueado, "Modo quiz" - bloqueado, "Progreso" - bloqueado) y una sección de estadísticas generales de progreso simuladas con racha.
  * *Por qué:* Actúa como la pantalla principal (`/`) de la aplicación para ofrecer una experiencia interactiva de gamificación de estudio de cara al usuario.
* **[src/features/cards/CardsPage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/CardsPage.tsx) (Página de Administración de Tarjetas - NUEVA)**
  * *Qué:* Se creó esta nueva página de nivel superior para hospedar el listado principal de tarjetas, métricas y filtros que anteriormente estaban en `HomePage.tsx`.
* **[src/features/cards/components/CardList.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardList.tsx) (Listado Presentacional)**
  * *Qué:* Se convirtió en un componente presentacional puro que recibe las tarjetas filtradas y eventos a través de props, eliminando toda la lógica de filtrado y dependencias con el store.
* **[src/app/router.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/app/router.tsx) y [src/components/Navbar.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Navbar.tsx) (Navegación Actualizada)**
  * *Qué:* Se añadió la ruta `/cards` en el enrutador y se actualizó el `Navbar` superior para reflejar las dos secciones activas: **Inicio** (Dashboard `/`) y **Tarjetas** (Listado `/cards`).

### 2. Eliminación de Estilos de Fondo Redundantes
* En `CardList.tsx` y `CardForm.tsx` se retiraron las clases de fondo redundantes (`bg-slate-950 text-slate-100`), delegando el control del fondo al contenedor del `Layout` persistente para evitar saltos o parpadeos de scroll.

### 3. Correcciones de Advertencias (Warnings) de Compilación y ESLint
* **Optimización de Estado en `CardForm.tsx`:**
  * *Problema:* El hook `useEffect` ejecutaba llamadas síncronas a `setState` en el montaje y actualización, disparando renderizados síncronos redundantes en cascada.
  * *Solución:* Se eliminó el `useEffect` e `import { useEffect }`. Se inicializan los estados directamente a partir de la tarjeta de estudio cargada del store, y para reaccionar al cambio del parámetro `id` de la URL se implementó una actualización síncrona en fase de renderizado que optimiza el ciclo de vida de React.
* **Simplificación y Limpieza en `leitner.ts`:**
  * *Problema:* La variable `newBox` se inicializaba innecesariamente antes de ser sobreescrita síncronamente en todas las ramas de ejecución (`no-useless-assignment`).
  * *Solución:* Se simplificó la asignación utilizando una constante con operador ternario directo (`const newBox = success ? ... : ...`).

### 4. Limpieza de Métricas de Aprendizaje y Preparación para D3
* **Simplificación del Header en `CardsPage.tsx`:** Se eliminaron las 3 cajas grandes de estadísticas ("Total Tarjetas", "Críticas", "Dominadas") para evitar mostrar valores simulados o vacíos de Quiz. En su lugar se colocó un sutil contador resumido (`X tarjetas • Y temas`) debajo del título de la página.
* **Limpieza Visual en `CardItem.tsx`:** Se borraron los contadores en línea de aciertos (`hits`) y errores (`misses`) para centrar el diseño exclusivamente en el CRUD de D1.
* **Base para Integración en D3:** Se agregó un botón inactivo de **"Métricas"** con el icono `BarChart2` en cada tarjeta, sirviendo como punto de anclaje para que el desarrollador de D3 integre el modal de visualización de estadísticas.
* **Inicialización limpia de semillas en `seed.ts`:** Se configuraron todos los campos de `hits: 0` y `misses: 0` en las tarjetas semilla iniciales.
 

---

## 🌗 Módulo de Modo Noche / Día (ThemeToggle)

Se implementó un sistema de alternancia de tema visual que permite al usuario cambiar entre **modo oscuro** (por defecto) y **modo claro** desde cualquier pantalla de la aplicación.

### Componente Creado
*   **[src/features/night-or-day/night-or-day.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/night-or-day/night-or-day.tsx) (ThemeToggle)**
    *   *Qué:* Componente React que exporta un botón interactivo con iconos de sol (`Sun`) y luna (`Moon`) de Lucide. Al hacer clic, alterna entre los temas `light` y `dark`.
    *   *Cómo funciona:*
        1.  **Persistencia en `localStorage`:** El tema seleccionado se guarda bajo la clave `theme`, permitiendo que la preferencia del usuario sobreviva a recargas y sesiones.
        2.  **Inyección dinámica de CSS:** En el primer montaje del componente, se inyecta un bloque `<style>` en el `<head>` del documento con ID `theme-override-styles`. Este bloque contiene reglas CSS con selectores `html.light` que sobreescriben los fondos oscuros (`bg-slate-950`, `bg-slate-900`), colores de texto (`text-slate-100`, `text-white`), bordes, inputs, y hovers para adaptarlos a una paleta clara.
        3.  **Toggle de clase CSS:** Cuando el tema es `light`, se agrega la clase `light` al elemento `<html>`. Cuando es `dark`, se remueve. Esto activa o desactiva las reglas CSS inyectadas.
    *   *Integración:* El componente `ThemeToggle` se importa y renderiza dentro del [Navbar.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Navbar.tsx) (línea 47), a la derecha de los enlaces de navegación.
    *   *Por qué:* Ofrece accesibilidad visual y personalización del entorno de estudio. El modo claro mejora la legibilidad en ambientes con luz ambiental intensa, mientras que el modo oscuro reduce la fatiga visual en sesiones nocturnas.

### Archivos Modificados para la Integración del ThemeToggle
*   **[src/components/Navbar.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Navbar.tsx):** Se importó el componente `ThemeToggle` desde `../features/night-or-day/night-or-day` y se colocó dentro del `<nav>` junto a los enlaces de navegación.

---

## 🐛 Corrección de Errores y Limpieza de Clases CSS Inválidas

Se realizó una auditoría exhaustiva del código fuente que identificó y corrigió múltiples errores que no impedían la compilación pero afectaban el comportamiento y la renderización visual de la aplicación.

### 1. Error de Navegación Post-Guardado en CardForm
*   **Problema:** Después de crear o editar una tarjeta, el formulario redirigía al usuario a `/` (HomePage - Dashboard de bienvenida) en lugar de `/cards` (CardsPage - Listado de tarjetas donde se pueden ver las tarjetas creadas).
*   **Causa:** En [CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx), la función `handleSubmit` ejecutaba `navigate('/')` y los enlaces "Volver al Listado" apuntaban a `to="/"`.
*   **Solución:** Se actualizaron las 3 referencias de navegación:
    *   `navigate('/')` → `navigate('/cards')` (línea 64 — redirección post-guardado)
    *   `<Link to="/">` → `<Link to="/cards">` (línea 40 — enlace en pantalla de "tarjeta no encontrada")
    *   `<Link to="/">` → `<Link to="/cards">` (línea 78 — enlace "Volver al Listado" en cabecera del formulario)

### 2. Clases de Tailwind CSS Inexistentes (Valores de Shade No Estándar)
*   **Problema:** Se utilizaban ~15 clases de Tailwind CSS con valores de shade intermedios que **no existen** en la paleta estándar de Tailwind v3 (por ejemplo: `text-slate-350`, `text-slate-450`, `border-slate-850`). Tailwind solo genera clases para shades estándar: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. Las clases con shades personalizados como `350`, `355`, `450`, `550`, `650`, `850` no producen ningún CSS, por lo que los textos y bordes afectados heredaban colores incorrectos de sus contenedores padre.
*   **Solución:** Se reemplazó cada clase inválida con el shade estándar válido más cercano:

| Clase Inválida | Reemplazo Válido | Archivos Corregidos |
|---|---|---|
| `text-slate-350`, `dark:text-slate-350` | `text-slate-400` | CardForm.tsx, CardsPage.tsx, night-or-day.tsx |
| `text-slate-355` | `text-slate-400` | CardForm.tsx |
| `text-slate-450` | `text-slate-400` | CardsPage.tsx, HomePage.tsx, CardItem.tsx, night-or-day.tsx |
| `text-slate-550` | `text-slate-500` | CardItem.tsx, HomePage.tsx |
| `text-slate-650` | `text-slate-600` | CardForm.tsx, CardItem.tsx, night-or-day.tsx |
| `border-slate-850`, `bg-slate-850` | `border-slate-800`, `bg-slate-800` | CardForm.tsx, CardItem.tsx, CardsPage.tsx, Flashcard.tsx, night-or-day.tsx |
| `text-amber-450` | `text-amber-400` | CardForm.tsx, CardItem.tsx |
| `text-rose-450` | `text-rose-400` | CardForm.tsx, CardItem.tsx |
| `text-emerald-450` | `text-emerald-400` | CardItem.tsx |

### 3. Actualización de Selectores CSS en ThemeToggle
*   **Problema:** El bloque de CSS inyectado dinámicamente por el componente `ThemeToggle` en [night-or-day.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/night-or-day/night-or-day.tsx) contenía selectores que apuntaban a las clases de Tailwind inválidas (`.text-slate-650`, `.border-slate-850`, `.text-slate-450`). Al corregir las clases en los componentes, estos selectores CSS dejaban de coincidir.
*   **Solución:** Se actualizaron los selectores CSS del ThemeToggle para apuntar a las clases corregidas:
    *   `html.light .text-slate-650` → `html.light .text-slate-600`
    *   `html.light .border-slate-850` → `html.light .border-slate-800`
    *   `html.light .text-slate-450` → `html.light .text-slate-400`

### Archivos Modificados en esta Corrección
*   [src/features/cards/components/CardForm.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardForm.tsx) — Navegación corregida + 11 clases CSS reemplazadas.
*   [src/features/cards/components/CardItem.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/components/CardItem.tsx) — 9 clases CSS reemplazadas.
*   [src/features/cards/CardsPage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/CardsPage.tsx) — 3 clases CSS reemplazadas.
*   [src/features/home/HomePage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/home/HomePage.tsx) — 2 clases CSS reemplazadas.
*   [src/features/night-or-day/night-or-day.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/night-or-day/night-or-day.tsx) — 3 selectores CSS + 1 clase en className del botón corregidos.
*   [src/components/Flashcard.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Flashcard.tsx) — 1 clase CSS reemplazada.

### Estado Final de la Compilación
*   **TypeScript (`tsc -b --noEmit`):** ✅ Compilación exitosa sin errores.
*   **Vite Build (`npx vite build`):** ✅ Build de producción exitoso.
*   **Grep de clases inválidas:** ✅ Cero ocurrencias de shades no estándar en todo el código fuente.