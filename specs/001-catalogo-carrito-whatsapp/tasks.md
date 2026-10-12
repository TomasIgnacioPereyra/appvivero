---
description: "Task list: catálogo de vivero con carrito y pedido por WhatsApp"
---

# Tasks: Catálogo de Vivero con Carrito y Pedido por WhatsApp

**Input**: Design documents from `/specs/001-catalogo-carrito-whatsapp/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos (constitución V exige `npm test` antes de publicar; research.md D9 — `node --test`, cero dependencias).

**Organization**: Tareas agrupadas por user story para implementación y prueba independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: User story asociada (US1..US5)
- Cada tarea incluye la ruta exacta del archivo

## Path Conventions

Proyecto único: `src/`, `tests/` en la raíz del repositorio (ver plan.md, Structure Decision).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto y estructura básica

- [X] T001 Crear `package.json` con `"type": "module"`, devDependency Vite y scripts `dev`, `build`, `preview`, `test` (`node --test tests/`)
- [X] T002 [P] Crear `vite.config.js` con `base: './'` (rutas relativas, requisito de doble hosting — research D8)
- [X] T003 [P] Crear `index.html`: shell HTML en español, `<div id="app">`, título del vivero, importa `src/main.js` y `src/styles.css`
- [X] T004 [P] Crear `src/config.js` con `SHOP_NAME` y `WHATSAPP_NUMBER = ''` (placeholder documentado, única fuente del número — FR-011)
- [X] T005 [P] Crear `.gitignore` (node_modules/, dist/, .opencode/) y ejecutar `git init`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Lógica pura y hoja de estilos base que TODAS las historias necesitan

**⚠️ CRITICAL**: Ninguna user story comienza hasta completar esta fase

- [X] T006 Implementar `parseCatalog(csvText)` en `src/lib/csv.js` según `contracts/catalogo-csv.md`: separador `;`, ignora encabezado, líneas vacías y filas <3 campos; `trim()` de campos; normaliza precio (`.`=miles, `,`=decimales); descarta precio no numérico o ≤0; producto = `{categoria, nombre, precio}`; identidad `categoria|nombre` (data-model.md)
- [X] T007 [P] Implementar `formatARS(precio)` en `src/lib/format.js` con `Intl.NumberFormat('es-AR', {style:'currency', currency:'ARS', maximumFractionDigits:0})` (research D4)
- [X] T008 [P] Implementar `src/lib/cart.js` (funciones puras + persistencia — research D5): `addItem(items, producto, cantidad)` acumula en misma identidad, `setQuantity(items, id, cantidad)` acota 1..99 (FR-016), `removeItem(items, id)`, `cartTotal(items)`, `cartCount(items)`, `loadCart(storage)`/`saveCart(storage, items)` con clave `appvivero.cart.v1`, parseo defensivo y degradación silenciosa si storage no disponible
- [X] T009 [P] Implementar `src/lib/whatsapp.js` (research D6, `contracts/pedido-whatsapp.md`): `buildOrderMessage(items, total, shopName)` con plantilla exacta (saludo, `• {cantidad} × {nombre} — {subtotal}`, blanco, `Total:`) y `buildWhatsAppUrl(numero, mensaje)` → `https://wa.me/<solo-digitos>?text=<encodeURIComponent>`; `isNumberConfigured(numero)` (≥8 dígitos)
- [X] T010 [P] Crear `tests/csv.test.js` (node:test): filas válidas, encabezado, línea vacía, <3 campos, precio vacío/no numérico/≤0, formatos `22880` y `22.880`, acentos/Ñ, mismo nombre en dos categorías
- [X] T011 [P] Crear `tests/cart.test.js` (node:test): acumulación en misma línea (FR-006), clamp 1..99, quitar a 0 elimina, totales y contador, persistencia con storage fake, degradación sin storage
- [X] T012 [P] Crear `tests/whatsapp.test.js` (node:test): mensaje exacto del ejemplo del contrato, orden de ítems, subtotales/total formateados es-AR, URL solo dígitos + texto percent-encoded, `isNumberConfigured` (vacío/7 dígitos → false)
- [X] T013 [P] Crear `src/styles.css`: base mobile-first (desde 320px, targets ≥44px — FR-015), variables de color simples, tipografía legible

**Checkpoint**: `npm install` + `npm test` pasan; la fundación está lista

---

## Phase 3: User Story 1 - Explorar el catálogo (Priority: P1) 🎯 MVP

**Goal**: Catálogo completo agrupado por categoría, con búsqueda y filtro

**Independent Test**: quickstart V1 + V2 sobre `npm run preview`

- [X] T014 [US1] Implementar render del catálogo en `src/ui/render.js`: agrupa por categoría preservando orden del CSV, tarjeta simple por producto (nombre + precio `formatARS`) y contador de productos por categoría (FR-001/002)
- [X] T015 [US1] Implementar búsqueda en `src/main.js` + `src/ui/render.js`: normalización sin mayúsculas ni acentos (NFD + strip diacríticos), filtra por subcadena del nombre (FR-003)
- [X] T016 [US1] Implementar chips de filtro por categoría con opción "Todas" en `src/ui/render.js`; combinable con búsqueda (FR-004)
- [X] T017 [US1] Estado "sin resultados" claro (no pantalla vacía) cuando búsqueda+filtro no arrojan productos (FR-003, edge case)
- [X] T018 [US1] Montar wiring inicial en `src/main.js`: importar `productos.csv?raw` desde la raíz, `parseCatalog`, render inicial, listeners de buscador y filtros

**Checkpoint**: catálogo navegable de punta a punta (MVP si se detuviera aquí)

