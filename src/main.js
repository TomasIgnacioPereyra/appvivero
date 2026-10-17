// Punto de entrada: carga el catálogo, conecta eventos y orquesta el render.
import './styles.css';
import csvRaw from '../productos.csv?raw';
import { parseCatalog, productId } from './lib/csv.js';
import {
  addItem,
  setQuantity,
  removeItem,
  cartTotal,
  cartCount,
  loadCart,
  saveCart,
} from './lib/cart.js';
import { formatARS } from './lib/format.js';
import { buildOrderMessage, buildWhatsAppUrl, isNumberConfigured } from './lib/whatsapp.js';
import {
  WHATSAPP_NUMBER,
  SHOP_NAME,
  SHOP_ABOUT,
  SHOP_LOCALITY,
  SHOP_ADDRESS,
  MAPS_EMBED_URL,
  MAPS_URL,
} from './config.js';
import {
  renderCategories,
  renderCatalog,
  renderCart,
  filterProducts,
  PLACEHOLDER_URI,
} from './ui/render.js';
import { HERO_IMAGE, ABOUT_IMAGE } from './data/images.js';

const storage = (() => {
  try {
    const candidate = window.localStorage;
    candidate.getItem('__appvivero_test__');
    return candidate;
  } catch {
    return null;
  }
})();

const products = parseCatalog(csvRaw);
const configured = isNumberConfigured(WHATSAPP_NUMBER);

const state = {
  query: '',
  category: 'Todas',
  cart: loadCart(storage),
};

const els = {
  header: document.getElementById('site-header'),
  menuToggle: document.getElementById('menu-toggle'),
  mainNav: document.getElementById('main-nav'),
  catalog: document.getElementById('catalog'),
  catalogStatus: document.getElementById('catalog-status'),
  categories: document.getElementById('categories'),
  cartPanel: document.getElementById('cart-panel'),
  cartBackdrop: document.getElementById('cart-backdrop'),
  cartToggle: document.getElementById('cart-toggle'),
  cartToggleMobile: document.getElementById('cart-toggle-mobile'),
  cartCount: document.getElementById('cart-count'),
  cartTotalHint: document.getElementById('cart-total-hint'),
  cartCountMobile: document.getElementById('cart-count-mobile'),
  cartTotalHintMobile: document.getElementById('cart-total-hint-mobile'),
  search: document.getElementById('search'),
  warning: document.getElementById('config-warning'),
  toast: document.getElementById('toast'),
};

/* ── Render ─────────────────────────────────────────────────────── */

function renderCatalogView() {
  renderCategories(els.categories, products, state.category);
  renderCatalog(els.catalog, {
    products,
    query: state.query,
    category: state.category,
  });

  const visible = filterProducts(products, state.query, state.category);
  if (visible.length === 0) {
    els.catalogStatus.textContent = 'Sin resultados';
  } else if (visible.length === products.length) {
    els.catalogStatus.textContent = `${visible.length} productos`;
  } else {
    els.catalogStatus.textContent = `${visible.length} de ${products.length} productos`;
  }
}

function renderCartView() {
  // El carrito guardado no incluye el ID del producto (identidad = categoria|nombre):
  // lo recuperamos del catálogo para poder mostrar la foto por ID en el carrito.
  const items = state.cart.map((item) => {
    const producto = products.find((p) => productId(p) === productId(item));
    return producto ? { ...item, id: producto.id } : item;
  });

  renderCart(els.cartPanel, { items, configured });

  const count = cartCount(state.cart);
  els.cartCount.textContent = String(count);
  els.cartCountMobile.textContent = String(count);

  if (count > 0) {
    els.cartTotalHint.hidden = false;
    els.cartTotalHint.textContent = formatARS(cartTotal(state.cart));
    els.cartTotalHintMobile.hidden = false;
    els.cartTotalHintMobile.textContent = els.cartTotalHint.textContent;
  } else {
    els.cartTotalHint.hidden = true;
    els.cartTotalHint.textContent = '';
    els.cartTotalHintMobile.hidden = true;
    els.cartTotalHintMobile.textContent = '';
  }
}

function renderAll() {
  renderCatalogView();
  renderCartView();
}

