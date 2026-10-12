// Formato de moneda argentino sin decimales: 22880 → "$ 22.880"
const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatARS(precio) {
  return formatter.format(precio);
}
