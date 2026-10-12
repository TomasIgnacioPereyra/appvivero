import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCatalog, productId } from '../src/lib/csv.js';
import {
  CATEGORY_IMAGES,
  PRODUCT_IMAGES,
  HERO_IMAGE,
  ABOUT_IMAGE,
  getProductImage,
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
