<!--
Sync Impact Report
==================
Version change: (nueva) → 1.0.0
Modified principles: N/A (creación inicial)
Added sections: I. Solo Frontend, Sin Backend | II. Catálogo desde CSV (Fuente Única de Verdad) |
  III. Mobile-First | IV. Simplicidad (YAGNI) | V. Verificación antes de Publicar |
  Restricciones Técnicas | Flujo de Desarrollo | Governance
Removed sections: N/A
Follow-up TODOs: ninguno (todas las fechas definidas al momento de ratificación)
-->

# AppVivero Constitution

## Core Principles

### I. Solo Frontend, Sin Backend

- La aplicación MUST ser 100% estática: sin servidor propio, sin base de datos, sin APIs propias.
- Los pedidos salen del sitio únicamente mediante un enlace profundo a WhatsApp (`wa.me`)
  generado en el navegador.
- El repositorio MUST NOT contener secretos, tokens ni credenciales. El único dato de contacto
  almacenado es el número de WhatsApp del vivero, configurable en un solo lugar.
- Cualquier funcionalidad que requiera backend MUST rechazarse o resolverse con una alternativa
  estática documentada en el plan.

**Rationale**: el objetivo es publicar sin costos de infraestructura en Vercel o GitHub Pages y
mantener el proyecto trivialmente desplegable por una persona no técnica.

### II. Catálogo desde CSV (Fuente Única de Verdad)

- `productos.csv` en la raíz del repositorio es la única fuente de verdad de productos; la
  aplicación lo lee directamente al compilar/cargar, sin copias ni versiones duplicadas.
- El contrato del CSV es: codificación UTF-8, separador `;`, encabezado
  `CATEGORIA;PRODUCTO;PRECIO;ID`, precios enteros en pesos argentinos e `ID` entero > 0
  autoincremental (dato de referencia).
- Actualizar el catálogo MUST implicar solo editar el CSV y volver a publicar; los productos
  MUST NOT estar codificados (hardcodeados) en el código fuente.
- Filas vacías o malformadas MUST ignorarse de forma tolerante sin romper la aplicación.

**Rationale**: el dueño del vivero actualiza precios y productos en Excel/planilla; el CSV es su
herramienta natural y elimina el riesgo de desincronización.

### III. Mobile-First

- Los clientes navegan desde el celular: el diseño MUST ser responsivo, con objetivos táctiles
  cómodos (≥44px) y tipografía legible en pantallas pequeñas.
- El flujo completo (ver catálogo → agregar al carrito → enviar por WhatsApp) MUST poder
  completarse en menos de 3 minutos en un teléfono de gama media.
- Los estados del carrito (vacío, con ítems, enviado) MUST ser visibles y comprensibles sin
  texto técnico.

**Rationale**: la mayoría del tráfico de un vivero local proviene de celulares en el momento de
la compra; una experiencia incómoda en móvil elimina el valor del canal.

### IV. Simplicidad (YAGNI)

- El stack es Vite + JavaScript vanilla + CSS propio; MUST NOT agregarse frameworks de UI ni
  librerías de estado sin justificación explícita en el plan.
- Cada dependencia agregada MUST justificarse por escrito (problema que resuelve y alternativa
  descartada).
- MUST NOT construirse funcionalidad fuera de la especificación vigente ni abstracciones
  prematuras.

**Rationale**: un proyecto chico mantenido por una persona no técnica maximiza su vida útil
cuanto menor sea su superficie de complejidad.

### V. Verificación antes de Publicar

- `npm run build` MUST pasar sin errores antes de cualquier despliegue.
- Los flujos principales (carga del catálogo, agregar/quitar del carrito, generación del mensaje
  de WhatsApp) MUST validarse manualmente sobre la aplicación compilada siguiendo `quickstart.md`.
- El número de WhatsApp MUST estar configurado (sin placeholder) para publicar; en caso contrario
  la interfaz MUST advertirlo explícitamente y deshabilitar el envío.

**Rationale**: no hay backend que falle ruidosamente; la verificación del build y del flujo real
es la única red de seguridad antes de que un cliente intente comprar.

## Restricciones Técnicas

- **Stack**: Vite + JavaScript vanilla + CSS propio. Node.js 20+ solo para desarrollo.
- **Despliegue**: hosting estático en Vercel o GitHub Pages. La compilación MUST funcionar con
  rutas relativas (`base: './'`) para servir la app desde cualquier subdirectorio.
- **Moneda**: pesos argentinos (ARS) con formato regional `es-AR` (ej.: `$ 22.880`).
- **Idioma**: toda la interfaz en español (Argentina), sin texto técnico visible al usuario final.
- **Persistencia**: solo almacenamiento local del navegador (localStorage); sin cookies ni
  servicios externos de analítica en v1.

## Flujo de Desarrollo

- Metodología Spec-Driven Development (spec-kit): constitución → especificación → plan → tareas →
  implementación. Cada feature vive en `specs/NNN-nombre/`.
- Las tareas de `tasks.md` MUST mantenerse actualizadas a medida que avanza la implementación.
- Los commits (cuando el usuario lo solicite) siguen el estilo convencional
  (`feat:`, `fix:`, `docs:`, etc.) y MUST verificar la constitución en cada revisión.

## Governance

- Esta constitución prevalece sobre cualquier otra práctica del proyecto.
- Las enmiendas se documentan con un incremento de versión semántica
  (MAJOR: cambios incompatibles; MINOR: nuevos principios o expansión material; PATCH:
  aclaraciones) y su justificación.
- Todo plan MUST incluir un "Constitution Check"; las violaciones MUST justificarse en
  Complexity Tracking o el plan se rechaza.
- La revisión de cada cambio verifica: regla solo-frontend, CSV como fuente única, mobile-first y
  build exitoso.

**Version**: 1.0.0 | **Ratified**: 2026-10-11 | **Last Amended**: 2026-10-11
