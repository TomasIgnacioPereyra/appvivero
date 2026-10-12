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
export const SHOP_NAME = 'Vivero El Gato Montés';

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
// Es un punto de referencia de la zona (no identifica la entrada exacta del vivero).
// Cuando la dirección exacta esté confirmada, reemplazar por el enlace definitivo.
export const MAPS_URL =
  'https://www.google.com/maps/place/Las+Rabonas,+C%C3%B3rdoba/@-31.8658498,-64.9806302,928a,75y,279.54h,71.98t/data=!3m7!1e1!3m5!1swAdtOaLe9CYaPM51tjHxOQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.googleusercontent.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D18.019955142329664%26panoid%3DwAdtOaLe9CYaPM51tjHxOQ%26yaw%3D279.54460269459855!7i16384!8i8192!4m6!3m5!1s0x942d2c404bbaac5d:0x466d1b47b6a39afb!8m2!3d-31.8712493!4d-64.9803147!16s%2Fg%2F122bxp31?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D';
