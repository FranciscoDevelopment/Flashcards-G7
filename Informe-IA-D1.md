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
        │   └── index.ts
        ├── utils/
        │   └── leitner.ts
        ├── store/
        │   └── useDeckStore.ts
        ├── components/
        │   ├── Sidebar.tsx
        │   ├── DeckCard.tsx
        │   ├── Flashcard.tsx
        │   └── CreateDeckModal.tsx
        ├── pages/
        │   ├── HomePage.tsx       <-- Consolida Dashboard, LeitnerStats y Settings
        │   ├── FlashcardsPage.tsx <-- Consolida DeckDetails y StudySession (Modo Estudio)
        │   ├── NewCardPage.tsx    <-- Formulario de creación dedicado
        │   └── EditCardPage.tsx   <-- Formulario de edición dedicado
        └── features/              <-- Estructura modular para características (Features)
            └── cards/             <-- Módulo específico de gestión de tarjetas
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
*   **[src/components/Sidebar.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/Sidebar.tsx) (Navegación e Indicadores)**
    *   *Qué:* Barra lateral de navegación con contador dinámico de tarjetas que requieren revisión.
    *   *Por qué:* Mantiene al usuario informado sobre su volumen de estudio pendiente y sincroniza el menú lateral con las pestañas internas de la aplicación.
*   **[src/pages/HomePage.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/HomePage.tsx) (Panel Unificado / Home)**
    *   *Qué:* Consolida en una sola interfaz dinámica el listado de mazos (Dashboard), el gráfico y desglose de progreso (Leitner Progress), y las utilidades de respaldo/reinicios (Settings) mediante pestañas fluidas sincronizadas con la ruta actual.
    *   *Por qué:* Simplifica la navegación general uniendo tres pantallas antes independientes bajo una misma experiencia integrada y coherente.
*   **[src/pages/FlashcardsPage.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/FlashcardsPage.tsx) (Mazo y Sesión de Estudio)**
    *   *Qué:* Muestra la lista de tarjetas y estadísticas del mazo (antiguo `DeckDetails`) e integra directamente la sesión de estudio interactiva en 3D (antiguo `StudySession`).
    *   *Por qué:* Permite cambiar instantáneamente entre la administración de tarjetas de un mazo y el inicio del repaso del mismo sin forzar saltos de página ni pérdida de contexto.
*   **[src/pages/NewCardPage.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/NewCardPage.tsx) (Creación Dedicada)**
    *   *Qué:* Página y formulario dedicado para crear nuevas tarjetas dentro de un mazo, con vista previa.
    *   *Por qué:* Reemplaza los molestos e incómodos modales en favor de un espacio de entrada enfocado y sin distracciones.
*   **[src/pages/EditCardPage.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/EditCardPage.tsx) (Edición Dedicada)**
    *   *Qué:* Página y formulario dedicado para modificar el frente y reverso de tarjetas ya creadas.
    *   *Por qué:* Ofrece una ruta y espacio limpio para corregir o refinar preguntas y respuestas rápidamente.

### 3. Componentes y Modales Interactivos
*   **[src/components/Flashcard.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/Flashcard.tsx) (Tarjeta 3D)**
    *   *Qué:* Tarjeta de estudio con animaciones realistas de volteo en 3D basadas en CSS de perspectiva.
    *   *Por qué:* Brinda un impacto visual "premium" y gamificado que imita las tarjetas físicas reales.
*   **[src/components/CreateDeckModal.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/CreateDeckModal.tsx) (Formulario de Barajas)**
    *   *Qué:* Ventana emergente para crear nuevas barajas permitiendo elegir gradientes de color visuales.
    *   *Por qué:* Facilita la segmentación de temas con estilos personalizados de manera ágil.

### 4. Arquitectura Modular (Módulo de Características - Features)
*   **[src/features/cards/](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/) (Módulo de Tarjetas)**
    *   *Qué:* Estructura modular independiente diseñada para encapsular toda la lógica de negocio, tipos, semillas y componentes visuales relacionados exclusivamente con la entidad de las tarjetas (`CardForm.tsx`, `CardItem.tsx`, `CardList.tsx`).
    *   *Por qué:* Prepara la base de código para escalar de manera organizada, aislando el dominio de tarjetas para que sea altamente reutilizable, fácil de testear y modular.
    *   *Módulos Internos Creados:*
        *   [types.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/types.ts): Modelo de datos formal de la tarjeta (`Card` y `CardDifficulty`).
        *   [seed.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/seed.ts): Datos iniciales pre-poblados organizados por temas (Programación, Redes, Hardware, Ciberseguridad).
        *   [store.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/store.ts): Almacén de estado persistente local (Zustand + middleware `persist`) que implementa las acciones CRUD principales y reserva el slot `recordResult` para la lógica de estadísticas.

