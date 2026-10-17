// ────────────────────────────────────────────────────────────────────
// Imágenes del catálogo (separadas de los datos comerciales)
// ────────────────────────────────────────────────────────────────────
// Prioridad de la foto de un producto:
//   1. Foto local por ID: `public/images/<id>.jpg` (el <id> es la columna ID
//      de productos.csv). Es la foto de referencia de cada planta.
//   2. Override de producto (PRODUCT_IMAGES), por si hay que pisar una foto.
//   3. Foto de la categoría (CATEGORY_IMAGES).
//   4. Placeholder botánico (lo resuelve la UI).
//
// Las rutas son relativas (`./images/...`) para que la misma compilación
// funcione en la raíz de Vercel y en un subdirectorio de GitHub Pages.
// Si la foto local no existe (404), la UI prueba el `fallbackSrc` (la foto de
// la categoría) y, si tampoco carga, muestra el placeholder: el precio y el
// botón de agregar nunca se ocultan.
//
// Para agregar o reemplazar una foto: guardar el archivo en `public/images/`
// con el ID del producto (ej.: public/images/35.jpg, ver README.md).
//
// Créditos de las fotografías externas (ver también README.md):
//   - "Glacier's Native Plant Nursery" — GlacierNPS (Flickr, Dominio Público 1.0)
//   - "Herbs & tomato" — liza31337 (Flickr, CC BY 2.0)
//   - "the amazing giving lemon tree" — NancyFry (Flickr, CC BY 2.0)
//   - "Winter Miscanthus" — QUOI Media (Flickr, CC BY-SA 2.0)
//   - "Wall of roses" — Linda N. (Flickr, CC BY 2.0)
//   - Resto: Unsplash License (unsplash.com)

import { productId } from '../lib/csv.js';

const UNSPLASH = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

// Imagen principal del hero (vivero con vegetación y luz natural).
export const HERO_IMAGE = {
  src: 'https://live.staticflickr.com/65535/51512350639_3d3dd6de3e_b.jpg',
  alt: 'Invernáculo de un vivero con plantas y riego al sol',
};

// Imagen de la sección "El vivero".
export const ABOUT_IMAGE = {
  src: 'https://live.staticflickr.com/65535/51510834042_a4f1a8985e_b.jpg',
  alt: 'Mesada de vivero con plantines y herramientas de jardinería',
};

// Imagen por categoría del CSV (la clave debe coincidir exactamente).
export const CATEGORY_IMAGES = {
  ARBOLES: {
    src: UNSPLASH('1502082553048-f009c37129b9'),
    alt: 'Árbol de copa amplia en un campo verde',
  },
  ARBUSTOS: {
    src: UNSPLASH('1585320806297-9794b3e4eeae'),
    alt: 'Sendero de jardín bordeado de arbustos con flores',
  },
  'AROMATICAS Y HUERTA': {
    src: 'https://live.staticflickr.com/3061/2561509089_e1a0fc80e3_b.jpg',
    alt: 'Macetas de aromáticas y huerta en un balcón',
  },
  FRUTALES: {
    src: 'https://live.staticflickr.com/3885/15086759485_a6afd41ea0_b.jpg',
    alt: 'Limonero cargado de limones',
  },
  'GRAMINEAS Y HERBACEAS': {
    src: 'https://live.staticflickr.com/5244/5306225077_167b467a48_b.jpg',
    alt: 'Plumas de gramínea ornamental con luz cálida',
  },
  INTERIOR: {
    src: UNSPLASH('1517848568502-d03fa74e1964'),
    alt: 'Hoja de monstera de una planta de interior',
  },
  PLANTINES: {
    src: UNSPLASH('1466692476868-aef1dfb1e735'),
    alt: 'Almácigos con plantines recién brotados',
  },
  SUCULENTAS: {
    src: UNSPLASH('1459156212016-c812468e2115'),
    alt: 'Suculentas en macetas de terracota',
  },
  'TREPADORAS Y APOYANTES': {
    src: 'https://live.staticflickr.com/70/157691864_d0b8ca7c65_h.jpg',
    alt: 'Rosal trepador florecido sobre una pared de ladrillo',
  },
};

// Overrides por producto (opcional). Identidad: categoria|nombre, exactamente
// como figura en productos.csv.
export const PRODUCT_IMAGES = {
  [productId({ categoria: 'SUCULENTAS', nombre: 'ALOE VERA M14 CULTIVO' })]: {
    src: UNSPLASH('1509423350716-97f9360b4e09'),
    alt: 'Planta de aloe vera en una maceta blanca',
  },
};

// Carpeta pública de las fotos por ID (Vite copia `public/` a la raíz del sitio).
const LOCAL_IMAGE_DIR = './images/';

// src de la foto local del producto, o null si no tiene un ID válido.
export function localImageSrc(producto) {
  const id = Number(producto?.id);
  return Number.isInteger(id) && id > 0 ? `${LOCAL_IMAGE_DIR}${id}.jpg` : null;
}

// Devuelve { src, alt, fallbackSrc } del producto:
// foto local por ID → override → categoría → null (placeholder).
// `fallbackSrc` es lo que la UI prueba si la foto principal no carga.
export function getProductImage(producto) {
  const base =
    PRODUCT_IMAGES[productId(producto)] ?? CATEGORY_IMAGES[producto.categoria] ?? null;

  const local = localImageSrc(producto);
  if (!local) return base;

  const nombre = typeof producto.nombre === 'string' ? producto.nombre.trim() : '';
  return {
    src: local,
    alt: nombre ? `Foto de referencia de ${nombre}` : (base?.alt ?? 'Producto del vivero'),
    fallbackSrc: base?.src ?? null,
  };
}
