import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SHOP_NAME,
  SHOP_LOCALITY,
  SHOP_ADDRESS,
  SHOP_COORDINATES,
  MAPS_URL,
  MAPS_EMBED_URL,
} from '../src/config.js';

test('SHOP_NAME contiene el nombre confirmado del vivero', () => {
  assert.equal(SHOP_NAME, 'Vivero Gaston');
});

test('SHOP_LOCALITY está definida y no vacía', () => {
  assert.equal(typeof SHOP_LOCALITY, 'string');
  assert.ok(SHOP_LOCALITY.trim().length > 0, 'la localidad no puede quedar vacía');
});

test('MAPS_URL es un enlace https de Google Maps', () => {
  assert.equal(typeof MAPS_URL, 'string');
  assert.ok(MAPS_URL.startsWith('https://'), 'el enlace debe usar https');
  assert.ok(MAPS_URL.includes('google.com/maps'), 'el enlace debe ser de Google Maps');
  assert.ok(MAPS_URL.includes(encodeURIComponent(SHOP_COORDINATES)));
});

test('SHOP_COORDINATES contiene el punto confirmado para el marcador del mapa', () => {
  assert.equal(SHOP_COORDINATES, '-31.8658498,-64.9806302');
});

test('MAPS_EMBED_URL centra el mapa embebido en el punto confirmado', () => {
  assert.ok(MAPS_EMBED_URL.startsWith('https://www.google.com/maps?'));
  assert.ok(MAPS_EMBED_URL.includes(`q=${encodeURIComponent(SHOP_COORDINATES)}`));
  assert.ok(MAPS_EMBED_URL.endsWith('&z=16&output=embed'));
});

test('SHOP_ADDRESS es un string editable (vacía = dirección pendiente)', () => {
  assert.equal(typeof SHOP_ADDRESS, 'string');
});
