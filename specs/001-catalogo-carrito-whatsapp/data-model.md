# Data Model: Catálogo de Vivero con Carrito y Pedido por WhatsApp

**Phase 1** — Entidades, campos y reglas de validación derivadas de la especificación.

## Producto

Representa un artículo del catálogo. Origen: una fila válida de `productos.csv`.

| Campo | Tipo | Origen | Reglas |
|-------|------|--------|--------|
| `categoria` | string | CSV columna 1 | Requerido; `trim()`; texto tal cual figura en el CSV (ej.: `ÁRBOLES`). |
| `nombre` | string | CSV columna 2 | Requerido; `trim()`; puede contener acentos, `Ñ`, comillas, paréntesis. |
| `precio` | number | CSV columna 3 | Requerido; número en ARS ≥ 0 tras normalizar (`.` = separador de miles, `,` = decimales). |

**Identidad**: `categoria + '|' + nombre` (un mismo nombre en dos categorías son dos
productos distintos — edge case de la spec).

**Fila inválida** (se ignora): menos de 3 campos, campo vacío, precio no numérico o negativo.

## Categoria

Agrupación derivada del catálogo. No es una entidad almacenada: se calcula agrupando productos
por su campo `categoria`, preservando el orden de aparición en el CSV.

| Derivado | Reglas |
|----------|--------|
| `nombre` | Valor único de `producto.categoria`. |
| `productos` | Lista ordenada como aparece en el CSV. |
| `cantidadProductos` | Para el contador del filtro. |

## ItemCarrito

Producto + cantidad dentro del carrito.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `producto` | Producto | Referencia al producto (identidad `categoria|nombre`). |
| `cantidad` | number entero | 1..99 (FR-016). Al llegar a 0 (o "quitar") el ítem se elimina (FR-007). |
| `subtotal` | number | Derivado: `precio × cantidad`. No se persiste; se calcula al renderizar. |

**Invariantes**:

- No puede haber dos ítems con la misma identidad; agregar acumula cantidad (FR-006) y la
  acumulación también respeta el tope de 99.
- `cantidad` siempre entero ≥ 1 mientras el ítem exista.

## Carrito

| Campo | Tipo | Reglas |
|-------|------|--------|
| `items` | ItemCarrito[] | Orden = orden en que se agregaron. Puede estar vacío. |
| `total` | number | Derivado: suma de subtotales. |
| `count` | number | Derivado: suma de cantidades (contador visible, FR-008). |

**Estados y transiciones**:

```text
vacío ──agregar──▶ con ítems ──enviar por WhatsApp──▶ vacío
  ▲                    │  ▲
  └──vaciar/quitar─────┘  └──seguir agregando──┘
```

Nota: al hacer clic en "Enviar pedido por WhatsApp" se abre WhatsApp con el pedido y el carrito
se vacía automáticamente. La URL de WhatsApp contiene el mensaje completo, por lo que el pedido
no se pierde si el cliente no confirma el envío en WhatsApp.

**Persistencia**: `localStorage`, clave `appvivero.cart.v1`, valor JSON
`[{ categoria, nombre, precio, cantidad }]`. Al cargar la app: parseo defensivo; entradas
inválidas se descartan; si el localStorage no está disponible (modo privado, error), la app
funciona igual sin persistir (degradación silenciosa, sin romper).

## Configuracion

| Campo | Tipo | Reglas |
|-------|------|--------|
| `WHATSAPP_NUMBER` | string | Solo dígitos con código de país (ej.: `5493511234567`). Vacío = no configurado. |
| `SHOP_NAME` | string | Nombre visible del vivero en el encabezado y en el mensaje. |

**Regla de publicación** (FR-012, constitución V): si `WHATSAPP_NUMBER` está vacío o tiene
menos de 8 dígitos, la UI muestra una advertencia persistente y el botón "Enviar pedido por
WhatsApp" queda deshabilitado.

## Mensaje de pedido (derivado)

Generado desde `Carrito` + `Configuracion` (contrato en `contracts/pedido-whatsapp.md`):

```text
¡Hola {SHOP_NAME}! Quiero hacer este pedido:

• 2 × ACACIA BLANCA C/COPA 15LT — $ 45.760
• 1 × ABELIA GRANDIFLORA 4LT CULTIVO — $ 6.760

Total: $ 52.520
```

Reglas: una línea por ítem en el orden del carrito; subtotal formateado `es-AR`; línea en
blanco antes del total; sin acentos rotos (texto plano UTF-8).
