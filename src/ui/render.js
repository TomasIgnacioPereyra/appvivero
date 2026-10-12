// Render de la interfaz (DOM por innerHTML + delegación de eventos en main.js).
import { formatARS } from '../lib/format.js';
import { productId } from '../lib/csv.js';
import { itemSubtotal, cartTotal, cartCount } from '../lib/cart.js';
import { getProductImage } from '../data/images.js';

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Placeholder botánico (SVG inline en data URI): se usa cuando un producto no
// tiene imagen asignada o cuando la imagen externa no carga.
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#EFEDE1"/>
  <g>
    <path d="M200 232V128" stroke="#78966A" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M200 150c2-42 26-68 74-76-1 48-30 76-74 76Z" fill="#78966A" opacity=".55"/>
    <path d="M200 182c-2-30-18-48-52-52 1 34 21 52 52 52Z" fill="#78966A" opacity=".32"/>
  </g>
</svg>`;

export const PLACEHOLDER_URI = `data:image/svg+xml,${encodeURIComponent(PLACEHOLDER_SVG)}`;

// Búsqueda sin mayúsculas ni acentos ("pezuña" encuentra "PEZUÑA").
export function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterProducts(products, query, category) {
  const q = normalizeText(query.trim());
  return products.filter((product) => {
    const matchesCategory = category === 'Todas' || product.categoria === category;
    const matchesQuery = q === '' || normalizeText(product.nombre).includes(q);
    return matchesCategory && matchesQuery;
  });
}

export function listCategories(products) {
  const counts = new Map();
  for (const product of products) {
    counts.set(product.categoria, (counts.get(product.categoria) ?? 0) + 1);
  }
  return counts;
}

export function renderCategories(container, products, activeCategory) {
  const counts = listCategories(products);
  const entries = [['Todas', products.length], ...counts.entries()];

  container.innerHTML = entries
    .map(([name, count]) => {
      const active = name === activeCategory;
      return `<button type="button" class="chip${active ? ' active' : ''}" data-action="filter" data-category="${escapeHtml(name)}" aria-pressed="${active}">${escapeHtml(name)}<span class="chip-count">${count}</span></button>`;
    })
    .join('');
}

export function renderCatalog(container, { products, query, category }) {
  const visible = filterProducts(products, query, category);

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="catalog-empty" role="status">
        <img class="catalog-empty-icon" src="${PLACEHOLDER_URI}" alt="" width="160" height="120" />
        <p><strong>No encontramos productos con esa búsqueda.</strong></p>
        <p>Probá con otro nombre o mirá todas las categorías.</p>
        <button type="button" class="btn btn-primary" data-action="filter" data-category="Todas">
          Ver todas las categorías
        </button>
      </div>`;
    return;
  }

  const groups = new Map();
  for (const product of visible) {
    if (!groups.has(product.categoria)) groups.set(product.categoria, []);
    groups.get(product.categoria).push(product);
  }

  let html = '';
  for (const [categoria, items] of groups) {
    html += `
      <section class="category-block" aria-labelledby="cat-${escapeHtml(categoria)}">
        <h3 class="category-title" id="cat-${escapeHtml(categoria)}">
          ${escapeHtml(categoria)}
          <span class="category-count">${items.length} productos</span>
        </h3>
        <ul class="product-grid">
          ${items.map(productCard).join('')}
        </ul>
      </section>`;
  }

  container.innerHTML = html;
}

function productCard(product) {
  const id = escapeHtml(productId(product));
  const nombre = escapeHtml(product.nombre);
  const image = getProductImage(product);

  const media = image
    ? `<img
         class="product-img"
         src="${escapeHtml(image.src)}"
         alt="${escapeHtml(image.alt)}"
         loading="lazy"
         decoding="async"
         width="800"
         height="600"
         data-product-img
       />`
    : `<img
         class="product-img product-img-placeholder"
         src="${PLACEHOLDER_URI}"
         alt="Sin imagen para ${nombre}"
         loading="lazy"
         decoding="async"
         width="800"
         height="600"
       />`;

  return `
    <li class="product-card">
      <div class="product-media">
        ${media}
        <span class="product-cat">${escapeHtml(product.categoria)}</span>
      </div>
      <div class="product-info">
        <h4 class="product-name">${nombre}</h4>
        <div class="product-foot">
          <span class="product-price">${formatARS(product.precio)}</span>
        </div>
        <div class="product-actions">
          <div class="qty-stepper product-qty-stepper">
            <button type="button" class="qty-btn" data-action="qty-decrease" aria-label="Restar una unidad de ${nombre}">−</button>
            <label class="qty-field">
              <span class="visually-hidden">Cantidad de ${nombre}</span>
              <input
                class="qty"
                type="number"
                inputmode="numeric"
                min="1"
                max="99"
                value="1"
                aria-label="Cantidad de ${nombre}"
              />
            </label>
            <button type="button" class="qty-btn" data-action="qty-increase" aria-label="Sumar una unidad de ${nombre}">+</button>
          </div>
          <button type="button" class="btn-add" data-action="add" data-id="${id}">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="icon">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <span class="btn-add-label">Agregar</span>
          </button>
        </div>
      </div>
    </li>`;
}

