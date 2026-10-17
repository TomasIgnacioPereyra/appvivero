# AGENTS.md — AppVivero

Guía para asistentes de IA (Claude Code, Codex, Cursor, Gemini CLI, Copilot CLI) que trabajen en este
repositorio. Los principios vinculantes son los de `.specify/memory/constitution.md`: si algo acá
contradice la constitución, manda la constitución.

## Qué es este proyecto

Catálogo online de un vivero con carrito de compras: el cliente arma su pedido y lo envía por WhatsApp.
Es un sitio **100% estático**: sin servidor propio, sin base de datos, sin API propia, sin secretos.

- **Stack:** Vite + JavaScript vanilla + CSS propio (mobile-first). Única dependencia: Vite.
- **Runtime:** Node.js 20+ (el CI usa 22).
- **Despliegue:** hosting estático en Vercel o GitHub Pages (workflow en `.github/workflows/deploy.yml`,
  se dispara con push a `main` y corre `npm ci && npm test && npm run build`).
- **Metodología:** Spec-Driven Development con spec-kit. Cada feature vive en `specs/NNN-nombre/`.
- **Idioma:** interfaz, comentarios y documentación en español (Argentina); moneda ARS con formato `es-AR`.

## Comandos

```bash
npm install                       # dependencias de desarrollo
npm run dev                       # servidor local en http://localhost:5173
npm test                          # toda la suite (node --test)
node --test tests/csv.test.js     # un solo archivo de tests
npm run build                     # compila a dist/
npm run preview                   # sirve dist/ como en producción
```

## Estructura

```text
productos.csv        Catálogo: única fuente de verdad de productos y precios
public/images/       Fotos por producto: public/images/<ID>.jpg (ID = columna ID del CSV)
index.html           Shell de la app
src/config.js        Número de WhatsApp, nombre del vivero, textos, localidad, dirección, Maps
src/main.js          Punto de entrada: carga el catálogo, conecta eventos, orquesta el render
src/styles.css       Estilos mobile-first
src/lib/             Lógica pura y testeable (sin DOM)
  csv.js             Parser del CSV, parsePrice, productId
  cart.js            Carrito: agregar, cantidad, quitar, totales, localStorage
  format.js          formatARS
  whatsapp.js        Mensaje del pedido y enlace wa.me
src/ui/render.js     Render del catálogo, categorías y carrito; escapeHtml, filterProducts
src/data/images.js   Fotos por ID (localImageSrc/getProductImage), por categoría, hero y presentación
tests/               Tests unitarios (espejan src/lib y config)
specs/               Spec, plan, tareas, contratos y validación (spec-kit)
.specify/            Constitución, plantillas, scripts y registro de la feature activa
.github/agents/      Agentes de VS Code del repo (beast-mode.agent.md)
```

## Contrato de datos: `productos.csv`

- Es la **única** fuente de productos y precios. No hay (ni debe haber) productos hardcodeados en el código.
- Formato: UTF-8, encabezado `CATEGORIA;PRODUCTO;PRECIO;ID`. Separador `;` (recomendado) o `,`
  (tolerado: es lo que escriben Excel/LibreOffice al guardar; el parser lo detecta solo).
- `ID`: entero > 0 autoincremental desde 1 en el orden de las filas. Es un dato de referencia; la app
  sigue identificando productos con `productId` = `categoria|nombre`.
- Se importa como texto (`import csvRaw from '../productos.csv?raw'`) y se parsea en `src/lib/csv.js`.
- Tolerancia: se ignoran encabezado, líneas vacías, filas con menos de 4 campos, ids no enteros o ≤ 0,
  precios no numéricos o negativos; el precio `0` es válido; los separadores extra dentro del nombre se
  conservan; los duplicados quedan una sola vez (gana la primera); se acepta BOM, saltos `\n` o `\r\n`,
  separador `;` o `,` y campos entrecomillados (`"`).
- Los precios pueden venir en formato argentino (`2.730,50`): siempre pasan por `parsePrice`.
- **Fotos:** cada `ID` puede tener su foto en `public/images/<ID>.jpg`. La app la busca por ID
  (`localImageSrc` en `src/data/images.js`) y, si falta, cae al override/categoría y luego al
  placeholder. Autoría y licencias: `CREDITOS-IMAGENES.md`.

## Convenciones de código

- ES modules, 2 espacios de indentación, comillas simples, punto y coma.
- Cada archivo arranca con un comentario de una línea (en español) que describe su responsabilidad.
- Nombres de dominio en español (`producto`, `categoria`, `precio`, `carrito`). No renombres identificadores
  existentes por preferencia estilística.
