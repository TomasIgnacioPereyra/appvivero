// ────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL VIVERO — este es el único archivo que hay que tocar
// ────────────────────────────────────────────────────────────────────

// Número de WhatsApp que recibe los pedidos.
// Formato: código de país + área + número, SOLO dígitos (sin +, sin espacios).
// Ejemplo (Argentina, Córdoba): '5493511234567'
//  54 = Argentina | 9 = celular | 351 = área | 1234567 = número
// Si se deja vacío (''), el sitio muestra un aviso y deshabilita el envío.
export const WHATSAPP_NUMBER = '5493544546284';

// Nombre que aparece en el encabezado y en el mensaje del pedido.
export const SHOP_NAME = 'Vivero Gaston';

// Texto de presentación de la sección "El vivero".
// Es un texto genérico y editable: reemplazalo por la historia real del vivero.
export const SHOP_ABOUT =
  'Cultivamos y cuidamos cada planta para que llegue sana y lista para crecer ' +
  'en tu jardín, balcón o living. Armá tu pedido desde el catálogo y lo ' +
  'coordinamos juntos por WhatsApp.';

// ── Ubicación ──────────────────────────────────────────────────────

// Localidad que se muestra en la sección "Vení a conocernos".
export const SHOP_LOCALITY = 'Las Rabonas, Córdoba, Argentina';

// Dirección exacta del vivero: dejar vacía hasta confirmarla.
// TODO(dirección): cuando esté confirmada, escribirla acá (ej.: 'Ruta 5, km 3')
// y aparecerá automáticamente en la sección de ubicación. No inventar direcciones.
export const SHOP_ADDRESS = '';

// Enlace de Google Maps para "Cómo llegar" y "Abrir en Google Maps".
// Coordenadas compartidas para mostrar el punto exacto en el mapa público.
export const SHOP_COORDINATES = '-31.8658498,-64.9806302';

// Google Maps centra el mapa y muestra un marcador en las coordenadas.
export const MAPS_URL = `https://www.google.com/maps?q=${encodeURIComponent(SHOP_COORDINATES)}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(SHOP_COORDINATES)}&z=16&output=embed`;
