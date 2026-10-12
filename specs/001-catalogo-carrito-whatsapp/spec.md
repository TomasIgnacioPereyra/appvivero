# Feature Specification: Catálogo de Vivero con Carrito y Pedido por WhatsApp

**Feature Branch**: `001-catalogo-carrito-whatsapp`

**Created**: 2026-10-11

**Status**: Draft

**Input**: User description: "Aplicación de solo frontend para publicar en Vercel o GitHub Pages. Listado de productos de vivero que están en el CSV de esta carpeta, con carrito de compras para agregar cantidad y producto del vivero y después enviar por WhatsApp un mensaje con el carrito agregado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar el catálogo de productos (Priority: P1)

Un cliente entra al sitio del vivero desde su celular y ve todos los productos disponibles
organizados por categoría (árboles, arbustos, aromáticas y huerta, frutales, gramíneas,
interior, plantines, suculentas, trepadoras), con su nombre y precio en pesos. Puede buscar
un producto por nombre y filtrar por categoría para encontrar rápido lo que necesita.

**Why this priority**: sin un catálogo visible y navegable no existe propuesta de valor; es la
base sobre la que se apoyan el carrito y el pedido.

**Independent Test**: abrir la aplicación publicada (o compilada localmente) y verificar que
aparecen todos los productos del CSV agrupados por categoría, que el buscador encuentra
productos por nombre y que el filtro por categoría reduce el listado correctamente.

**Acceptance Scenarios**:

1. **Given** el cliente abre la aplicación, **When** la página termina de cargar, **Then** ve
   todos los productos del catálogo agrupados por categoría, cada uno con nombre y precio en
   formato de pesos argentinos.
2. **Given** el catálogo está visible, **When** el cliente escribe parte del nombre de un
   producto en el buscador, **Then** el listado muestra solo los productos que coinciden,
   sin importar mayúsculas ni acentos.
3. **Given** el catálogo está visible, **When** el cliente selecciona una categoría, **Then**
   el listado muestra únicamente los productos de esa categoría y puede volver a "todas".
4. **Given** el cliente busca un nombre que no existe, **When** no hay coincidencias,
   **Then** ve un mensaje claro de "sin resultados" (no una pantalla vacía).

---

### User Story 2 - Armar el carrito de compras (Priority: P1)

Desde el catálogo, el cliente agrega productos al carrito indicando la cantidad deseada.
Puede ver el contenido del carrito con cantidades, precios unitarios, subtotales y total,
cambiar cantidades, quitar productos y vaciar el carrito.

**Why this priority**: el carrito es el mecanismo que convierte la intención de compra en un
pedido concreto; sin él no hay nada que enviar por WhatsApp.

**Independent Test**: agregar 3 productos distintos con cantidades diferentes, verificar
subtotales y total; cambiar una cantidad; quitar un producto; verificar que totales y cantidad
de ítems del contador se actualizan correctamente.

**Acceptance Scenarios**:

1. **Given** un producto en el catálogo, **When** el cliente toca "Agregar" (con cantidad 1
   por defecto), **Then** el producto se suma al carrito y el contador del carrito se
   incrementa.
2. **Given** un producto ya está en el carrito, **When** el cliente lo agrega otra vez,
   **Then** su cantidad se acumula en el mismo ítem (no se duplica la línea).
3. **Given** el carrito tiene ítems, **When** el cliente cambia la cantidad de un ítem,
   **Then** el subtotal del ítem y el total general se recalculan.
4. **Given** el carrito tiene ítems, **When** el cliente quita un ítem o lo reduce a
   cantidad 0, **Then** el ítem desaparece del carrito y los totales se recalculan.
5. **Given** el carrito está vacío, **When** el cliente intenta verlo, **Then** ve un estado
   vacío comprensible con acceso al catálogo.

---

### User Story 3 - Enviar el pedido por WhatsApp (Priority: P1)

El cliente, con el carrito armado, toca "Enviar pedido por WhatsApp" y se abre la aplicación
de WhatsApp con una conversación hacia el vivero cuyo mensaje contiene el detalle completo del
pedido: cada producto con su cantidad y subtotal, y el total general. El cliente solo debe
confirmar el envío en WhatsApp.

