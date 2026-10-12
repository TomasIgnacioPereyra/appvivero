---
description: "Tasks: rediseño visual 002"
---

# Tasks: Rediseño Visual — Catálogo Profesional de Plantas

**Input**: `specs/002-rediseno-visual/spec.md` + pedido de rediseño del usuario

**Prerequisites**: Constitución v1.0.0, spec 001 y contratos existentes (intactos)

## Phase 1: Imágenes y recursos

- [X] T001 Verificar disponibilidad de Google Fonts (Fraunces + Manrope) con fallback
- [X] T002 Descargar y revisar visualmente candidatas de imagen (hero + 10 categorías) para asignación correcta
- [X] T003 Crear `src/data/images.js` (mapeo por categoría/producto, prioridad local vía `public/`, URL verificadas)
- [X] T004 Crear `tests/images.test.js` (toda categoría del CSV real tiene imagen; fallback a null; alt no vacío)

## Phase 2: Estructura y estilos

- [X] T005 Reescribir `index.html`: cabecera (marca + nav + carrito + menú móvil), hero, catálogo, vivero, consejos, contacto, footer, drawer y toast (mismos IDs funcionales)
- [X] T006 Reescribir `src/styles.css`: paleta obligatoria, fuentes con fallback, grillas responsive, tarjetas, chips, drawer, a11y (foco, reduced motion) y sin scroll horizontal a 320px
- [X] T007 Ampliar `src/config.js` con textos opcionales editables (presentación) sin duplicar nombre/número

## Phase 3: Render y comportamiento

- [X] T008 Actualizar `src/ui/render.js`: tarjetas con imagen (lazy + placeholder), categoría, precio y estado "Agregado"; chips; carrito con miniaturas y acciones (seguir comprando); estados vacíos
- [X] T009 Actualizar `src/main.js`: menú móvil, total en cabecera, solo re-renderizar lo necesario al agregar, estado visual del botón, focus/scroll-lock del drawer, enlaces de contacto, aviso de configuración
- [X] T010 Verificar contrato WhatsApp intacto (tests existentes) y validación de número no configurado

## Phase 4: Validación

- [X] T011 `npm test` + `npm run build` sin errores
- [X] T012 Validación E2E en navegador: carga de imágenes/placeholder, búsqueda, filtros, cantidades, subtotales, total, persistencia, mensaje de WhatsApp, aviso sin número
- [X] T013 Revisión responsive (320px, móvil, tablet, escritorio) + capturas
- [X] T014 Mantener visible el acceso flotante al carrito en la parte inferior en móvil, respetando el área segura y sin cubrir contenido.
