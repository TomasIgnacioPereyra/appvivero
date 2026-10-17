# Contract: Formato de `productos.csv`

**Feature**: 001-catalogo-carrito-whatsapp | **Tipo**: formato de archivo de datos (entrada)

## Definición

El catálogo se define exclusivamente en el archivo `productos.csv` de la raíz del repositorio.
Cualquier cambio de productos o precios se hace aquí (FR: Catálogo desde CSV, constitución II).

## Formato

- **Codificación**: UTF-8 (sin BOM preferentemente; con BOM tolerado).
- **Separador de campos**: punto y coma `;` (recomendado) o coma `,` (tolerado: es lo que escriben
  Excel/LibreOffice al guardar; se detecta solo mirando la primera línea con contenido).
- **Separador de líneas**: `\n` o `\r\n` (ambos tolerados, típico de Excel).
- **Comillas**: se aceptan campos entrecomillados con `"` (un separador dentro de comillas no corta el
  campo); `""` dentro de un campo entrecomillado representa una comilla literal.
- **Encabezado**: primera línea no vacía `CATEGORIA;PRODUCTO;PRECIO;ID` (se ignora al parsear).
- **Filas**: una por producto, en cualquier orden; el orden de aparición define el orden
  dentro de cada categoría.

## Campos

| Posición | Campo | Reglas |
|----------|-------|--------|
| 1 | `CATEGORIA` | Texto no vacío. El conjunto de categorías se deriva de los datos. |
| 2 | `PRODUCTO` | Texto no vacío. Se permiten acentos, `Ñ`, `/`, paréntesis, comillas. |
| 3 | `PRECIO` | Número ≥ 0 en ARS. Formatos aceptados: `22880`, `22.880`, `22880,50`. Interpretación: `.` = miles, `,` = decimales. |
| 4 | `ID` | Entero > 0. Autoincremental desde 1 en el orden de las filas. Es un dato de referencia: el identificador interno del producto sigue siendo `categoria|nombre` (`productId`). |

La categoría se ancla al primer campo y el `ID`/`PRECIO` a los dos últimos, de modo que un
separador (`;` o `,`) extra dentro de `PRODUCTO` se conserva como parte del nombre. Con separador
`,` un precio con coma decimal debe ir entrecomillado (`"2.730,50"`).

## Ejemplo válido

```csv
CATEGORIA;PRODUCTO;PRECIO;ID
ARBOLES;ACACIA BLANCA C/COPA 15LT;22880;1
SUCULENTAS;ALOE VERA M14 CULTIVO;2730;2
ARBOLES;PRODUCTO SIN PRECIO;0;3
```

## Filas inválidas (se ignoran silenciosamente)

| Caso | Ejemplo |
|------|---------|
| Línea vacía o solo espacios | `` |
| Menos de 4 campos | `ARBOLES;ACACIA;22880` |
| Campo obligatorio vacío | `;;22880;5` |
| Precio no numérico | `ARBOLES;ACACIA;consultar;6` |
| Precio negativo | `ARBOLES;ACACIA;-1;7` |
| `ID` no entero, cero o negativo | `ARBOLES;ACACIA;1000;abc` |

El sistema MUST mostrar el resto del catálogo con normalidad aunque existan filas inválidas
(edge case de la spec; verificado en `tests/csv.test.js`).

## Garantías

- Un mismo `PRODUCTO` puede existir en dos `CATEGORIA` distintas: son productos distintos.
- Cambiar precios/agregar productos en el CSV y recompilar/publicar MUST reflejar los cambios
  sin tocar código (FR del "Owner del catálogo", SC-006).