**Why this priority**: es el cierre del flujo; es la única vía de conversión de la aplicación.

**Independent Test**: con un carrito de prueba, generar el mensaje y verificar que el texto
contiene todos los ítems con cantidades, subtotales y total, y que el enlace abre WhatsApp
hacia el número configurado con ese texto precargado.

**Acceptance Scenarios**:

1. **Given** un carrito con ítems y el número del vivero configurado, **When** el cliente
   toca "Enviar pedido por WhatsApp", **Then** se abre WhatsApp con un mensaje precargado que
   detalla cada producto (cantidad, nombre, subtotal) y el total del pedido.
2. **Given** el carrito está vacío, **When** el cliente mira la acción de enviar, **Then**
   esta no está disponible (deshabilitada) y no puede generar un pedido vacío.
3. **Given** el número de WhatsApp todavía no fue configurado, **When** el cliente intenta
   enviar el pedido, **Then** la aplicación avisa claramente que el número no está
   configurado y no abre un chat inválido.
4. **Given** el mensaje generado, **When** el cliente lo revisa en WhatsApp, **Then** los
   nombres de productos, cantidades, subtotales y total coinciden exactamente con el carrito,
   con precios en pesos argentinos.

---

### User Story 4 - Conservar el carrito entre visitas (Priority: P2)

Si el cliente cierra la pestaña o el navegador y vuelve más tarde desde el mismo dispositivo,
encuentra su carrito tal como lo dejó.

**Why this priority**: mejora la conversión en compras largas (recorrer el vivero, consultar
con la familia), pero el flujo puede completarse igual sin esta garantía.

**Independent Test**: agregar productos, recargar la página y verificar que el carrito
persiste; limpiar el carrito y verificar que la recarga muestra carrito vacío.

**Acceptance Scenarios**:

1. **Given** el cliente armó un carrito, **When** recarga la página o vuelve a abrir el sitio
   en el mismo dispositivo, **Then** el carrito conserva los mismos ítems y cantidades.
2. **Given** el cliente vacía el carrito, **When** recarga la página, **Then** el carrito
   sigue vacío.

---

### User Story 5 - Actualizar el catálogo sin tocar código (Priority: P3)

El dueño del vivero cambia precios o agrega productos editando el archivo CSV y volviendo a
publicar el sitio, sin intervención de desarrollo.

**Why this priority**: es clave para la sostenibilidad del proyecto, aunque no afecta la
experiencia del cliente final.

**Independent Test**: modificar un precio en el CSV, compilar/publicar, y verificar que el
sitio muestra el precio modificado.

**Acceptance Scenarios**:

1. **Given** el CSV con un precio actualizado, **When** se vuelve a publicar el sitio,
   **Then** el catálogo muestra el precio nuevo y ningún dato viejo.
2. **Given** el CSV con una fila malformada o vacía, **When** la aplicación carga,
   **Then** esa fila se ignora y el resto del catálogo se muestra normalmente.

---

### Edge Cases

- **CSV con filas vacías, con espacios extra o con saltos de línea al final**: deben
  ignorarse sin errores ni productos fantasma.
- **Precio con separador de miles o decimales en el CSV**: se interpreta el valor numérico y
  se muestra formateado en pesos; un valor no numérico descarta la fila de forma tolerante.
- **Productos con el mismo nombre en categorías distintas**: se consideran productos
  distintos (la identidad incluye la categoría).
- **Búsqueda con acentos o mayúsculas** (ej.: "pezuña" vs "PEZUÑA"): debe encontrar
  coincidencias.
- **Cantidad muy grande**: la cantidad se acota a un máximo razonable (99 unidades por ítem).
- **WhatsApp no instalado en el dispositivo**: el enlace abre WhatsApp Web; no se requiere un
  fallback adicional en v1.
- **Abrir el sitio sin conexión**: la app no carga (no hay service worker en v1); se documenta
  como fuera de alcance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar todos los productos del archivo `productos.csv`,
  agrupados por su categoría, con nombre y precio.
- **FR-002**: El sistema MUST formatear todos los precios como pesos argentinos (ej.:
  `$ 22.880`).
