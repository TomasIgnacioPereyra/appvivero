// Estado del carrito como funciones puras + persistencia tolerante.
// Entidades y reglas: specs/001-catalogo-carrito-whatsapp/data-model.md
import { productId } from './csv.js';

export const CART_STORAGE_KEY = 'appvivero.cart.v1';
export const MIN_QTY = 1;
export const MAX_QTY = 99;

export function clampQuantity(value) {
  const num = Math.floor(Number(value));
  if (!Number.isFinite(num)) return MIN_QTY;
  return Math.min(MAX_QTY, Math.max(MIN_QTY, num));
}

// Agrega producto; si ya existe (misma identidad) acumula cantidad en la misma línea.
export function addItem(items, producto, cantidad = 1) {
  const id = productId(producto);
  const qty = clampQuantity(cantidad);
  const index = items.findIndex((item) => productId(item) === id);

  if (index === -1) {
    return [
      ...items,
      {
        categoria: producto.categoria,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: qty,
      },
    ];
  }

  return items.map((item, i) =>
    i === index ? { ...item, cantidad: clampQuantity(item.cantidad + qty) } : item
  );
}

// Fija la cantidad de un ítem; cantidad < 1 lo elimina.
export function setQuantity(items, id, cantidad) {
  const qty = Math.floor(Number(cantidad));
  if (!Number.isFinite(qty) || qty < MIN_QTY) {
    return removeItem(items, id);
  }
  return items.map((item) =>
    productId(item) === id ? { ...item, cantidad: clampQuantity(qty) } : item
  );
}

export function removeItem(items, id) {
  return items.filter((item) => productId(item) !== id);
}

export function itemSubtotal(item) {
  return item.precio * item.cantidad;
}

export function cartTotal(items) {
  return items.reduce((sum, item) => sum + itemSubtotal(item), 0);
}

export function cartCount(items) {
  return items.reduce((sum, item) => sum + item.cantidad, 0);
}

// Carga defensiva: entradas inválidas se descartan; nunca lanza.
export function loadCart(storage) {
  try {
    if (!storage) return [];
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        categoria: String(item.categoria ?? '').trim(),
        nombre: String(item.nombre ?? '').trim(),
        precio: Number(item.precio),
        cantidad: Math.floor(Number(item.cantidad)),
      }))
      .filter(
        (item) =>
          item.categoria &&
          item.nombre &&
          Number.isFinite(item.precio) &&
          item.precio > 0 &&
          Number.isFinite(item.cantidad) &&
          item.cantidad >= MIN_QTY
      )
      .map((item) => ({ ...item, cantidad: clampQuantity(item.cantidad) }));
  } catch {
    return [];
  }
}

// Guardado tolerante: si el storage no está disponible (modo privado, cupo
// lleno), la app sigue funcionando sin persistir.
export function saveCart(storage, items) {
  try {
    if (!storage) return;
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // degradación silenciosa intencional
  }
}
