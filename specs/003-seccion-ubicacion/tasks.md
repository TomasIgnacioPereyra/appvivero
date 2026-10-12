---
description: "Tasks: sección de ubicación 003"
---

# Tasks: Sección de Ubicación

**Input**: `specs/003-seccion-ubicacion/spec.md`

## Phase 1: Configuración y estructura

- [X] T001 Agregar `SHOP_LOCALITY`, `SHOP_ADDRESS` (vacía, pendiente) y `MAPS_URL` a `src/config.js` con comentarios de edición
- [X] T002 Agregar enlace "Ubicación" a la navegación en `index.html`
- [X] T003 Crear sección `#ubicacion` en `index.html` (info + mapa + fallback + nota), antes de contacto/footer, reutilizando clases del sistema (section-head, btn, link-arrow)

## Phase 2: Estilos y comportamiento

- [X] T004 Estilos de la sección en `src/styles.css` (paleta, tarjetas, grilla 1 col móvil / 2 col escritorio, mapa con altura adecuada, fallback decorativo, sin overflow)
- [X] T005 Wiring en `src/main.js`: textos de localidad, dirección condicional, hrefs de ambos enlaces, src del iframe derivado de `SHOP_LOCALITY` (output=embed), carga diferida
- [X] T006 Test de sanidad `tests/config.test.js` (localidad no vacía; MAPS_URL https de Google Maps; SHOP_ADDRESS string)

## Phase 3: Validación

- [X] T007 `npm test` + `npm run build`
- [X] T008 Validación en navegador: enlaces (href/target/rel), iframe carga (sin errores de consola), 320px sin overflow, capturas móvil/escritorio
- [X] T009 README: documentar dónde editar la dirección exacta cuando se confirme
