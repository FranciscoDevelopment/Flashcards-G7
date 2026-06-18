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
│       ├── App.tsx
│       ├── index.css
│       ├── App.css
│       ├── main.tsx
│       ├── types/
│       │   └── index.ts
│       ├── utils/
│       │   └── leitner.ts
│       ├── store/
│       │   └── useDeckStore.ts
│       ├── components/
│       │   ├── Sidebar.tsx
│       │   ├── DeckCard.tsx
│       │   ├── Flashcard.tsx
│       │   ├── CreateDeckModal.tsx
│       │   └── AddCardModal.tsx
│       └── pages/
│           ├── Dashboard.tsx
│           ├── DeckDetails.tsx
│           ├── StudySession.tsx
│           ├── LeitnerStats.tsx
│           └── Settings.tsx
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

### 2. Estructura de Navegación y Páginas
*   **[src/components/Sidebar.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/Sidebar.tsx) (Navegación e Indicadores)**
    *   *Qué:* Barra lateral de navegación con contador dinámico de tarjetas que requieren revisión. Adaptable para pantallas móviles.
    *   *Por qué:* Mantiene al usuario informado sobre su volumen de estudio pendiente desde cualquier punto de la aplicación.
*   **[src/pages/Dashboard.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/Dashboard.tsx) (Panel General)**
    *   *Qué:* Visualiza métricas generales (tarjetas totales, pendientes, índice de acierto) y la cuadrícula de barajas disponibles.
    *   *Por qué:* Ofrece una pantalla de entrada visualmente atractiva donde el usuario puede ver su progreso de estudio general de un vistazo rápido.
*   **[src/pages/DeckDetails.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/DeckDetails.tsx) (Administrador de Barajas)**
    *   *Qué:* Muestra la información de una baraja y la lista detallada de tarjetas con buscadores y opciones de manipulación (editar/eliminar).
    *   *Por qué:* Permite al estudiante gestionar el contenido de su baraja de manera precisa antes de entrar a las sesiones de estudio.
*   **[src/pages/StudySession.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/StudySession.tsx) (Entorno de Estudio)**
    *   *Qué:* Pantalla interactiva que selecciona el mazo de repaso (tarjetas vencidas primero). Soporta atajos de teclado (`Espacio` para voltear, `1`/`Flecha Izquierda` para fallada, `2`/`Flecha Derecha` para acertada).
    *   *Por qué:* Optimiza la fricción de estudio del usuario mediante teclado para sesiones rápidas y ágiles, y muestra métricas inmediatas al terminar.
*   **[src/pages/LeitnerStats.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/LeitnerStats.tsx) (Análisis Cognitivo)**
    *   *Qué:* Gráfico interactivo y explicaciones detalladas de la distribución de cartas entre las 5 cajas de memoria.
    *   *Por qué:* Ayuda al usuario a entender qué tan profundo se ha guardado la información en su memoria a largo plazo.
*   **[src/pages/Settings.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/pages/Settings.tsx) (Ajustes y Respaldos)**
    *   *Qué:* Funcionalidades para exportar datos completos a archivos `.json` locales, restaurar respaldos y reiniciar la base de datos de prueba.
    *   *Por qué:* Protege el esfuerzo del estudiante al permitirle guardar de forma física sus tarjetas y moverlas de dispositivo.

### 3. Componentes y Modales Interactivos
*   **[src/components/Flashcard.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/Flashcard.tsx) (Tarjeta 3D)**
    *   *Qué:* Tarjeta de estudio con animaciones realistas de volteo en 3D basadas en CSS de perspectiva.
    *   *Por qué:* Brinda un impacto visual "premium" y gamificado que imita las tarjetas físicas reales.
*   **[src/components/CreateDeckModal.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/CreateDeckModal.tsx) (Formulario de Barajas)**
    *   *Qué:* Ventana emergente para crear nuevas barajas permitiendo elegir gradientes de color visuales.
    *   *Por qué:* Facilita la segmentación de temas con estilos personalizados.
*   **[src/components/AddCardModal.tsx](file:///C:/Users/brand/Desktop/Flashcards-2.1/src/components/AddCardModal.tsx) (Formulario de Cartas)**
    *   *Qué:* Modal unificado que gestiona la creación y edición de cartas individuales (frente/dorso).
    *   *Por qué:* Reutiliza lógica y diseño para evitar duplicidad de código al añadir o modificar tarjetas.

---

## 🚀 Estado de la Compilación y Ejecución

*   **Compilación de Producción:** El comando `npm run build` compila de manera exitosa sin errores de TypeScript ni de bundler, generando la carpeta optimizada de distribución `dist/`.
*   **Servidor de Desarrollo Local:** Ejecutándose en segundo plano y accesible en el puerto local predeterminado de Vite:
    👉 **[http://localhost:5173/](http://localhost:5173/)**


## Nota
* se eligio usar Tailwind CSS v3 y aqui solo se instalaron las dependencias  react-router-dom,
zustand, tailwindcss, lucide-react, clsx, tailwind-merge.  los archivos de postcss.config.js y tailwind.config.js se generaron automaticamente al instalar Tailwind CSS v3. los archivostsconfig.json, tsconfig.app.json y tsconfig.node.json se generaron automaticamente al inicializar el proyecto con Vite. 