import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addItem,
  setQuantity,
  removeItem,
  cartTotal,
  cartCount,
  loadCart,
  saveCart,
  clampQuantity,
  CART_STORAGE_KEY,
  MAX_QTY,
} from '../src/lib/cart.js';
import { productId } from '../src/lib/csv.js';

const ACACIA = { categoria: 'ARBOLES', nombre: 'ACACIA BLANCA', precio: 22880 };
const ALOE = { categoria: 'SUCULENTAS', nombre: 'ALOE VERA', precio: 2730 };
const POTUS_ARBOL = { categoria: 'ARBOLES', nombre: 'POTUS', precio: 100 };
const POTUS_INTERIOR = { categoria: 'INTERIOR', nombre: 'POTUS', precio: 200 };

function fakeStorage(entries = []) {
  const map = new Map(entries);
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
  };
}

test('addItem agrega productos nuevos con la cantidad indicada', () => {
  const cart = addItem([], ACACIA, 2);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].cantidad, 2);
  assert.equal(cart[0].nombre, 'ACACIA BLANCA');
});

test('addItem acumula en la misma línea si el producto ya está', () => {
  let cart = addItem([], ACACIA, 2);
  cart = addItem(cart, ACACIA, 1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].cantidad, 3);
});

test('addItem distingue productos por categoría + nombre', () => {
  let cart = addItem([], POTUS_ARBOL, 1);
  cart = addItem(cart, POTUS_INTERIOR, 1);
  assert.equal(cart.length, 2);
});

test('la cantidad se acota entre 1 y 99', () => {
  let cart = addItem([], ACACIA, 98);
  cart = addItem(cart, ACACIA, 5);
  assert.equal(cart[0].cantidad, MAX_QTY);
  assert.equal(clampQuantity(0), 1);
  assert.equal(clampQuantity(-7), 1);
  assert.equal(clampQuantity(1000), 99);
  assert.equal(clampQuantity('abc'), 1);
});

test('setQuantity cambia la cantidad, la acota y elimina con < 1', () => {
  const id = productId(ACACIA);
  let cart = addItem([], ACACIA, 2);
  cart = setQuantity(cart, id, 5);
  assert.equal(cart[0].cantidad, 5);
  cart = setQuantity(cart, id, 150);
  assert.equal(cart[0].cantidad, 99);
  cart = setQuantity(cart, id, 0);
  assert.equal(cart.length, 0);
});

test('removeItem quita solo el ítem indicado', () => {
  let cart = addItem([], ACACIA, 1);
  cart = addItem(cart, ALOE, 2);
  cart = removeItem(cart, productId(ACACIA));
  assert.equal(cart.length, 1);
  assert.equal(cart[0].nombre, 'ALOE VERA');
});

test('cartTotal y cartCount calculan subtotales, total y contador', () => {
  let cart = addItem([], ACACIA, 2); // 45760
  cart = addItem(cart, ALOE, 3); // 8190
  assert.equal(cartTotal(cart), 53950);
  assert.equal(cartCount(cart), 5);
  assert.equal(cartTotal([]), 0);
  assert.equal(cartCount([]), 0);
});

test('saveCart + loadCart hacen roundtrip completo', () => {
  const storage = fakeStorage();
  const cart = addItem([], ACACIA, 2);
  saveCart(storage, cart);
  assert.deepEqual(loadCart(storage), cart);
  assert.ok(storage.getItem(CART_STORAGE_KEY).includes('ACACIA BLANCA'));
});

test('loadCart tolera JSON corrupto, tipos inválidos y entradas basura', () => {
  assert.deepEqual(loadCart(fakeStorage([[CART_STORAGE_KEY, 'no es json']])), []);
  assert.deepEqual(loadCart(fakeStorage([[CART_STORAGE_KEY, '{"a":1}']])), []);
  assert.deepEqual(
    loadCart(
      fakeStorage([
        [
          CART_STORAGE_KEY,
          JSON.stringify([
            { categoria: 'ARBOLES', nombre: 'OK', precio: 10, cantidad: 2 },
            { categoria: '', nombre: 'SIN CATEGORIA', precio: 10, cantidad: 1 },
            { categoria: 'X', nombre: 'PRECIO NEGATIVO', precio: -5, cantidad: 1 },
            { categoria: 'X', nombre: 'CANTIDAD CERO', precio: 5, cantidad: 0 },
            null,
            'basura',
          ]),
        ],
      ])
    ).length,
    1
  );
});

test('loadCart y saveCart degradan en silencio sin storage', () => {
  assert.deepEqual(loadCart(null), []);
  assert.deepEqual(loadCart(undefined), []);
  assert.doesNotThrow(() => saveCart(null, []));
});
