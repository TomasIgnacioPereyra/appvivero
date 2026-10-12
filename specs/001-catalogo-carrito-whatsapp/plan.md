# Implementation Plan: Catálogo de Vivero con Carrito y Pedido por WhatsApp

**Branch**: `001-catalogo-carrito-whatsapp` | **Date**: 2026-10-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-catalogo-carrito-whatsapp/spec.md`

## Summary

Aplicación web 100% estática (sin backend) que muestra el catálogo de productos del vivero
desde `productos.csv`, permite armar un carrito de compras con cantidades, y genera un enlace
`wa.me` hacia el WhatsApp del vivero con el pedido completo precargado. Stack: Vite +
JavaScript vanilla + CSS propio, sin dependencias de runtime. Persistencia del carrito en
`localStorage`. Despliegue estático con rutas relativas para funcionar tanto en Vercel como en
GitHub Pages.

## Technical Context

**Language/Version**: JavaScript (ES2022, módulos ESM); Node.js 20+ solo para desarrollo/build

**Primary Dependencies**: Vite (build tool, única dependencia de desarrollo). Cero dependencias
de runtime; el CSV se importa con `?raw` y se parsea con código propio.

**Storage**: `localStorage` del navegador (clave `appvivero.cart.v1`) para el carrito. El
catálogo vive en `productos.csv` (raíz del repositorio), embebido en el bundle al compilar.

**Testing**: `node --test` (runner nativo de Node, cero dependencias) para las funciones puras
(parser CSV, cálculo del carrito, generador de mensaje/URL de WhatsApp) + validación manual
guiada por `quickstart.md`.

**Target Platform**: Navegadores modernos de escritorio y móvil (Chrome, Safari, Firefox,
Edge actuales). Hosting estático: Vercel o GitHub Pages.

**Project Type**: Aplicación web frontend de un solo proyecto (estructura `src/` + `tests/`)

**Performance Goals**: Primera carga utilizable en < 5 s en 3G gama media (SC-007); bundle JS
minimalista (sin frameworks); parseo de 400 filas de CSV en < 50 ms.

**Constraints**: Sin servidor, sin APIs propias, sin service worker (offline fuera de alcance).
`base: './'` obligatorio en Vite para rutas relativas. Número de WhatsApp en un único archivo
de configuración. UI en español (ARS, es-AR).

**Scale/Scope**: ~400 productos, un vivero, tráfico de bajo volumen. UI: 1 página (catálogo +
carrito deslizable/expandible).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cumplimiento |
|-----------|--------------|
| I. Solo Frontend, Sin Backend | ✅ Sin backend; pedido vía enlace `wa.me`; sin secretos (solo número de contacto público). |
| II. Catálogo desde CSV | ✅ `productos.csv` raíz es la única fuente; import `?raw`; sin productos hardcodeados. |
| III. Mobile-First | ✅ Layout responsivo desde 320px; controles ≥44px; flujo ≤3 min. |
| IV. Simplicidad (YAGNI) | ✅ Vite + JS vanilla + CSS; única dependencia: Vite (dev). Tests con `node --test` sin dependencias. |
| V. Verificación antes de Publicar | ✅ `npm run build` + `npm test` + validación manual (quickstart.md); aviso si el número no está configurado. |

**Resultado**: PASA — sin violaciones que justificar (Complexity Tracking vacío).

## Project Structure

### Documentation (this feature)

```text
specs/001-catalogo-carrito-whatsapp/
├── plan.md              # Este archivo
├── research.md          # Fase 0: decisiones técnicas
├── data-model.md        # Fase 1: entidades y reglas
├── quickstart.md        # Fase 1: guía de validación end-to-end
├── contracts/
│   ├── catalogo-csv.md      # Contrato del formato del CSV
│   └── pedido-whatsapp.md   # Contrato del mensaje y enlace wa.me
├── checklists/
│   └── requirements.md  # Calidad de la spec (creado en /speckit.specify)
└── tasks.md             # Fase 2 (/speckit.tasks — NO creado aquí)
```

### Source Code (repository root)

```text
index.html               # Shell HTML (monta la app)
package.json             # Scripts: dev, build, preview, test
vite.config.js           # Vite con base: './'
productos.csv            # Catálogo (fuente única de verdad)
src/
├── main.js              # Punto de entrada: carga catálogo, wiring de UI y eventos
├── config.js            # Configuración editable: número WhatsApp, nombre del vivero
├── styles.css           # Estilos mobile-first
├── lib/
│   ├── csv.js           # parseCatalog(texto CSV) → productos[]
│   ├── format.js        # formatARS(precio) → "$ 22.880"
│   ├── cart.js          # Estado del carrito (puro) + persistencia localStorage
│   └── whatsapp.js      # Mensaje del pedido + URL wa.me
└── ui/
    └── render.js        # Render del catálogo y del carrito (DOM, sin framework)
tests/
├── csv.test.js          # Parser: filas válidas, vacías, malformadas, acentos
├── cart.test.js         # Acumulación, límites 1..99, quitar, total
└── whatsapp.test.js     # Mensaje completo y URL codificada
.github/
└── workflows/
    └── deploy.yml       # Publicación automática a GitHub Pages (opcional Vercel)
```

**Structure Decision**: proyecto único estilo aplicación web estática: código en `src/`
(módulos puros en `src/lib/` para testear sin DOM, UI en `src/ui/`), tests en `tests/` con el
runner nativo de Node, catálogo en la raíz para que el dueño lo edite sin entrar a `src/`.

## Complexity Tracking

> Sin violaciones a la constitución. Sección intencionalmente vacía.