---

## 🔄 Últimos Cambios Realizados (Reestructuración de Páginas)

Se llevó a cabo una importante refactorización de la arquitectura de la aplicación para simplificar la navegación, eliminar el exceso de modales y modularizar la lógica de negocio:

1. **Centralización de Rutas:** Se implementó [router.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/app/router.tsx) como el gestor único de enrutamiento y se limpió [App.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/App.tsx) para desacoplar las vistas de la raíz.
2. **HomePage con Pestañas Dinámicas:** Se fusionaron las pantallas de Dashboard, LeitnerStats y Settings en una sola página [HomePage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/pages/HomePage.tsx) mediante pestañas fluidas sincronizadas con la URL.
3. **Modo de Estudio Integrado:** Se eliminó `StudySession.tsx` e integró la interfaz interactiva de repaso en 3D directamente dentro de [FlashcardsPage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/pages/FlashcardsPage.tsx) como un estado mutable para evitar saltos innecesarios de ruta.
4. **Formularios Dedicados y Vista Previa en Vivo:** Se retiró el modal `AddCardModal.tsx` de componentes y se crearon dos páginas completas ([NewCardPage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/pages/NewCardPage.tsx) y [EditCardPage.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/pages/EditCardPage.tsx)) que integran un simulador de tarjetas 3D en tiempo real.
5. **Corrección de Indicador Activo:** Se añadió la propiedad `end` a la ruta raíz en [Sidebar.tsx](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/components/Sidebar.tsx) para evitar resaltados incorrectos al navegar entre pestañas de la página de inicio.
6. **Definición de Modelo Modular:** Se creó la definición unificada de la interfaz `Card` en el archivo [types.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/types.ts) del nuevo módulo de tarjetas.
7. **Store Persistente con Zustand:** Se implementaron [store.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/store.ts) y [seed.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/seed.ts), estableciendo el array global de tarjetas, acciones CRUD (`addCard`, `editCard`, `deleteCard`), restauración (`resetCards`) y sincronización automática con `localStorage`. Se reservó además el espacio para la función `recordResult` (estadísticas).
   
   La estructura de los archivos involucrados en este paso es:
   ```text
   src/
   └── features/
       └── cards/
           ├── types.ts   <-- Interfaz Card y CardDifficulty (Modelo de Datos)
           ├── seed.ts    <-- Datos semilla de prueba iniciales (INITIAL_SEED_CARDS)
           └── store.ts   <-- Store global de Zustand (useCardStore)
   ```

---

## 🚀 Estado de la Compilación y Ejecución

*   **Compilación de Producción:** El comando `npm run build` compila de manera exitosa sin errores de TypeScript ni de bundler, generando la carpeta optimizada de distribución `dist/`.
*   **Servidor de Desarrollo Local:** Ejecutándose en segundo plano y accesible en el puerto local predeterminado de Vite:
    👉 **[http://localhost:5173/](http://localhost:5173/)**


## Nota
* Se eligió usar Tailwind CSS v3 y aquí solo se instalaron las dependencias `react-router-dom`, `zustand`, `tailwindcss`, `lucide-react`, `clsx`, `tailwind-merge`. Los archivos de `postcss.config.js` y `tailwind.config.js` se generaron automáticamente al instalar Tailwind CSS v3. Los archivos `tsconfig.json`, `tsconfig.app.json` y `tsconfig.node.json` se generaron automáticamente al inicializar el proyecto con Vite.

* Se definió e implementó la interfaz `Card` y el tipo `CardDifficulty` en [src/features/cards/types.ts](file:///c:/Users/brand/Desktop/Flashcards-2.1/src/features/cards/types.ts) con las propiedades requeridas (`id`, `question`, `answer`, `topic`, `difficulty`, `hits`, `misses`, `createdAt`, `lastReviewedAt`). Este archivo servirá como definición compartida estándar para el equipo de desarrollo para la gestión y evolución del módulo de tarjetas. 