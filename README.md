# AppVivero

Catálogo online del vivero con carrito de compras. Los clientes arman su pedido y lo envían
por WhatsApp con un solo toque. Es un sitio 100% estático (sin backend ni base de datos), listo
para publicar en Vercel o GitHub Pages.

**Especificación y seguimiento**: este proyecto usa [spec-kit](https://github.com/github/spec-kit)
(Spec-Driven Development). Las especificaciones viven en `specs/` (001 catálogo y carrito,
002 rediseño visual) y los principios del proyecto en `.specify/memory/constitution.md`.

## Cómo funciona

- `productos.csv` (raíz del repo) es la única fuente de productos y precios.
- `src/config.js` contiene el número de WhatsApp y el nombre del vivero.
- El carrito se guarda en el navegador del cliente (localStorage).
- "Enviar pedido por WhatsApp" abre `wa.me` con el pedido completo escrito.

## Guía del dueño del vivero

### 1. Configurar el número de WhatsApp (obligatorio antes de publicar)

Abrir `src/config.js` con cualquier editor de texto y completar:

```js
export const WHATSAPP_NUMBER = '5493511234567';
```

- Solo dígitos: código de país + 9 + área + número (sin `+`, sin espacios ni guiones).
- Si queda vacío, el sitio muestra un aviso y deshabilita el envío.
- En el mismo archivo se puede cambiar `SHOP_NAME` (el nombre que aparece en el sitio y en el
  mensaje del pedido) y `SHOP_ABOUT` (texto de presentación de la sección "El vivero").
- `SHOP_LOCALITY` define la localidad de la sección "Vení a conocernos" y el centro del mapa.
- `SHOP_ADDRESS` está **vacía a propósito**: completarla solo cuando la dirección exacta del
  vivero esté confirmada (mientras esté vacía, el sitio no muestra dirección postal).
- `MAPS_URL` es el enlace de Google Maps que abren "Cómo llegar" y "Abrir en Google Maps".
  Es un punto de referencia de la zona; cuando la dirección esté confirmada, reemplazarlo por
  el enlace definitivo.

### 2. Actualizar precios o productos

Editar `productos.csv` como planilla (Excel/LibreOffice) o editor de texto:

```csv
CATEGORIA;PRODUCTO;PRECIO;ID
ARBOLES;ACACIA BLANCA C/COPA 15LT;22880;1
```

- Separador: punto y coma `;` (recomendado). Codificación: UTF-8.
- Guardar, volver a publicar y listo — no hay que tocar código.
- La última columna `ID` es un número entero mayor a 0, autoincremental desde 1. Es solo un dato
  de referencia: no se muestra en el sitio y no hace falta que sea correlativo.
- Las filas mal escritas se ignoran solas (el resto del catálogo sigue funcionando).
- No usar `;` dentro de nombres de productos.
- **Planillas:** la app también acepta la coma `,` como separador, que es lo que escriben Excel y
  LibreOffice al guardar. Si usás Calc, lo ideal es *Guardar como → CSV → Editar configuración de
  filtro* con `;` (así no se tocan los números con coma decimal); si queda con comas, igual funciona.
  Ojo: al guardar desde una planilla, los decimales con coma (ej. `2.730,50`) tienen que quedar
  entre comillas (`"2.730,50"`) o el precio se pierde. Lo más seguro es editar el archivo como texto.

### 3. Cambiar las fotografías

**Fotos por producto (recomendado).** Cada producto tiene su foto en `public/images/`, con el
nombre igual al `ID` de la fila del CSV:

```text
productos.csv  →  ARBOLES;ACACIA BLANCA C/COPA 15LT;22880;1
public/images/1.jpg   ←  foto de ese producto
```

Para cambiar la foto de un producto, reemplazá ese archivo (JPG, ~1000 px de ancho). Si el archivo
no existe o no carga, la tarjeta cae sola a la foto de la categoría y, si tampoco carga, al
placeholder botánico: el precio y el botón de agregar nunca se ocultan. No hay que tocar código.

**Fotos de categoría, hero y presentación.** Se configuran en `src/data/images.js`
(separadas de los datos comerciales del CSV):

1. Guardar el archivo en `public/images/` (ej.: `public/images/categoria-frutales.jpg`).
2. En `src/data/images.js`, cambiar el `src` de esa categoría por `'./images/categoria-frutales.jpg'`.

Las fotos por producto son de referencia de cada especie (no del ejemplar exacto que se entrega) y
vienen de iNaturalist y de Wikipedia, solo con licencias que permiten uso comercial (CC0, dominio
público, CC BY o CC BY-SA). La autoría y la licencia de cada archivo están en
[CREDITOS-IMAGENES.md](CREDITOS-IMAGENES.md).

Las fotos de categoría actuales son representativas (no del ejemplar exacto) y tienen estas
licencias:

| Imagen | Autor/a | Licencia |
|--------|---------|----------|
| Hero y "El vivero" (vivero de plantas nativas) | GlacierNPS (Flickr) | Dominio Público 1.0 |
| Aromáticas ("Herbs & tomato") | liza31337 (Flickr) | CC BY 2.0 |
| Frutales ("the amazing giving lemon tree") | NancyFry (Flickr) | CC BY 2.0 |
| Gramíneas ("Winter Miscanthus") | QUOI Media (Flickr) | CC BY-SA 2.0 |
| Trepadoras ("Wall of roses") | Linda N. (Flickr) | CC BY 2.0 |
| Árboles, arbustos, interior, plantines, suculentas y aloe | Unsplash | Licencia Unsplash |

Si una imagen de categoría no carga, la tarjeta prueba primero la foto de la categoría y después
muestra un placeholder botánico; el precio y el botón de agregar siguen visibles.

### 4. Publicar

**Vercel** (recomendado): importar el repositorio en [vercel.com](https://vercel.com) →
framework detectado automáticamente (Vite) → Deploy. No hay variables de entorno.

**GitHub Pages**: ya incluye el workflow `.github/workflows/deploy.yml`. Ir a
Settings → Pages → Source: **GitHub Actions**, y cada push a `main` publica el sitio.

## Desarrollo

Requiere Node.js 20+.

```bash
npm install     # instalar dependencias (solo Vite, para desarrollo)
npm run dev     # servidor local en http://localhost:5173
npm test        # tests unitarios (node --test)
npm run build   # compilar a dist/
npm run preview # servir la compilación como en producción
```

Antes de publicar: `npm test` y `npm run build` deben pasar, y conviene repasar
`specs/001-catalogo-carrito-whatsapp/quickstart.md` (validación end-to-end).

### MCP para desarrollo en VS Code

El archivo `.mcp.json` configura servidores MCP para este workspace: Chrome DevTools y
Playwright para probar y depurar el sitio, Memory para guardar conocimiento local del proyecto,
y Context7 para consultar documentación actualizada. VS Code puede pedir confirmar la confianza
en cada servidor; revisá y aprobá solo los que quieras iniciar. La primera ejecución descarga
los paquetes mediante `npx` y requiere conexión a internet. Memory guarda sus datos en
`.mcp-memory.jsonl`, archivo excluido de Git. Chrome DevTools puede acceder al contenido del
navegador que abre o inspecciona; evitá usarlo con sesiones o datos sensibles.

## Estructura

```text
productos.csv        Catálogo (fuente única de verdad)
public/images/       Fotos por producto: <ID>.jpg (ID = columna ID del CSV)
src/
  config.js          Número de WhatsApp y nombre del vivero
  main.js            Punto de entrada y eventos
  styles.css         Estilos mobile-first
  lib/               Lógica pura (CSV, carrito, formato, WhatsApp)
  data/images.js     Fotos por ID, por categoría, hero y presentación
  ui/render.js       Render del catálogo y del carrito
tests/               Tests unitarios (node --test)
specs/               Especificación, plan, tareas y validación (spec-kit)
CREDITOS-IMAGENES.md Autoría y licencia de las fotos del catálogo
```

## Requisitos funcionales cubiertos

Ver `specs/001-catalogo-carrito-whatsapp/spec.md` (FR-001 a FR-016) y los contratos en
`specs/001-catalogo-carrito-whatsapp/contracts/` (formato del CSV y del enlace de WhatsApp).
