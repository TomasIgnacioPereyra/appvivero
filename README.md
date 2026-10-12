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
CATEGORIA;PRODUCTO;PRECIO
ARBOLES;ACACIA BLANCA C/COPA 15LT;22880
```

- Separador: punto y coma `;`. Codificación: UTF-8.
- Guardar, volver a publicar y listo — no hay que tocar código.
- Las filas mal escritas se ignoran solas (el resto del catálogo sigue funcionando).
- No usar `;` dentro de nombres de productos.

### 3. Cambiar las fotografías

Las fotos del hero y de cada categoría se configuran en `src/data/images.js` (separado de los
datos comerciales del CSV). Para usar fotos propias:

1. Guardar el archivo en `public/imagenes/` (ej.: `public/imagenes/frutales.jpg`).
2. En `src/data/images.js`, cambiar el `src` de esa categoría por `'./imagenes/frutales.jpg'`.

Las fotos actuales son representativas de cada categoría (no del ejemplar exacto que se
entrega) y tienen estas licencias:

| Imagen | Autor/a | Licencia |
|--------|---------|----------|
| Hero y "El vivero" (vivero de plantas nativas) | GlacierNPS (Flickr) | Dominio Público 1.0 |
| Aromáticas ("Herbs & tomato") | liza31337 (Flickr) | CC BY 2.0 |
| Frutales ("the amazing giving lemon tree") | NancyFry (Flickr) | CC BY 2.0 |
| Gramíneas ("Winter Miscanthus") | QUOI Media (Flickr) | CC BY-SA 2.0 |
| Trepadoras ("Wall of roses") | Linda N. (Flickr) | CC BY 2.0 |
| Árboles, arbustos, interior, plantines, suculentas y aloe | Unsplash | Licencia Unsplash |

Si una imagen no carga, la tarjeta muestra un placeholder botánico y el precio y el botón de
agregar siguen visibles.

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

## Estructura

```text
productos.csv        Catálogo (fuente única de verdad)
src/
  config.js          Número de WhatsApp y nombre del vivero
  main.js            Punto de entrada y eventos
  styles.css         Estilos mobile-first
  lib/               Lógica pura (CSV, carrito, formato, WhatsApp)
  ui/render.js       Render del catálogo y del carrito
tests/               Tests unitarios (node --test)
specs/               Especificación, plan, tareas y validación (spec-kit)
```

## Requisitos funcionales cubiertos

Ver `specs/001-catalogo-carrito-whatsapp/spec.md` (FR-001 a FR-016) y los contratos en
`specs/001-catalogo-carrito-whatsapp/contracts/` (formato del CSV y del enlace de WhatsApp).