function cartThumb(item) {
  const image = getProductImage(item);
  const src = image ? escapeHtml(image.src) : PLACEHOLDER_URI;
  return `<img class="cart-item-thumb" src="${src}" alt="" loading="lazy" decoding="async" width="96" height="96" />`;
}

export function renderCart(container, { items, configured }) {
  const count = cartCount(items);
  const total = cartTotal(items);

  const header = `
    <div class="cart-header">
      <h2>Tu pedido${count > 0 ? ` <span class="cart-header-count">(${count})</span>` : ''}</h2>
      <button type="button" class="icon-btn" data-action="close-cart" aria-label="Cerrar carrito">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="icon">
          <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
        </svg>
      </button>
    </div>`;

  const body =
    items.length > 0
      ? `<ul class="cart-items">${items.map(cartItemRow).join('')}</ul>`
      : `<div class="cart-empty" role="status">
           <img class="cart-empty-icon" src="${PLACEHOLDER_URI}" alt="" width="160" height="120" />
           <p><strong>Tu carrito está vacío.</strong></p>
           <p>Agregá productos del catálogo para armar tu pedido.</p>
           <a class="btn btn-ghost" href="#catalogo" data-action="close-cart">Ver el catálogo</a>
         </div>`;

  const warning = configured
    ? ''
    : `<p class="note-warning">El número de WhatsApp del vivero todavía no está configurado (<code>src/config.js</code>). El envío está deshabilitado.</p>`;

  const footer = `
    <div class="cart-footer">
      <div class="cart-total-row">
        <span>Total</span>
        <strong>${formatARS(total)}</strong>
      </div>
      ${warning}
      <button type="button" class="btn btn-send" data-action="send" ${items.length === 0 || !configured ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="icon">
          <path d="M12 3.6a8.4 8.4 0 0 0-7.2 12.7L3.6 20.4l4.2-1.1A8.4 8.4 0 1 0 12 3.6Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          <path d="M8.8 9.1c.3-.8.7-.9 1.1-.9h.5l.9 1.9-.6.8c-.2.2-.2.4-.1.6.4.8 1.4 1.8 2.2 2.2.2.1.4.1.6-.1l.8-.6 1.9.9v.5c0 .4-.1.8-.9 1.1-.9.3-2.1.1-3.6-.8-1.4-.9-2.4-2-2.9-3-.5-.9-.5-2 .1-2.6Z" fill="currentColor" />
        </svg>
        Enviar pedido por WhatsApp
      </button>
      ${
        items.length > 0
          ? `<div class="cart-secondary">
               <button type="button" class="btn btn-ghost" data-action="close-cart">Seguir comprando</button>
               <button type="button" class="btn-link-danger" data-action="clear">Vaciar carrito</button>
             </div>`
          : ''
      }
    </div>`;

  container.innerHTML = header + `<div class="cart-body">${body}</div>` + footer;
}

function cartItemRow(item) {
  const id = escapeHtml(productId(item));
  const nombre = escapeHtml(item.nombre);
  return `
    <li class="cart-item">
      <div class="cart-item-main">
        ${cartThumb(item)}
        <div class="cart-item-info">
          <span class="cart-item-name">${nombre}</span>
          <span class="cart-item-unit">Precio unitario: ${formatARS(item.precio)}</span>
          <span class="cart-item-subtotal">Subtotal: <strong>${formatARS(itemSubtotal(item))}</strong></span>
        </div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-stepper">
          <button type="button" class="qty-btn" data-action="dec" data-id="${id}" aria-label="Restar una unidad de ${nombre}">−</button>
          <span class="cart-item-qty" aria-label="Cantidad">${item.cantidad}</span>
          <button type="button" class="qty-btn" data-action="inc" data-id="${id}" aria-label="Sumar una unidad de ${nombre}">+</button>
        </div>
        <button type="button" class="btn-remove" data-action="remove" data-id="${id}">
          Quitar
        </button>
      </div>
    </li>`;
}
