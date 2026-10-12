// ────────────────────────────────────────────────────────────────────
// Imágenes representativas del catálogo (separadas de los datos comerciales)
// ────────────────────────────────────────────────────────────────────
// El CSV no tiene columna de imágenes. Este mapeo asigna a cada categoría una
// fotografía real y acorde (no es la foto del producto exacto que se entrega).
//
// Cómo usar fotos propias (prioridad local):
//   1. Guardar el archivo en `public/imagenes/` (ej.: public/imagenes/arboles.jpg)
//   2. Acá, cambiar el `src` por una ruta relativa: './imagenes/arboles.jpg'
//   Las rutas relativas funcionan igual en Vercel y en GitHub Pages.
//   Si una imagen no existe o falla, la tarjeta muestra un placeholder botánico
//   (el precio y el botón de agregar nunca se ocultan).
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

// Devuelve { src, alt } del producto: override → categoría → null (placeholder).
export function getProductImage(producto) {
  return (
    PRODUCT_IMAGES[productId(producto)] ??
    CATEGORY_IMAGES[producto.categoria] ??
    null
  );
}
