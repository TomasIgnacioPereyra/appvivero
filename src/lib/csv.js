// Parser del catálogo. Contrato: specs/001-catalogo-carrito-whatsapp/contracts/catalogo-csv.md
// Formato: UTF-8, encabezado CATEGORIA;PRODUCTO;PRECIO;ID.
// Separador: ';' (recomendado) o ',' (lo que escriben Excel/LibreOffice al guardar).
// La categoría se ancla al primer campo y el ID/PRECIO a los dos últimos, así se
// tolera un separador extra dentro del nombre del producto.

export function productId(producto) {
  return `${producto.categoria}|${producto.nombre}`;
}

// Normaliza precio en formato argentino: '.' = miles, ',' = decimales.
// Acepta también enteros simples ("22880").
export function parsePrice(raw) {
  const normalized = String(raw).trim().replace(/\./g, '').replace(',', '.');
  return Number(normalized);
}

// Separador de la primera línea con contenido: gana el que más aparece (';' si hay empate).
function detectDelimiter(text) {
  const first = text.split(/\r?\n/).find((line) => line.trim()) ?? '';
  const semicolons = (first.match(/;/g) || []).length;
  const commas = (first.match(/,/g) || []).length;
  return commas > semicolons ? ',' : ';';
}

// Divide una línea y respeta las comillas dobles, para que un separador dentro de
// un campo entrecomillado ("Jazmín, blanco") no corte el nombre.
function splitLine(line, delimiter) {
  const parts = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"'; // comilla escapada
        i++;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (char === delimiter && !quoted) {
      parts.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  parts.push(current);
  return parts;
}

export function parseCatalog(csvText) {
  const products = [];
  const seen = new Set();

  const text = String(csvText).replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(text);
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const parts = splitLine(line, delimiter);
    if (parts.length < 4) continue; // línea vacía o incompleta: se ignora

    const categoria = parts[0].trim();
    const rawId = parts[parts.length - 1].trim();
    const rawPrice = parts[parts.length - 2].trim();
    const nombre = parts.slice(1, -2).join(delimiter).trim();

    if (!categoria || !nombre || !rawPrice || !rawId) continue;

    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) continue; // id inválido: se ignora

    const precio = parsePrice(rawPrice);
    if (!Number.isFinite(precio) || precio < 0) continue; // precio inválido: se ignora

    const producto = { id, categoria, nombre, precio };
    const clave = productId(producto);
    if (seen.has(clave)) continue; // fila duplicada: se conserva la primera
    seen.add(clave);
    products.push(producto);
  }

  return products;
}
