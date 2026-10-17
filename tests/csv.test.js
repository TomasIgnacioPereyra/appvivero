import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCatalog, parsePrice, productId } from '../src/lib/csv.js';

const VALID_CSV = [
  'CATEGORIA;PRODUCTO;PRECIO;ID',
  'ARBOLES;ACACIA BLANCA C/COPA 15LT;22880;1',
  '',
  'ARBOLES;ACACIA BOLA C/COPA 10LT;31.330;2',
  'SUCULENTAS;ALOE VERA M14 CULTIVO;2.730,50;3',
  'ARBOLES;SOLO TRES CAMPOS;22880',
  ';;22880;5',
  'ARBOLES;CONSULTAR;consultar;6',
  'ARBOLES;PRECIO CERO;0;7',
  'ARBOLES;PRECIO NEGATIVO;-10;8',
  'ARBOLES;ID NO NUMERICO;1000;abc',
  'ARBOLES;ID CERO;1000;0',
  'ARBOLES;ID NEGATIVO;1000;-4',
  '   ',
  'INTERIOR;POTUS 3LT;22880;9',
  'ARBOLES;POTUS 3LT;9999;10',
  'ARBOLES;ACACIA BLANCA C/COPA 15LT;22880;11',
].join('\r\n');

test('parseCatalog conserva solo las filas válidas y en orden', () => {
  const products = parseCatalog(VALID_CSV);
  assert.equal(products.length, 6);
  assert.deepEqual(products[0], {
    id: 1,
    categoria: 'ARBOLES',
    nombre: 'ACACIA BLANCA C/COPA 15LT',
    precio: 22880,
  });
  assert.equal(products[1].precio, 31330);
  assert.equal(products[2].precio, 2730.5);
  assert.deepEqual(products[3], {
    id: 7,
    categoria: 'ARBOLES',
    nombre: 'PRECIO CERO',
    precio: 0,
  });
});

test('parseCatalog ignora encabezado, líneas vacías y filas malformadas', () => {
  const products = parseCatalog(VALID_CSV);
  const nombres = products.map((p) => p.nombre);
  assert.ok(!nombres.includes('PRODUCTO'));
  assert.ok(!nombres.includes('SOLO TRES CAMPOS'));
  assert.ok(!nombres.includes('CONSULTAR'));
  assert.ok(!nombres.includes('PRECIO NEGATIVO'));
  assert.ok(!nombres.includes('ID NO NUMERICO'));
  assert.ok(!nombres.includes('ID CERO'));
  assert.ok(!nombres.includes('ID NEGATIVO'));
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
  const csv = '\uFEFFCATEGORIA;PRODUCTO;PRECIO;ID\nARBOLES;TALA 7LT;12220;42\n';
  const products = parseCatalog(csv);
  assert.equal(products.length, 1);
  assert.equal(products[0].nombre, 'TALA 7LT');
  assert.equal(products[0].id, 42);
});

test('parseCatalog tolera un ";" extra dentro del nombre', () => {
  const csv = 'ARBOLES;NOMBRE;RARO;12500;7';
  const [product] = parseCatalog(csv);
  assert.equal(product.nombre, 'NOMBRE;RARO');
  assert.equal(product.precio, 12500);
  assert.equal(product.id, 7);
});

const COMMA_CSV = [
  'CATEGORIA,PRODUCTO,PRECIO,ID',
  'ARBOLES,ACACIA BLANCA C/COPA 15LT,22880,1',
  'SUCULENTAS,ALOE VERA M14 CULTIVO,"2730,50",3',
  'ARBOLES,POTUS 3LT,9999,10',
].join('\r\n');

test('parseCatalog acepta el separador "," (guardado con planilla)', () => {
  const products = parseCatalog(COMMA_CSV);
  assert.equal(products.length, 3);
  assert.deepEqual(products[0], {
    id: 1,
    categoria: 'ARBOLES',
    nombre: 'ACACIA BLANCA C/COPA 15LT',
    precio: 22880,
  });
  assert.equal(products[1].precio, 2730.5);
  assert.equal(products[2].id, 10);
});

test('parseCatalog respeta comillas en nombres y precios con "," (separador ",")', () => {
  const csv = [
    'CATEGORIA,PRODUCTO,PRECIO,ID',
    'TREPADORAS,"JAZMIN DE LECHE (1,8mt) 7LT",0,388',
    'SUCULENTAS,"ALOE ""REINA""","2.730,50",3',
  ].join('\n');
  const products = parseCatalog(csv);
  assert.equal(products.length, 2);
  assert.equal(products[0].nombre, 'JAZMIN DE LECHE (1,8mt) 7LT');
  assert.equal(products[0].id, 388);
  assert.equal(products[1].nombre, 'ALOE "REINA"');
  assert.equal(products[1].precio, 2730.5);
  assert.equal(products[1].id, 3);
});

test('parseCatalog con separador "," sigue ignorando filas inválidas', () => {
  const csv = ['CATEGORIA,PRODUCTO,PRECIO,ID', 'ARBOLES,SOLO TRES,22880', ',,22880,5'].join('\n');
  assert.deepEqual(parseCatalog(csv), []);
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
