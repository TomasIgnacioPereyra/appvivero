# Feature Specification: Sección de Ubicación

**Feature Branch**: `003-seccion-ubicacion`

**Created**: 2026-10-11

**Status**: Draft

**Input**: Pedido del usuario: incorporar una sección "Vení a conocernos" con la ubicación del
vivero (Las Rabonas, Córdoba) y accesos a Google Maps, integrada a la identidad visual, sin
backend, sin API keys, y sin tocar catálogo/carrito/precios/WhatsApp.

## Alcance

- Sección nueva cerca del final de la página (antes del footer), con enlace "Ubicación" en la
  navegación interna.
- Título "Vení a conocernos" + descripción provista por el usuario.
- Área informativa (ícono, título "Encontranos en <localidad>", localidad, invitación, botón
  "Cómo llegar" y enlace "Abrir en Google Maps") + área de mapa (iframe `output=embed` sin API
  key, con respaldo si no carga).
- Datos de ubicación centralizados en `src/config.js`: `SHOP_LOCALITY`, `SHOP_ADDRESS`
  (pendiente de confirmación; si está vacía no se muestra dirección postal) y `MAPS_URL`
  (enlace provisto por el usuario, no duplicado).
- Enlaces externos con `target="_blank"` + `rel="noopener noreferrer"`; sin afirmar que las
  coordenadas del enlace corresponden a la entrada exacta del vivero.

## Restricciones

- Constitución: solo frontend estático, sin API keys, sin dependencias nuevas.
- No cambiar el contrato de WhatsApp, CSV, ni `src/lib/*`.
- Paleta y tipografías existentes; tarjetas con bordes coherentes al catálogo.
- Si el mapa no carga, la sección sigue siendo útil (info + enlaces funcionan).

## Criterios de éxito

- **SC-001**: `npm test` y `npm run build` pasan.
- **SC-002**: La sección aparece en móvil (una columna) y escritorio (dos columnas), sin scroll
  horizontal a 320px.
- **SC-003**: "Cómo llegar" y "Abrir en Google Maps" apuntan a `MAPS_URL` y abren en pestaña
  nueva con atributos de seguridad.
- **SC-004**: El iframe embebido carga sin API key; si falla, los enlaces externos siguen
  operativos.
- **SC-005**: Ningún dato de dirección exacta inventado; `SHOP_ADDRESS` vacía = no se muestra.
