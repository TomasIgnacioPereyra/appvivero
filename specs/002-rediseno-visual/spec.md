# Feature Specification: Rediseño Visual — Catálogo Profesional de Plantas

**Feature Branch**: `002-rediseno-visual`

**Created**: 2026-10-11

**Status**: Draft

**Input**: Pedido del usuario: rediseñar la interfaz de AppVivero con estética botánica
contemporánea (natural, elegante, cálida, comercial), preservando el 100% de la funcionalidad
existente (catálogo desde CSV, carrito con localStorage, envío por WhatsApp, validaciones).

## Contexto y restricciones

- Frontend estático: Vite + JavaScript vanilla. NO migrar a frameworks, NO backend,
  NO dependencias innecesarias (constitución I y IV).
- No alterar `productos.csv` ni el contrato de WhatsApp ni los módulos de `src/lib/`.
- No duplicar la configuración de `SHOP_NAME` / `WHATSAPP_NUMBER` (vive solo en `src/config.js`).
- No inventar datos comerciales (dirección, horarios, años, testimonios, promociones).

## Alcance visual

### Paleta y tipografía
- Paleta obligatoria: `--color-forest #244B35`, `--color-sage #78966A`, `--color-cream #F6F3E9`,
  `--color-sand #D8A66A`, `--color-text #333A32`, `--color-white #FFFFFF`,
  `--color-border #E5E3D8`. Fondo crema/blanco cálido; verde bosque para elementos importantes;
  salvia en detalles; arena en acentos.
- Títulos con serif contemporánea y texto/controles con sans moderna (Google Fonts con
  fallback funcional si no hay conexión).

### Encabezado y navegación
- Cabecera compacta: marca con símbolo botánico + `SHOP_NAME`, navegación a secciones,
  acceso al carrito con cantidad de unidades (y total cuando haya ítems), menú móvil funcional.

### Hero
- Título "Tu próximo rincón verde empieza acá." / descripción "Descubrí plantas, árboles y todo
  lo que necesitás para darle vida a tus espacios." / botón "Explorar plantas" → catálogo.
- Fotografía amplia y real de un vivero con vegetación y luz natural. Composición editorial,
  compacta en móvil para que el catálogo quede accesible.

### Catálogo (sección protagonista)
- Tarjetas con imagen representativa, nombre, categoría, precio real (formato ARS) y control de
  agregado con estado visual claro tras agregar.
- Grilla responsive: 1–2 columnas en teléfonos, 2–3 en tablets, 3–4 en escritorio.
- Imágenes: el CSV no tiene columna de imágenes → mapeo opcional separado por categoría/producto
  en `src/data/images.js` (URLs verificadas o locales reemplazables), carga diferida, placeholder
  botánico ante error, sin romper la tarjeta.
- Chips de categorías generados desde los datos reales (reutilizando la lógica existente) con
  estado activo y opción "Todas".

### Carrito
- Rediseño de presentación sin cambiar comportamiento: panel lateral en escritorio, drawer
  accesible en móvil; nombre, cantidad, precio unitario, subtotal, total; incrementar/reducir,
  eliminar, vaciar, seguir comprando y enviar por WhatsApp.
- El acceso muestra cantidad total de unidades y el importe acumulado.
- En móvil, un acceso al carrito independiente de la cabecera queda flotante en la parte
  inferior, con cantidad e importe visibles cuando corresponda, y respeta el área segura.
- Sin duplicar lógica de precios/totales/persistencia (vive en `src/lib/cart.js`).

### WhatsApp
- Conservar mecanismo, número, nombre, contenido del pedido, validación y aviso de no
  configurado. Botón "Enviar pedido por WhatsApp" con icono SVG accesible. No afirmar que el
  pedido fue enviado.

### Secciones comerciales breves
- Presentación del vivero, consejos de cuidado (genéricos, sin datos inventados), acceso rápido
  al catálogo y contacto por WhatsApp (omitido si el número no está configurado).
- El catálogo sigue siendo protagonista.

### Responsive y accesibilidad
- Mobile-first; sin scroll horizontal desde 320px; objetivos táctiles ≥44px; foco visible;
  etiquetas accesibles; `prefers-reduced-motion`; transiciones breves.

### Rendimiento
- `loading="lazy"` fuera de la primera pantalla, `width`/`height` para evitar CLS,
  sin nuevas dependencias de runtime; funcional aunque falle una imagen externa.

## Criterios de éxito (medibles)

- **SC-001**: `npm test` y `npm run build` pasan sin errores.
- **SC-002**: El 100% de los flujos existentes (búsqueda, filtro, carrito, persistencia,
  WhatsApp, aviso de número no configurado) siguen funcionando igual en la app compilada.
- **SC-003**: Las 10 categorías del CSV tienen imagen asignada; un fallo de carga muestra
  placeholder sin ocultar precio ni botón (verificado por test + navegador).
- **SC-004**: Sin desplazamiento horizontal a 320px de ancho.
- **SC-005**: El mensaje de WhatsApp generado es byte a byte el mismo que antes del rediseño
  (contrato intacto; verificable con los tests existentes).

## Assumptions

- Las fotografías por categoría son representativas (fotos reales de plantas acordes a la
  categoría, no fotos del producto exacto) y reemplazables por fotos propias en `public/`.
- Los textos de presentación/consejos son genéricos y editables; no representan datos
  comerciales verificados.
- Sin cambios en `productos.csv`, tests existentes, `src/lib/*` ni contratos.
