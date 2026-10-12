import test from 'node:test';
import assert from 'node:assert/strict';
import { SHOP_LOCALITY, SHOP_ADDRESS, MAPS_URL } from '../src/config.js';

test('SHOP_LOCALITY está definida y no vacía', () => {
  assert.equal(typeof SHOP_LOCALITY, 'string');
  assert.ok(SHOP_LOCALITY.trim().length > 0, 'la localidad no puede quedar vacía');
});

test('MAPS_URL es un enlace https de Google Maps', () => {
  assert.equal(typeof MAPS_URL, 'string');
  assert.ok(MAPS_URL.startsWith('https://'), 'el enlace debe usar https');
  assert.ok(MAPS_URL.includes('google.com/maps'), 'el enlace debe ser de Google Maps');
});

test('SHOP_ADDRESS es un string editable (vacía = dirección pendiente)', () => {
  assert.equal(typeof SHOP_ADDRESS, 'string');
});
