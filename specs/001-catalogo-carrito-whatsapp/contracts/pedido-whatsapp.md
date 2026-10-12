# Contract: Mensaje de pedido y enlace de WhatsApp

**Feature**: 001-catalogo-carrito-whatsapp | **Tipo**: interfaz de salida (deep link)

## Enlace

```text
https://wa.me/<NUMERO>?text=<MENSAJE_CODIFICADO>
```

| Parte | Regla |
|-------|-------|
| `NUMERO` | Solo dígitos, código de país incluido, sin `+`, sin espacios ni guiones (ej.: `5493511234567`). Se normaliza eliminando todo carácter no numérico del valor configurado. |
| `MENSAJE_CODIFICADO` | El mensaje completo codificado con `encodeURIComponent` (espacios `%20`, saltos de línea `%0A`, `×` y `—` como UTF-8 percent-encoded). |

**Reglas de emisión**:

- Carrito vacío → el enlace NO se genera; la acción está deshabilitada (FR-009).
- Número no configurado (vacío o <8 dígitos) → NO se genera enlace; se muestra advertencia y
  la acción queda deshabilitada (FR-012).
- Apertura: `window.open(url, '_blank', 'noopener')`.

## Plantilla del mensaje

```text
¡Hola {SHOP_NAME}! Quiero hacer este pedido:

• {cantidad} × {nombreProducto} — {subtotal}
• {cantidad} × {nombreProducto} — {subtotal}

Total: {total}
```

| Regla | Detalle |
|-------|---------|
| Orden de líneas | Igual al orden de ítems del carrito (orden de agregado). |
| `{cantidad}` | Entero 1..99. |
| `{subtotal}` y `{total}` | Formateados es-AR (`$ 22.880`), sin decimales si el precio es entero. |
| Separador de ítem | `×` (U+00D7) con espacios: `2 × PRODUCTO`. |
| Separador cantidad/precio | ` — ` (guion eme U+2014 entre espacios). |
| Línea en blanco | Una, antes de `Total:`. |
| Saludo | `¡Hola {SHOP_NAME}!...`; `SHOP_NAME` proviene de `src/config.js`. |

## Ejemplo verificable

Carrito: 2 × `ACACIA BLANCA C/COPA 15LT` ($22.880) + 1 × `ALOE VERA M14 CULTIVO` ($2.730).
`SHOP_NAME = "Vivero"`.

Mensaje (texto plano):

```text
¡Hola Vivero! Quiero hacer este pedido:

• 2 × ACACIA BLANCA C/COPA 15LT — $ 45.760
• 1 × ALOE VERA M14 CULTIVO — $ 2.730

Total: $ 48.490
```

URL resultante (inicio; el resto va percent-encoded):

```text
https://wa.me/5493511234567?text=%C2%A1Hola%20Vivero!%20Quiero%20hacer%20este%20pedido%3A%0A%0A%E2%80%A2%202...
```

**Verificación automática**: `tests/whatsapp.test.js` valida la composición exacta del mensaje,
el formato de precios y que la URL contenga solo dígitos en el número y el texto codificado.
