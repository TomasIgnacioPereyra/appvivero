import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  isNumberConfigured,
  normalizeNumber,
} from '../src/lib/whatsapp.js';
import { formatARS } from '../src/lib/format.js';

const ITEMS = [
  { categoria: 'ARBOLES', nombre: 'ACACIA BLANCA C/COPA 15LT', precio: 22880, cantidad: 2 },
  { categoria: 'SUCULENTAS', nombre: 'ALOE VERA M14 CULTIVO', precio: 2730, cantidad: 1 },
];
const TOTAL = 48490;

// Intl puede usar espacio duro (U+00A0); se normaliza en las comparaciones.
const plain = (text) => String(text).replace(/\u00A0/g, ' ');

test('formatARS usa formato argentino sin decimales', () => {
  assert.equal(plain(formatARS(22880)), '$ 22.880');
  assert.equal(plain(formatARS(45760)), '$ 45.760');
  assert.equal(plain(formatARS(0)), '$ 0');
});

test('buildOrderMessage genera el mensaje exacto del contrato', () => {
  const mensaje = plain(buildOrderMessage(ITEMS, TOTAL, 'Vivero'));
  const esperado = [
    '¡Hola Vivero! Quiero hacer este pedido:',
    '',
    '• 2 × ACACIA BLANCA C/COPA 15LT — $ 45.760',
    '• 1 × ALOE VERA M14 CULTIVO — $ 2.730',
    '',
    'Total: $ 48.490',
  ].join('\n');
  assert.equal(mensaje, esperado);
});

test('buildOrderMessage respeta el orden de los ítems del carrito', () => {
  const mensaje = buildOrderMessage([ITEMS[1], ITEMS[0]], TOTAL, 'Vivero');
  const lineaAloe = mensaje.indexOf('ALOE VERA');
  const lineaAcacia = mensaje.indexOf('ACACIA BLANCA');
  assert.ok(lineaAloe < lineaAcacia);
});

test('buildWhatsAppUrl normaliza el número a solo dígitos y codifica el texto', () => {
  const mensaje = '¡Hola! 1 × ÁRBOL — $ 2.730\n\nTotal: $ 2.730';
  const url = buildWhatsAppUrl('+54 9 351 123-4567', mensaje);
  const prefix = 'https://wa.me/5493511234567?text=';
  assert.ok(url.startsWith(prefix));
  const encoded = url.slice(prefix.length);
  assert.equal(decodeURIComponent(encoded), mensaje);
  assert.ok(!encoded.includes(' '));
  assert.ok(!encoded.includes('\n'));
});

test('normalizeNumber elimina todo lo que no sea dígito', () => {
  assert.equal(normalizeNumber('+54 9 351 123-4567'), '5493511234567');
  assert.equal(normalizeNumber('(0351) 456 7890'), '03514567890');
  assert.equal(normalizeNumber(null), '');
});

test('isNumberConfigured exige al menos 8 dígitos', () => {
  assert.equal(isNumberConfigured(''), false);
  assert.equal(isNumberConfigured(null), false);
  assert.equal(isNumberConfigured('1234567'), false);
  assert.equal(isNumberConfigured('5493511234567'), true);
  assert.equal(isNumberConfigured('+54 9 351 123-4567'), true);
});
