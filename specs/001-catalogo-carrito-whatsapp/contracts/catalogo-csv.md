# Contract: Formato de `productos.csv`

**Feature**: 001-catalogo-carrito-whatsapp | **Tipo**: formato de archivo de datos (entrada)

## Definición

El catálogo se define exclusivamente en el archivo `productos.csv` de la raíz del repositorio.
Cualquier cambio de productos o precios se hace aquí (FR: Catálogo desde CSV, constitución II).

## Formato

- **Codificación**: UTF-8 (sin BOM preferentemente; con BOM tolerado).
- **Separador de campos**: punto y coma `;`.
- **Separador de líneas**: `\n` o `\r\n` (ambos tolerados, típico de Excel).
- **Encabezado**: primera línea no vacía `CATEGORIA;PRODUCTO;PRECIO` (se ignora al parsear).
- **Filas**: una por producto, en cualquier orden; el orden de aparición define el orden
  dentro de cada categoría.

## Campos

| Posición | Campo | Reglas |
|----------|-------|--------|
| 1 | `CATEGORIA` | Texto no vacío. El conjunto de categorías se deriva de los datos. |
| 2 | `PRODUCTO` | Texto no vacío. Se permiten acentos, `Ñ`, `/`, paréntesis, comillas. |
| 3 | `PRECIO` | Número ≥ 0 en ARS. Formatos aceptados: `22880`, `22.880`, `22880,50`. Interpretación: `.` = miles, `,` = decimales. |

## Ejemplo válido

```csv
CATEGORIA;PRODUCTO;PRECIO
ARBOLES;ACACIA BLANCA C/COPA 15LT;22880
SUCULENTAS;ALOE VERA M14 CULTIVO;2730
ARBOLES;PRODUCTO SIN PRECIO;0
```

## Filas inválidas (se ignoran silenciosamente)

| Caso | Ejemplo |
|------|---------|
| Línea vacía o solo espacios | `` |
| Menos de 3 campos | `ARBOLES;ACACIA` |
| Campo obligatorio vacío | `;;22880` |
| Precio no numérico | `ARBOLES;ACACIA;consultar` |
| Precio negativo | `ARBOLES;ACACIA;-1` |

El sistema MUST mostrar el resto del catálogo con normalidad aunque existan filas inválidas
(edge case de la spec; verificado en `tests/csv.test.js`).

## Garantías

- Un mismo `PRODUCTO` puede existir en dos `CATEGORIA` distintas: son productos distintos.
- Cambiar precios/agregar productos en el CSV y recompilar/publicar MUST reflejar los cambios
  sin tocar código (FR del "Owner del catálogo", SC-006).
