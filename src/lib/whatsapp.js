// Mensaje del pedido y enlace wa.me.
// Contrato: specs/001-catalogo-carrito-whatsapp/contracts/pedido-whatsapp.md
import { formatARS } from './format.js';
import { itemSubtotal } from './cart.js';

export function normalizeNumber(numero) {
  return String(numero ?? '').replace(/\D/g, '');
}

// Un número se considera configurado con al menos 8 dígitos (número local mínimo).
export function isNumberConfigured(numero) {
  return normalizeNumber(numero).length >= 8;
}

export function buildOrderMessage(items, total, shopName = 'Vivero') {
  const lines = items.map(
    (item) => `• ${item.cantidad} × ${item.nombre} — ${formatARS(itemSubtotal(item))}`
  );

  return [
    `¡Hola ${shopName}! Quiero hacer este pedido:`,
    '',
    ...lines,
    '',
    `Total: ${formatARS(total)}`,
  ].join('\n');
}

export function buildWhatsAppUrl(numero, mensaje) {
  return `https://wa.me/${normalizeNumber(numero)}?text=${encodeURIComponent(mensaje)}`;
}