- Las reglas de negocio (CSV, precios, carrito, mensaje de WhatsApp) van en `src/lib/*` como funciones puras,
  sin DOM, exportadas y cubiertas por tests. El DOM solo en `src/ui/render.js`; el wiring de eventos, en `src/main.js`.
- Nunca insertes datos en el DOM sin pasar por `escapeHtml`.
- No agregues frameworks de UI, librerías de estado ni dependencias sin justificarlo por escrito (YAGNI).
- Textos visibles al cliente: español de Argentina, claros, sin jerga técnica.

## Principios no negociables

1. **Solo frontend.** Sin backend, base de datos, API propia, cookies ni analítica externa. Lo que requiera
   backend se rechaza o se resuelve con una alternativa estática documentada.
2. **CSV como fuente única.** Productos y precios solo en `productos.csv`.
3. **Mobile-first.** Flujo catálogo → carrito → WhatsApp completable en menos de 3 minutos en un celular,
   objetivos táctiles ≥44px.
4. **Simplicidad (YAGNI).** Sin abstracciones prematuras ni funcionalidad fuera de la spec vigente.
5. **Verificación antes de publicar.** `npm test` y `npm run build` deben pasar.

## Flujo de trabajo

- Cambio chico (bug, copy, estilo, dato, refactor local): implementar directo.
- Feature o cambio de comportamiento: seguir spec-kit (specify → clarify → plan → tasks → implement),
  creando `specs/NNN-nombre/` a partir de `.specify/templates/`. La feature activa está registrada en
  `.specify/feature.json`; las plantillas están en `.specify/templates/` y los scripts en
  `.specify/scripts/powershell/` (los comandos spec-kit locales, si existen, están en
  `.opencode/commands/`, que está ignorado por git). Mantené `tasks.md` actualizado a medida que avanzás.
- Antes de planificar, leé la spec vigente y contrastá el plan con la constitución.

## Tests

- Runner: `node --test` con `node:assert/strict`. Sin dependencias de testing extra.
- Los tests de `src/lib` prueban funciones puras con entradas límite (filas malformadas, duplicados, BOM,
  precios con separadores de miles y decimales).
- Si tocás `src/lib/` o `src/config.js`, agregá o ajustá el test correspondiente en `tests/`.

## Definición de terminado

- `npm test` verde y `npm run build` sin errores ni warnings nuevos.
- Flujo afectado probado en `npm run dev` o `npm run preview`.
- Mobile-first y textos en español respetados; `productos.csv` sigue siendo la única fuente de productos.
- Documentación actualizada si cambió el comportamiento (`spec.md`, `tasks.md`, `README.md`).
- Sin secretos, credenciales ni dependencias injustificadas.

## Trampas conocidas

- `SHOP_ADDRESS` está vacía **a propósito** hasta confirmar la dirección real: no la inventes ni pongas
  placeholders. Mientras esté vacía, el sitio no muestra dirección postal.
- `MAPS_URL` es un punto de referencia de la zona, no la entrada exacta del vivero.
- Si `WHATSAPP_NUMBER` está vacío, la interfaz debe avisar y deshabilitar el envío.
- `base: './'` en `vite.config.js` es obligatorio: la misma compilación debe funcionar en la raíz de Vercel y
  en un subdirectorio de GitHub Pages.
- `dist/` es salida del build: no editarlo a mano.
- `localStorage` puede fallar (modo privado); `main.js` ya tolera el caso y mantiene ese patrón.
- No commits, no `git push` y no despliegues salvo pedido explícito del usuario.
- No modifiques precios, nombres del catálogo, el número de WhatsApp ni textos del negocio sin pedido explícito.
- `productos.csv`: Excel/LibreOffice al guardar pasan el separador a `,` y leen `(1,8mt)` como número
  (`1.8mt`). El parser tolera las comas, pero el formato recomendado sigue siendo `;` y sin planilla.
  Si el sitio "no muestra ningún producto", revisá primero el formato del CSV.
- Las fotos de `public/images/<ID>.jpg` son solo con licencias que permiten uso comercial (CC0,
  dominio público, CC BY, CC BY-SA). Nunca agregues fotos CC BY-NC/ND: el sitio vende. Créditos y
  licencia por archivo en `CREDITOS-IMAGENES.md`.
- Si un producto no tiene foto propia, la tarjeta usa la de la categoría; no es un error.
