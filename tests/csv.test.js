import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCatalog, parsePrice, productId } from '../src/lib/csv.js';

const VALID_CSV = [
  'CATEGORIA;PRODUCTO;PRECIO',
  'ARBOLES;ACACIA BLANCA C/COPA 15LT;22880',
  '',
  'ARBOLES;ACACIA BOLA C/COPA 10LT;31.330',
  'SUCULENTAS;ALOE VERA M14 CULTIVO;2.730,50',
  'ARBOLES;SOLO DOS CAMPOS',
  ';;22880',
  'ARBOLES;CONSULTAR;consultar',
  'ARBOLES;PRECIO CERO;0',
  '   ',
  'INTERIOR;POTUS 3LT;22880',
  'ARBOLES;POTUS 3LT;9999',
  'ARBOLES;ACACIA BLANCA C/COPA 15LT;22880',
].join('\r\n');

test('parseCatalog conserva solo las filas válidas y en orden', () => {
  const products = parseCatalog(VALID_CSV);
  assert.equal(products.length, 5);
  assert.deepEqual(products[0], {
    categoria: 'ARBOLES',
    nombre: 'ACACIA BLANCA C/COPA 15LT',
    precio: 22880,
  });
  assert.equal(products[1].precio, 31330);
  assert.equal(products[2].precio, 2730.5);
});

test('parseCatalog ignora encabezado, líneas vacías y filas malformadas', () => {
  const products = parseCatalog(VALID_CSV);
  const nombres = products.map((p) => p.nombre);
  assert.ok(!nombres.includes('PRODUCTO'));
  assert.ok(!nombres.includes('SOLO DOS CAMPOS'));
  assert.ok(!nombres.includes('CONSULTAR'));
  assert.ok(!nombres.includes('PRECIO CERO'));
});

test('el mismo nombre en dos categorías son productos distintos', () => {
  const products = parseCatalog(VALID_CSV);
  const potus = products.filter((p) => p.nombre === 'POTUS 3LT');
  assert.equal(potus.length, 2);
  assert.notEqual(productId(potus[0]), productId(potus[1]));
});

test('las filas duplicadas se conservan una sola vez (gana la primera)', () => {
  const products = parseCatalog(VALID_CSV);
  const acacia = products.filter((p) => p.nombre === 'ACACIA BLANCA C/COPA 15LT');
  assert.equal(acacia.length, 1);
  assert.equal(acacia[0].precio, 22880);
});

test('parseCatalog tolera BOM inicial y saltos \\n solos', () => {
  const csv = '\uFEFFCATEGORIA;PRODUCTO;PRECIO\nARBOLES;TALA 7LT;12220\n';
  const products = parseCatalog(csv);
  assert.equal(products.length, 1);
  assert.equal(products[0].nombre, 'TALA 7LT');
});

test('parseCatalog tolera un ";" extra dentro del nombre (3+ campos)', () => {
  const csv = 'ARBOLES;NOMBRE;RARO;12500';
  const [product] = parseCatalog(csv);
  assert.equal(product.nombre, 'NOMBRE;RARO');
  assert.equal(product.precio, 12500);
});

test('parsePrice interpreta formato argentino y entero', () => {
  assert.equal(parsePrice('22880'), 22880);
  assert.equal(parsePrice('22.880'), 22880);
  assert.equal(parsePrice('2.730,50'), 2730.5);
  assert.ok(Number.isNaN(parsePrice('consultar')));
});

test('parseCatalog con texto vacío devuelve lista vacía', () => {
  assert.deepEqual(parseCatalog(''), []);
});