function persist() {
  saveCart(storage, state.cart);
}

/* ── Feedback visual ────────────────────────────────────────────── */

let toastTimer;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2200);
}

function flashAdded(button) {
  if (!button) return;
  const label = button.querySelector('.btn-add-label');
  button.classList.add('is-added');
  if (label) label.textContent = 'Agregado';
  clearTimeout(button._addedTimer);
  button._addedTimer = setTimeout(() => {
    button.classList.remove('is-added');
    if (label) label.textContent = 'Agregar';
  }, 1200);
}

/* ── Carrito: abrir/cerrar ──────────────────────────────────────── */

let cartOpener = null;

function openCart() {
  cartOpener = document.activeElement;
  document.body.classList.add('cart-open', 'no-scroll');
  els.cartBackdrop.hidden = false;
  els.cartToggle.setAttribute('aria-expanded', 'true');
  els.cartToggleMobile.setAttribute('aria-expanded', 'true');
  const closeBtn = els.cartPanel.querySelector('[data-action="close-cart"]');
  if (closeBtn) closeBtn.focus();
}

function closeCart() {
  document.body.classList.remove('cart-open', 'no-scroll');
  els.cartBackdrop.hidden = true;
  els.cartToggle.setAttribute('aria-expanded', 'false');
  els.cartToggleMobile.setAttribute('aria-expanded', 'false');
  if (cartOpener && typeof cartOpener.focus === 'function' && document.contains(cartOpener)) {
    cartOpener.focus();
  }
}

/* ── Menú móvil ─────────────────────────────────────────────────── */

function setMenu(open) {
  els.header.classList.toggle('nav-open', open);
  els.menuToggle.setAttribute('aria-expanded', String(open));
  els.menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

els.menuToggle.addEventListener('click', () => {
  setMenu(!els.header.classList.contains('nav-open'));
});

els.mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

/* ── Búsqueda y utilidades ──────────────────────────────────────── */

function findProduct(id) {
  return products.find((product) => productId(product) === id);
}

function findItem(id) {
  return state.cart.find((item) => productId(item) === id);
}

// Fallback de imágenes: si la foto principal no carga (por ejemplo, una foto
// local por ID que todavía no existe), se prueba el `fallbackSrc` (foto de la
// categoría) y, si tampoco carga, el placeholder botánico. Nunca se ocultan el
// precio ni los controles.
document.addEventListener(
  'error',
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    const isProductOrCart =
      img.hasAttribute('data-product-img') ||
      img.classList.contains('cart-item-thumb');
    const isHeroOrAbout = img.id === 'hero-img' || img.id === 'about-img';
    if (!isProductOrCart && !isHeroOrAbout) return;

    const fallback = img.getAttribute('data-fallback-src');
    if (fallback) {
      img.removeAttribute('data-fallback-src');
      img.src = fallback;
      return;
    }

    img.removeAttribute('data-product-img');
    img.src = PLACEHOLDER_URI;
    img.classList.add('img-fallback');
  },
  true
);

