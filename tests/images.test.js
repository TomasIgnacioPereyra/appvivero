import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parseCatalog, productId } from '../src/lib/csv.js';
import {
  CATEGORY_IMAGES,
  PRODUCT_IMAGES,
  HERO_IMAGE,
  ABOUT_IMAGE,
  getProductImage,
  localImageSrc,
} from '../src/data/images.js';

const csvText = readFileSync(new URL('../productos.csv', import.meta.url), 'utf8');

test('toda categoría del CSV real tiene imagen asignada', () => {
  const products = parseCatalog(csvText);
  const categorias = [...new Set(products.map((p) => p.categoria))];
  assert.ok(categorias.length > 0, 'el CSV no devolvió categorías');
  for (const categoria of categorias) {
    assert.ok(CATEGORY_IMAGES[categoria], `falta imagen para la categoría "${categoria}"`);
  }
});

test('cada imagen tiene src válido y alt descriptivo no vacío', () => {
  const entries = [
    ...Object.values(CATEGORY_IMAGES),
    ...Object.values(PRODUCT_IMAGES),
    HERO_IMAGE,
    ABOUT_IMAGE,
  ];
  for (const { src, alt } of entries) {
    assert.ok(typeof src === 'string' && src.trim().length > 0, 'src vacío');
    assert.ok(
      /^https:\/\//.test(src) || src.startsWith('./') || src.startsWith('/'),
      `src no válido (debe ser https o ruta local): ${src}`
    );
    assert.ok(
      typeof alt === 'string' && alt.trim().length > 5,
      `alt vacío o demasiado corto: "${alt}"`
    );
  }
});

test('getProductImage prioriza el override de producto y cae a la categoría', () => {
  const aloe = { categoria: 'SUCULENTAS', nombre: 'ALOE VERA M14 CULTIVO' };
  assert.deepEqual(getProductImage(aloe), PRODUCT_IMAGES[productId(aloe)]);

  const otro = { categoria: 'SUCULENTAS', nombre: 'SANSEVIERIA 3LT' };
  assert.deepEqual(getProductImage(otro), CATEGORY_IMAGES.SUCULENTAS);

  assert.equal(getProductImage({ categoria: 'NO EXISTE', nombre: 'X' }), null);
});

test('localImageSrc arma la ruta public/images/<id>.jpg y rechaza IDs inválidos', () => {
  assert.equal(localImageSrc({ id: 35 }), './images/35.jpg');
  assert.equal(localImageSrc({ id: '35' }), './images/35.jpg');
  for (const id of [0, -1, 1.5, 'x', null, undefined, NaN]) {
    assert.equal(localImageSrc({ id }), null, `id inválido aceptado: ${id}`);
  }
  assert.equal(localImageSrc(null), null);
});

test('getProductImage prioriza la foto local y deja la categoría como fallback', () => {
  const aloe = { id: 355, categoria: 'SUCULENTAS', nombre: 'ALOE VERA M14 CULTIVO' };
  const image = getProductImage(aloe);
  assert.equal(image.src, './images/355.jpg');
  assert.equal(image.fallbackSrc, PRODUCT_IMAGES[productId(aloe)].src);
  assert.ok(image.alt.includes('ALOE VERA M14 CULTIVO'), 'alt poco descriptivo');

  const sinOverride = { id: 366, categoria: 'SUCULENTAS', nombre: 'SANSEVIERIA 3LT' };
  assert.equal(getProductImage(sinOverride).src, './images/366.jpg');
  assert.equal(getProductImage(sinOverride).fallbackSrc, CATEGORY_IMAGES.SUCULENTAS.src);

  const sinCategoria = { id: 999, categoria: 'NO EXISTE', nombre: 'PLANTA RARA' };
  assert.equal(getProductImage(sinCategoria).fallbackSrc, null);
});

test('todos los productos del CSV tienen ID válido para su foto local', () => {
  const productos = parseCatalog(csvText);
  assert.ok(productos.length > 0, 'el CSV no devolvió productos');
  for (const producto of productos) {
    assert.match(localImageSrc(producto) ?? '', /^\.\/images\/\d+\.jpg$/);
  }
});

test('las fotos de public/images corresponden a IDs del CSV', () => {
  const dir = new URL('../public/images/', import.meta.url);
  const fotos = readdirSync(dir).filter((archivo) => /^\d+\.jpg$/.test(archivo));
  assert.ok(fotos.length > 0, 'no hay fotos en public/images');
  const ids = new Set(parseCatalog(csvText).map((producto) => producto.id));
  const huerfanas = fotos.filter((archivo) => !ids.has(Number(archivo.replace('.jpg', ''))));
  assert.deepEqual(huerfanas, [], `fotos sin producto en el CSV: ${huerfanas.join(', ')}`);
});