- **FR-003**: El sistema MUST permitir buscar productos por nombre, sin distinguir mayúsculas
  ni acentos, y mostrar un mensaje claro cuando no hay resultados.
- **FR-004**: El sistema MUST permitir filtrar por categoría (y volver a ver todas).
- **FR-005**: El sistema MUST permitir agregar cualquier producto al carrito indicando la
  cantidad (por defecto 1).
- **FR-006**: Agregar un producto ya presente en el carrito MUST acumular su cantidad en la
  misma línea.
- **FR-007**: El sistema MUST permitir, por cada ítem del carrito, cambiar la cantidad y
  quitarlo.
- **FR-008**: El sistema MUST mostrar en todo momento el contador de ítems del carrito, el
  subtotal por ítem y el total general.
- **FR-009**: El sistema MUST deshabilitar el envío con carrito vacío.
- **FR-010**: El sistema MUST generar, a partir del carrito, un mensaje de WhatsApp con:
  saludo, una línea por producto (cantidad, nombre y subtotal) y total general, y abrir
  `https://wa.me/<número>` con ese mensaje precargado.
- **FR-011**: El número de WhatsApp del vivero MUST estar centralizado en un único lugar de
  configuración, claramente identificable y reemplazable sin conocimientos técnicos.
- **FR-012**: Si el número de WhatsApp no está configurado, el sistema MUST avisar en la
  interfaz y MUST NOT abrir un chat inválido.
- **FR-013**: El carrito MUST persistir en el almacenamiento local del navegador entre
  recargas y visitas del mismo dispositivo.
- **FR-014**: La aplicación MUST funcionar como sitio 100% estático, sin llamadas a servidores
  propios en tiempo de ejecución.
- **FR-015**: La interfaz MUST ser responsiva mobile-first, en español (Argentina), usable en
  pantallas desde 320px de ancho.
- **FR-016**: La cantidad por ítem MUST acotarse entre 1 y 99 unidades.

### Key Entities

- **Producto**: artículo del catálogo; atributos: categoría, nombre, precio (pesos
  argentinos). Identidad: categoría + nombre.
- **Categoría**: agrupación de productos definida en el CSV (ej.: ÁRBOLES, SUCULENTAS).
- **Ítem del carrito**: producto + cantidad; subtotal derivado (precio × cantidad).
- **Configuración del sitio**: número de WhatsApp del vivero (único dato editable por el
  dueño fuera del CSV).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un cliente encuentra un producto buscándolo por nombre en menos de 10 segundos.
- **SC-002**: Un cliente completa el flujo armar carrito con 3 productos → enviar por WhatsApp
  en menos de 3 minutos en un celular de gama media.
- **SC-003**: El 100% de los productos del CSV (filas válidas) son visibles en el catálogo,
  con nombre y precio correctos.
- **SC-004**: El 100% del contenido del carrito (ítems, cantidades, subtotales y total)
  coincide con el mensaje generado para WhatsApp.
- **SC-005**: El carrito sobrevive una recarga de página en el 100% de los casos en el mismo
  dispositivo.
- **SC-006**: Actualizar un precio en el CSV y republicar refleja el cambio sin modificar
  código, en menos de 10 minutos de trabajo para el dueño.
- **SC-007**: La página inicial es utilizable en un celular gama media con conexión 3G en
  menos de 5 segundos.

## Assumptions

- Los precios del CSV son enteros en pesos argentinos y representan el precio final; no se
  aplican impuestos ni descuentos en la aplicación.
- WhatsApp es el único canal de cierre de compra; el pago y la entrega se coordinan en la
  conversación (fuera del alcance de la app).
- El vivero usa un único número de WhatsApp para recibir pedidos.
- El catálogo real es el CSV provisto (399 productos al momento de la especificación).
- Se asume conectividad a internet para cargar el página y para abrir WhatsApp; el uso offline
  queda fuera de alcance en v1.
- El público objetivo usa navegadores modernos de celular (Chrome/Safari actuales).
- No se gestiona stock ni disponibilidad en v1; todos los productos del CSV se consideran
  ofrecibles.