/* ── Eventos globales ───────────────────────────────────────────── */

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;

  const { action } = trigger.dataset;
  const id = trigger.dataset.id;

  switch (action) {
    case 'filter': {
      state.category = trigger.dataset.category;
      renderCatalogView();
      break;
    }
    case 'qty-decrease':
    case 'qty-increase': {
      const card = trigger.closest('.product-card');
      const qtyInput = card ? card.querySelector('.qty') : null;
      if (!qtyInput) return;
      const current = Number(qtyInput.value);
      const quantity = Number.isFinite(current)
        ? Math.min(99, Math.max(1, Math.floor(current)))
        : 1;
      const adjustment = action === 'qty-increase' ? 1 : -1;
      qtyInput.value = String(Math.min(99, Math.max(1, quantity + adjustment)));
      break;
    }
    case 'add': {
      const product = findProduct(id);
      if (!product) return;
      const card = trigger.closest('.product-card');
      const qtyInput = card ? card.querySelector('.qty') : null;
      const requested = qtyInput ? Number(qtyInput.value) : 1;
      state.cart = addItem(state.cart, product, requested);
      if (qtyInput) qtyInput.value = '1';
      persist();
      renderCartView();
      flashAdded(trigger);
      showToast(`${product.nombre} agregado al carrito`);
      break;
    }
    case 'inc': {
      const item = findItem(id);
      if (item) state.cart = setQuantity(state.cart, id, item.cantidad + 1);
      persist();
      renderCartView();
      break;
    }
    case 'dec': {
      const item = findItem(id);
      if (item) state.cart = setQuantity(state.cart, id, item.cantidad - 1);
      persist();
      renderCartView();
      break;
    }
    case 'remove': {
      state.cart = removeItem(state.cart, id);
      persist();
      renderCartView();
      break;
    }
    case 'clear': {
      state.cart = [];
      persist();
      renderCartView();
      break;
    }
    case 'send': {
      if (state.cart.length === 0 || !configured) return;
      const message = buildOrderMessage(state.cart, cartTotal(state.cart), SHOP_NAME);
      window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, message), '_blank', 'noopener');
      state.cart = [];
      persist();
      renderCartView();
      showToast('Se abrió WhatsApp con tu pedido. El carrito se vació.');
      break;
    }
    case 'open-cart':
      openCart();
      break;
    case 'close-cart':
      closeCart();
      break;
  }
});

els.search.addEventListener('input', () => {
  state.query = els.search.value;
  renderCatalogView();
});

els.cartToggle.addEventListener('click', openCart);
els.cartToggleMobile.addEventListener('click', openCart);
els.cartBackdrop.addEventListener('click', closeCart);
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeCart();
  setMenu(false);
});

/* ── Contenido configurable ─────────────────────────────────────── */

document.querySelectorAll('[data-shop-name]').forEach((el) => {
  el.textContent = SHOP_NAME;
});

document.title = `${SHOP_NAME} — Catálogo de plantas y pedidos por WhatsApp`;

document.querySelectorAll('[data-shop-about]').forEach((el) => {
  el.textContent = SHOP_ABOUT;
});

/* ── Ubicación ──────────────────────────────────────────────────── */

document.querySelectorAll('[data-shop-locality]').forEach((el) => {
  el.textContent = SHOP_LOCALITY;
});

document.querySelectorAll('[data-shop-locality-short]').forEach((el) => {
  el.textContent = SHOP_LOCALITY.split(',')[0].trim();
});

// La dirección exacta se muestra solo cuando esté confirmada en config.js
document.querySelectorAll('[data-shop-address]').forEach((el) => {
  const address = SHOP_ADDRESS.trim();
  el.textContent = address;
  el.hidden = address === '';
});

document.querySelectorAll('[data-maps-link]').forEach((link) => {
  link.href = MAPS_URL;
});

// Mapa embebido sin API key; las coordenadas muestran un marcador en el punto indicado.
const mapFrame = document.getElementById('map-frame');
if (mapFrame) {
  mapFrame.src = MAPS_EMBED_URL;
}

const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const heroImg = document.getElementById('hero-img');
if (heroImg) {
  heroImg.src = HERO_IMAGE.src;
  heroImg.alt = HERO_IMAGE.alt;
}

const aboutImg = document.getElementById('about-img');
if (aboutImg) {
  aboutImg.src = ABOUT_IMAGE.src;
  aboutImg.alt = ABOUT_IMAGE.alt;
}

document.querySelectorAll('[data-contact-whatsapp]').forEach((link) => {
  if (configured) {
    link.href = buildWhatsAppUrl(WHATSAPP_NUMBER, `¡Hola ${SHOP_NAME}! Quería hacer una consulta.`);
    link.hidden = false;
  } else {
    link.hidden = true;
  }
});

const contactFallback = document.getElementById('contact-fallback');
if (!configured && contactFallback) {
  contactFallback.hidden = false;
  contactFallback.textContent =
    'El contacto por WhatsApp estará disponible cuando el vivero configure su número.';
}

if (!configured) {
  els.warning.hidden = false;
  els.warning.textContent =
    'Aviso: el número de WhatsApp del vivero todavía no está configurado (editar src/config.js). Los pedidos aún no pueden enviarse.';
}

renderAll();
