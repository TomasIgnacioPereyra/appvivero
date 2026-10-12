# Research: Catálogo de Vivero con Carrito y Pedido por WhatsApp

**Phase 0** — Decisiones técnicas que resuelven el contexto del plan. Estado: completo.

## D1. Build tool y stack

- **Decision**: Vite + JavaScript vanilla + CSS propio. Cero dependencias de runtime.
- **Rationale**: build instantáneo, salida estática trivial de publicar en Vercel y GitHub
  Pages, sin framework que mantener (constitución IV). Node 24 ya está instalado en el equipo.
- **Alternatives considered**: React + Vite (más peso y dependencias sin necesidad para una
  sola página con estado simple); HTML/CSS/JS sin build (no permite importar el CSV al bundle
  ni minificar; elegido por el usuario Vite+vanilla).

## D2. Lectura del CSV manteniendo una sola fuente de verdad

- **Decision**: importar `productos.csv` (raíz del repo) con la directiva `?raw` de Vite y
  parsearlo en el navegador con un parser propio en `src/lib/csv.js`.
- **Rationale**: evita duplicar el archivo en `public/` y elimina problemas de rutas relativas
  (`base: './'`) al embeber el contenido en el bundle; 400 filas se parsean en milisegundos.
- **Alternatives considered**: `fetch('productos.csv')` desde `public/` (requiere copia del
  archivo → dos fuentes de verdad, y sensible al base path); script Node que convierte
  CSV→JSON en build (complejidad extra de tooling); PapaParse (dependencia innecesaria para un
  formato fijo y simple).

## D3. Parser CSV tolerante

- **Decision**: parser propio que: separa por `;`, ignora la fila de encabezado, ignora líneas
  vacías o con menos de 3 campos, hace `trim()` de cada campo, normaliza precio
  (`.` = miles se eliminan, `,` = decimales) y descarta filas cuyo precio no sea numérico > 0.
- **Rationale**: el CSV se edita a mano en una planilla; la tolerancia evita que un error de
  tipeo rompa todo el sitio (FR spec, edge cases).
- **Alternatives considered**: parser estricto (un error tira toda la carga); regex complejas
  (frágiles); librería externa (YAGNI).

## D4. Formato de moneda

- **Decision**: `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })`.
- **Rationale**: formato nativo del navegador, sin dependencias, salida esperada `$ 22.880`,
  consistente con SC y FR-002.
- **Alternatives considered**: formateo manual con regex (reimplementar Intl sin ventaja).

## D5. Estado del carrito y persistencia

- **Decision**: estado en memoria como array de ítems (`{ categoria, nombre, precio, cantidad }`),
  funciones puras para mutarlo (`addItem`, `setQuantity`, `removeItem`, `cartTotal`), y
  persistencia en `localStorage` (`appvivero.cart.v1`) con carga/guardado explícitos. La
  identidad de un ítem es `categoria|nombre`.
- **Rationale**: funciones puras = testeables con `node --test` sin DOM; acumulación de
  cantidades y recálculo de totales simples y verificables (FR-006, FR-008, FR-013).
- **Alternatives considered**: clase con observers (abstracción prematura); IndexedDB (excesivo
  para ~50 ítems); cookies (no aplica).

## D6. Enlace y mensaje de WhatsApp

- **Decision**: mensaje de texto plano multilínea generado con un template fijo
  (saludo + `• {cantidad} × {nombre} — {subtotal}` por ítem + `Total: {total}`), y URL
  `https://wa.me/<número>?text=<encodeURIComponent(mensaje)>`. El número se normaliza a solo
  dígitos.
- **Rationale**: `wa.me` es el mecanismo oficial sin API ni backend; funciona en móvil (app) y
  escritorio (WhatsApp Web), cumple FR-010 y el principio I.
- **Alternatives considered**: `whatsapp://send` (menos universal en escritorio); API de
  WhatsApp Business (requiere backend y credenciales → prohibido por constitución I).

## D7. Configuración del número

- **Decision**: `src/config.js` exporta `WHATSAPP_NUMBER` (string, placeholder vacío por
  defecto) y `SHOP_NAME`. Si `WHATSAPP_NUMBER` está vacío o tiene menos de 8 dígitos, la UI
  muestra un aviso y deshabilita el botón de envío (FR-012).
- **Rationale**: un solo lugar para editar, en texto plano y con comentarios; cumple FR-011 y
  principio V (no publicar con placeholder silencioso).
- **Alternatives considered**: variable de entorno `VITE_*` (menos descubrible para el dueño);
  input editable en la UI (complejidad y riesgo de error).

## D8. Rutas relativas para doble hosting

- **Decision**: `base: './'` en `vite.config.js`; sin router (una sola página); sin rutas
  absolutas a assets.
- **Rationale**: la misma compilación funciona en la raíz de Vercel y en un subdirectorio de
  GitHub Pages (`usuario.github.io/repo/`) sin recompilar (FR-014, restricciones técnicas).
- **Alternatives considered**: `base` por variable de entorno (dos pipelines distintos,
  innecesario).

## D9. Testing sin dependencias

- **Decision**: `node --test` sobre funciones puras (csv, cart, whatsapp, format) y validación
  manual end-to-end con `quickstart.md` sobre `npm run build && npm run preview`.
- **Rationale**: cero dependencias de test; cubre la lógica donde se concentran los riesgos
  (parseo, totales, encoding del mensaje) y respeta la constitución V.
- **Alternatives considered**: Vitest (agrega dependencia; solo aportaría DOM testing, que aquí
  se cubre con validación manual); Playwright (excesivo para v1).
