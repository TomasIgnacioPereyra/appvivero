# Quickstart: Validación manual end-to-end

**Feature**: 001-catalogo-carrito-whatsapp | Prerrequisito: Node.js 20+ y `npm`.

## Preparación

```powershell
npm install        # instala Vite (única dependencia de desarrollo)
npm test           # tests unitarios (node --test): csv, cart, whatsapp, format
npm run dev        # desarrollo en http://localhost:5173
```

Para validar sobre la aplicación compilada (obligatorio antes de publicar, constitución V):

```powershell
npm run build      # debe terminar sin errores
npm run preview    # sirve dist/ con rutas relativas, como en producción
```

## Escenarios de validación (mapeados a la spec)

### V1 — Catálogo completo (US1, FR-001/002, SC-003)

1. Abrir la página.
2. Verificar que aparecen los 10 grupos de categorías (ÁRBOLES … TREPADORAS Y APOYANTES).
3. Contar los productos visibles y compararlo con las filas válidas de `productos.csv`
   (399 al 2026-10-11).
4. Verificar precios con formato `$ 22.880` (punto de miles, sin decimales).

### V2 — Búsqueda y filtro (US1, FR-003/004, SC-001)

1. Escribir `pezuña` en el buscador → aparecen "PEZUÑA DE VACA LILA/ROSADA 7LT".
2. Escribir `ALOE` en minúsculas → coincide "ALOE VERA M14 CULTIVO".
3. Escribir `zzzz` → mensaje "sin resultados" claro.
4. Seleccionar categoría `SUCULENTAS` → solo productos de esa categoría; volver a "Todas".

### V3 — Carrito (US2, FR-005 a FR-009, FR-016)

1. Agregar `ACACIA BLANCA C/COPA 15LT` cantidad 2 → contador del carrito = 2.
2. Agregarlo de nuevo con cantidad 1 → misma línea con cantidad 3.
3. Subir la cantidad a 99 y intentar 100 → se acota en 99.
4. Quitar el ítem → carrito vacío con estado comprensible.

### V4 — Envío por WhatsApp (US3, FR-010/012, SC-004)

1. Con el número placeholder (vacío) en `src/config.js`: verificar la advertencia y el botón
   deshabilitado.
2. Poner un número de prueba en `src/config.js` y recargar.
3. Armar carrito: 2 × ACACIA BLANCA C/COPA 15LT + 1 × ALOE VERA M14 CULTIVO.
4. Tocar "Enviar pedido por WhatsApp" → se abre WhatsApp con el mensaje del contrato
   `contracts/pedido-whatsapp.md` (subtotales `$ 45.760` y `$ 2.730`, total `$ 48.490`).
5. Verificar destinatario = número configurado y que cantidades/nombres coinciden con el
   carrito. Con carrito vacío, el botón no está disponible.

### V5 — Persistencia (US4, FR-013, SC-005)

1. Armar un carrito y recargar la página → el carrito persiste.
2. Vaciar el carrito y recargar → sigue vacío.
3. (Opcional) Verificar la clave `appvivero.cart.v1` en DevTools → Application → Local Storage.

### V6 — Catálogo actualizable sin código (US5, SC-006)

1. Editar un precio en `productos.csv` (ej.: ACACIA BLANCA → `30000`).
2. `npm run build` y `npm run preview` → el precio nuevo se muestra.
3. Agregar una línea malformada (`ARBOLES;SOLO DOS CAMPOS`) → se ignora sin romper el sitio.
4. Revertir el CSV de prueba.

### V7 — Móvil (US1/US2, FR-015, SC-002/007)

1. DevTools → modo dispositivo (ej.: 360×800, y probar 320px).
2. Verificar: sin scroll horizontal, botones cómodos (≥44px), texto legible.
3. Cronometrar el flujo completo (buscar producto → agregar 3 ítems → enviar): < 3 min.

## Criterio de aprobación

Todos los escenarios V1–V7 pasan sobre `npm run preview` (build de producción), y
`npm test` + `npm run build` terminan sin errores. Recién entonces se publica (constitución V).