---

## Phase 4: User Story 2 - Armar el carrito (Priority: P1)

**Goal**: Agregar productos con cantidad, ver/editar/quitar ítems y totales

**Independent Test**: quickstart V3 sobre `npm run preview`

- [X] T019 [US2] Agregar control de cantidad por producto (input numérico default 1) y botón "Agregar" (≥44px) en las tarjetas de `src/ui/render.js` (FR-005)
- [X] T020 [US2] Implementar panel del carrito en `src/ui/render.js` (deslizable/sección en móvil): lista de ítems con cantidad editable (+/−), quitar, vaciar, subtotal por ítem y total general (FR-007/008)
- [X] T021 [US2] Implementar contador/badge de ítems en el encabezado y estado vacío comprensible con acceso al catálogo (FR-008, edge case)
- [X] T022 [US2] Conectar eventos del carrito en `src/main.js` usando las funciones puras de `src/lib/cart.js` (acumulación FR-006, clamp 1..99 FR-016) y re-render tras cada mutación

**Checkpoint**: carrito funcional completo; US1 sigue funcionando

---

## Phase 5: User Story 3 - Enviar pedido por WhatsApp (Priority: P1)

**Goal**: Cerrar el flujo abriendo WhatsApp con el pedido completo precargado

**Independent Test**: quickstart V4 (con número de prueba y con placeholder)

- [X] T023 [US3] Implementar botón "Enviar pedido por WhatsApp" en `src/ui/render.js`: deshabilitado con carrito vacío (FR-009) y cuando `WHATSAPP_NUMBER` no está configurado (FR-012), con advertencia persistente visible en ese caso
- [X] T024 [US3] Implementar acción de envío en `src/main.js`: `buildOrderMessage` + `buildWhatsAppUrl` de `src/lib/whatsapp.js`, apertura con `window.open(url, '_blank', 'noopener')`; el carrito NO se vacía automáticamente (data-model.md, estados del carrito)
- [X] T025 [US3] Verificar el mensaje generado contra el ejemplo exacto del contrato `contracts/pedido-whatsapp.md` (2×ACACIA + 1×ALOE → total `$ 48.490`)

**Checkpoint**: flujo completo catálogo → carrito → WhatsApp operativo

---

## Phase 6: User Story 4 - Conservar el carrito entre visitas (Priority: P2)

**Goal**: Persistencia local del carrito entre recargas y visitas

**Independent Test**: quickstart V5

- [X] T026 [US4] Integrar en `src/main.js` la carga inicial del carrito (`loadCart(localStorage)`) y el guardado tras cada mutación (`saveCart`), tolerancia a datos corruptos (data-model.md — Persistencia)

**Checkpoint**: US1–US3 siguen funcionando con carrito persistente

---

## Phase 7: User Story 5 - Actualizar el catálogo sin tocar código (Priority: P3)

**Goal**: El dueño edita `productos.csv` y republica; nada hardcodeado

**Independent Test**: quickstart V6

- [X] T027 [US5] Confirmar la importación `?raw` de `productos.csv` raíz en `src/main.js` (sin copias en `public/` ni datos en código) y escribir en `README.md` la guía breve del dueño: cambiar número de WhatsApp en `src/config.js`, actualizar precios/productos en `productos.csv`, republicar

**Checkpoint**: cambio de precio en CSV se refleja tras rebuild, sin editar código

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T028 [P] Crear `.github/workflows/deploy.yml`: build con Node 20+, `npm ci`, `npm test`, `npm run build`, deploy a GitHub Pages (artefacto `dist`), disparado por push a `main`
- [X] T029 Ejecutar la validación completa de `specs/001-catalogo-carrito-whatsapp/quickstart.md` (V1–V7) sobre `npm run preview` y corregir lo que falle
- [X] T030 Ejecutar `npm test` y `npm run build` finales sin errores; marcar las tareas completadas en este archivo

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de T001 (package.json); BLOQUEA todas las historias
- **User Stories (Phase 3–7)**: dependen de la fase 2. US1 primero; US2/US3/US4/US5 son incrementales sobre US1 (comparten `render.js`/`main.js`, por eso no se marcan [P] entre historias)
- **Polish (Phase 8)**: depende de todas las historias deseadas

### Parallel Opportunities

- T002–T005 en paralelo (Setup)
- T006–T013 en gran parte en paralelo (funciones puras y tests son archivos independientes)
- T028 en paralelo con la validación final (archivo independiente)

---

## Parallel Example: Foundational

```text
Task: "Implementar src/lib/format.js (T007)"
Task: "Implementar src/lib/cart.js (T008)"
Task: "Implementar src/lib/whatsapp.js (T009)"
Task: "Crear tests/csv.test.js (T010)"
Task: "Crear tests/cart.test.js (T011)"
Task: "Crear tests/whatsapp.test.js (T012)"
```

---

## Implementation Strategy

### MVP First

1. Fases 1–2 (Setup + Foundational) → `npm test` verde
2. US1 (Phase 3) → validar V1/V2 → ya es demostrable
3. US2 + US3 (Phases 4–5) → flujo completo validar V3/V4 ← núcleo del producto
4. US4 + US5 (Phases 6–7) → persistencia y mantenibilidad por el dueño
5. Polish (Phase 8) → deploy + quickstart completo

### Notas

- Commitear (cuando el usuario lo pida) después de cada fase lógica
- Detenerse en cada checkpoint para validar la historia de forma independiente con `quickstart.md`
- El orden de prioridad de las historias es P1 (US1–US3) → P2 (US4) → P3 (US5)
