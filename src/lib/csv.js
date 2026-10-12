// Parser del catálogo. Contrato: specs/001-catalogo-carrito-whatsapp/contracts/catalogo-csv.md
// Formato: UTF-8, separador ';', encabezado CATEGORIA;PRODUCTO;PRECIO.

export function productId(producto) {
  return `${producto.categoria}|${producto.nombre}`;
}

// Normaliza precio en formato argentino: '.' = miles, ',' = decimales.
// Acepta también enteros simples ("22880").
export function parsePrice(raw) {
  const normalized = String(raw).trim().replace(/\./g, '').replace(',', '.');
  return Number(normalized);
}

export function parseCatalog(csvText) {
  const products = [];
  const seen = new Set();

  const lines = String(csvText).replace(/^\uFEFF/, '').split(/\r?\n/);

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 3) continue; // línea vacía o incompleta: se ignora

    const categoria = parts[0].trim();
    const rawPrice = parts[parts.length - 1].trim();
    const nombre = parts.slice(1, -1).join(';').trim();

    if (!categoria || !nombre || !rawPrice) continue;

    const precio = parsePrice(rawPrice);
    if (!Number.isFinite(precio) || precio <= 0) continue; // precio inválido: se ignora

    const producto = { categoria, nombre, precio };
    const id = productId(producto);
    if (seen.has(id)) continue; // fila duplicada: se conserva la primera
    seen.add(id);
    products.push(producto);
  }

  return products;
}
