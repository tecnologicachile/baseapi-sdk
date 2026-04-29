# baseapi-cl — SDK oficial para integrar el SII de Chile en Node.js

[![npm version](https://img.shields.io/npm/v/baseapi-cl.svg?style=flat-square)](https://www.npmjs.com/package/baseapi-cl)
[![npm downloads](https://img.shields.io/npm/dm/baseapi-cl.svg?style=flat-square)](https://www.npmjs.com/package/baseapi-cl)
[![bundle size](https://img.shields.io/bundlephobia/minzip/baseapi-cl?style=flat-square)](https://bundlephobia.com/package/baseapi-cl)
[![types included](https://img.shields.io/npm/types/baseapi-cl?style=flat-square)](https://www.npmjs.com/package/baseapi-cl)
[![license](https://img.shields.io/npm/l/baseapi-cl?style=flat-square)](./LICENSE)

**SDK oficial en TypeScript para [BaseAPI.cl](https://baseapi.cl)** — la API de automatización del **Servicio de Impuestos Internos (SII) de Chile**. Emite facturas electrónicas (DTE), boletas de honorarios (BHE), boletas de terceros (BTE), consulta el Registro de Compras y Ventas (RCV), descarga la carpeta tributaria, declaraciones juradas (DJ), Formulario 22 y más, con una sola línea de código desde Node.js.

```bash
npm install baseapi-cl
```

## ¿Por qué usar este SDK?

- **API REST tipada** — todos los endpoints del SII expuestos con TypeScript types completos. IntelliSense en tu editor para cada parámetro.
- **Cero dependencias** — usa `fetch` nativo de Node 18+. Bundle minimalista.
- **Reintentos automáticos** — backoff exponencial en errores `429` y `5xx`, respeta `Retry-After`.
- **Errores tipados** — `RateLimitError`, `AuthenticationError`, `ValidationError`, etc.
- **ESM + CJS** — funciona en proyectos modernos y legacy.
- **Producción** — usado por contadores, ERPs, plataformas SaaS, e-commerce y fintechs en Chile.

## Casos de uso

| Necesitas… | Endpoint | Sección |
|---|---|---|
| Emitir facturas electrónicas (DTE 33/34) automáticamente | `dte.emitir.factura` | [DTE](#dte-documentos-tributarios-electrónicos) |
| Anular un DTE con Nota de Crédito automática | `dte.anular` | [Anular DTE](#anulación--notas-de-crédito--notas-de-débito) |
| Emitir boletas de honorarios (BHE) | `bhe.emisor.emitir` | [BHE](#bhe-boletas-de-honorarios) |
| Emitir boletas de terceros (BTE) | `bte.emitir` | [BTE](#bte-boletas-de-terceros) |
| Descargar Registro de Compras y Ventas (RCV) | `rcv.consultar` | [RCV](#rcv-registro-de-compras-y-ventas) |
| Consultar facturas recibidas por período | `dte.recibidos.listar` | [DTE Recibidos](#recibidos) |
| Descargar PDF de un DTE por folio | `dte.consulta.pdf` | [DTE Consulta](#consulta) |
| Validar credenciales SII de tus clientes | `auth.validar` | [Auth](#auth) |
| Obtener datos del receptor para autocompletar | `dte.receptor` | [DTE Otros](#otros) |
| Consultar cesiones de factoring (factura cedida) | `cesiones.consultar` | [Cesiones](#cesiones) |
| Descargar Carpeta Tributaria del contribuyente | `carpetaTributaria.consultar` | [Carpeta](#f22--carpeta-tributaria--dj) |
| Consultar el Formulario 22 (renta anual) | `f22.consultar` | [F22](#f22--carpeta-tributaria--dj) |
| Listar Declaraciones Juradas del año | `dj.consultar` | [DJ](#f22--carpeta-tributaria--dj) |

## Quick start

```typescript
import BaseAPI from 'baseapi-cl';

const client = new BaseAPI('sk_tu_api_key');  // tu API key de baseapi.cl

// 1. Validar credenciales SII
await client.auth.validar({ rut: '12345678-5', password: 'clave_sii' });

// 2. Consultar RCV de compras del mes
const compras = await client.rcv.consultar('2026-03', 'compra', {
  rut: '12345678-5',
  password: 'clave_sii',
});
console.log(`${compras.totalRegistros} documentos recibidos`);

// 3. Emitir una factura electrónica afecta (tipo 33)
const factura = await client.dte.emitir.factura({
  rut: '12345678-5',
  password: 'clave_sii',
  rut_empresa: '76123456-7',
  clave_certificado: 'clave_cert',
  receptor: { rut: '76543210-3' },
  items: [{ nombre: 'Servicio mensual', cantidad: 1, precio: 100000 }],
  descargar_pdf: true,
});

console.log(`Folio ${factura.folio} - Total $${factura.totales?.total}`);
// Folio 1109 - Total $119000
```

## Requisitos

- Node.js >= 18
- API key de [baseapi.cl](https://baseapi.cl) (plan gratuito disponible — 50 consultas/mes a todos los endpoints)
- Credenciales SII del contribuyente (RUT + clave) y, para emisión de DTE, certificado digital con clave

## Endpoints disponibles

### Auth

```typescript
await client.auth.validar({ rut, password });
// { valid: true, rut: '12345678-5' }
```

### Contribuyente

Información tributaria del contribuyente, situación pública, datos de receptor para autocompletar facturación.

```typescript
await client.contribuyente.informacion({ rut, password });
await client.contribuyente.situacionTributaria({ rut });               // sin auth
await client.contribuyente.datosReceptor({ rut, password, rut_receptor });
```

### RCV (Registro de Compras y Ventas)

Descarga el detalle del libro de compras/ventas registrado en el SII, con cache automático para periodos pasados.

```typescript
await client.rcv.consultar('2026-03', 'compra', { rut, password });
await client.rcv.consultar('2026-03', 'venta', { rut, password });
await client.rcv.anual(2025, 'compra', { rut, password });
await client.rcv.boletasDiarias('2026-03', { rut, password });
await client.rcv.boletasDetalle('2026-03', { rut, password });
await client.rcv.pendientes('2026-03', { rut, password });
```

### BHE (Boletas de Honorarios)

Emisión, anulación, consulta y descarga de PDF de Boletas de Honorarios Electrónicas.

```typescript
// Receptor (BHE recibidas)
await client.bhe.receptor.pdf(2026, 3, '123', { rut, password, rut_emisor });

// Emisor
await client.bhe.emisor.listar(2026, 3, { rut, password });
await client.bhe.emisor.emitir({
  rut, password,
  tipo_retencion: 1,                      // 1 = retención cliente, 2 = retención emisor
  rut_destinatario: '76543210-3',
  domicilio_destinatario: 'Av. Principal 123',
  cod_region: '13',
  cod_comuna: '13101',
  prestaciones: [{ descripcion: 'Asesoría', valor: 500000 }],
});
await client.bhe.emisor.anular({ rut, password, folio: '123' });
await client.bhe.emisor.pdf(2026, 3, '123', { rut, password });
```

### BTE (Boletas de Terceros)

Emisión y consulta de Boletas de Terceros (retención de impuestos por servicios prestados a personas naturales).

```typescript
await client.bte.listar(2025, { rut, password });
await client.bte.emitidas(2025, 3, { rut, password, rut_empresa });
await client.bte.emitir({
  rut, password, rut_empresa,
  rut_beneficiario: '12345678-5',
  nombre_beneficiario: 'Juan Perez Gonzalez',
  servicio: 'Consultoria',
  monto: 500000,
});
await client.bte.anular({ rut, password, rut_empresa, folio: '12' });
```

### DTE (Documentos Tributarios Electrónicos)

Cobertura completa del flujo de facturación electrónica: emisión, consulta, anulación, notas de crédito, notas de débito, validación y previsualización.

#### Consulta

```typescript
await client.dte.consulta.listar('2026-03', { rut, password, rut_empresa });
await client.dte.consulta.folio('2026-03', 12345, { rut, password, rut_empresa });
await client.dte.consulta.pdf(12345, { rut, password, rut_empresa });
```

#### Recibidos

```typescript
await client.dte.recibidos.listar('2026-03', { rut, password, rut_empresa });
await client.dte.recibidos.folio('2026-03', 12345, { rut, password, rut_empresa });
await client.dte.recibidos.pdf(12345, { rut, password, rut_empresa });
```

#### Emisión

```typescript
const params = {
  rut, password, clave_certificado, rut_empresa,
  receptor: { rut: '76543210-3' },
  items: [{ nombre: 'Servicio profesional', cantidad: 1, precio: 100000 }],
};

await client.dte.preview.factura(params);                              // borrador sin firmar
await client.dte.emitir.factura(params);                               // factura afecta (tipo 33)
await client.dte.emitir.facturaExenta(params);                         // factura exenta (tipo 34)
await client.dte.emitir.guiaDespacho({ ...params, tipo_traslado: 1 }); // guía despacho (tipo 52)
```

#### Anulación / Notas de Crédito / Notas de Débito

```typescript
// Anular un DTE (genera Nota de Crédito de anulación automática)
await client.dte.anular({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  tipo_dte_original: 33,
});

// Nota de Crédito por corrección de montos
await client.dte.notaCredito.montos({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  items: [{ nombre: 'Servicio corregido', cantidad: 1, precio: 50000 }],
});

// Nota de Crédito por corrección de texto (giro, dirección, etc.)
await client.dte.notaCredito.texto({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  giro: 'NUEVO GIRO',
});

// Nota de Débito (corrección al alza)
await client.dte.notaDebito({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  items: [{ nombre: 'Diferencia', cantidad: 1, precio: 25000 }],
});
```

#### Validación

```typescript
// Validar el DTO localmente sin tocar el SII
await client.dte.validar({
  receptor: { rut: '76543210-3' },
  items: [{ nombre: 'Test', cantidad: 1, precio: 100 }],
});

// Verificar validez de un DTE ya emitido
await client.dte.validez({
  rut, password,
  rut_emisor: '76123456-7',
  tipo_dte: 33,
  folio: 1108,
});
```

#### Otros

```typescript
await client.dte.receptor('76543210-3', { rut, password, rut_empresa });
await client.dte.emisor({ rut, password, rut_empresa });
await client.dte.tipos();
await client.dte.xmlToPdf({ xml: '<DTE>...</DTE>' });
```

### Cesiones

Consulta de cesiones electrónicas (factoring) por rol: cedente, cesionario o deudor.

```typescript
await client.cesiones.consultar({
  rut, password,
  tipo_consulta: 'cedente',
  desde: '2026-01-01',
  hasta: '2026-03-31',
});
```

### Honorarios

Consulta agregada de boletas de honorarios por año o por mes.

```typescript
await client.honorarios.anual(2026, { rut, password });
await client.honorarios.consultar(2026, 3, { rut, password });
```

### F22 / Carpeta Tributaria / DJ

Información tributaria anual del contribuyente.

```typescript
await client.f22.consultar(2025, { rut, password });
await client.carpetaTributaria.consultar({ rut, password });
await client.dj.consultar(2025, { rut, password });
```

### Datos auxiliares (sin credenciales)

Catálogos públicos de regiones, comunas, tipos de retención y tipos de traslado.

```typescript
await client.datos.regiones();
await client.datos.comunas('13');
await client.datos.todasLasComunas();
await client.datos.buscarComuna('providencia');
await client.datos.tiposRetencion();
await client.datos.tiposTraslado();
```

## Manejo de errores

```typescript
import BaseAPI from 'baseapi-cl';

try {
  await client.rcv.consultar('2026-03', 'compra', { rut, password });
} catch (e) {
  if (e instanceof BaseAPI.RateLimitError) {
    console.log(`Limite excedido. Reintentar en ${e.retryAfter}s`);
  } else if (e instanceof BaseAPI.AuthenticationError) {
    console.log('API key invalida');
  } else if (e instanceof BaseAPI.PermissionError) {
    console.log('Endpoint no incluido en tu plan');
  } else if (e instanceof BaseAPI.ValidationError) {
    console.log('Parametros invalidos:', e.message);
  } else if (e instanceof BaseAPI.ConnectionError) {
    console.log('Error de red');
  }
}
```

El SDK reintenta automáticamente errores `429` (Too Many Requests) y `5xx` con backoff exponencial.

## Rate limits

```typescript
await client.rcv.consultar('2026-03', 'compra', { rut, password });

const limits = client.rateLimitInfo;
console.log(limits.remaining);     // requests restantes por minuto
console.log(limits.planRemaining); // requests restantes del plan mensual
```

## Configuración

```typescript
const client = new BaseAPI('sk_tu_api_key', {
  baseUrl: 'https://api.baseapi.cl/api/v1',  // default
  timeout: 120000,                           // 2 min — el SII puede ser lento
  maxRetries: 2,                             // reintentos en 429/5xx
});
```

## Preguntas frecuentes

### ¿Necesito un certificado digital?

Solo para emisión de DTE (facturas, notas de crédito, notas de débito, guías de despacho). Para consultas (RCV, DTE recibidos, BHE recibidas, contribuyente, etc.) basta con RUT + clave SII.

### ¿Funciona con cualquier RUT empresa?

Sí, mientras la empresa esté habilitada en el portal de **Facturación Electrónica MiPyme** del SII. El SDK automatiza ese portal — empresas con sistema propio (con el mercado, OnlinerR, Defontana, etc.) deben usar las APIs de su proveedor.

### ¿Se puede usar en Next.js / Vercel / AWS Lambda?

Sí. Compatible con cualquier runtime Node.js >= 18. ESM y CJS soportados. Funciona en serverless si el timeout de la función es >= 120s para emisión.

### ¿Cuánto cuesta?

El plan gratuito de [BaseAPI.cl](https://baseapi.cl) incluye 50 consultas mensuales a todos los endpoints. Existen planes pagos para mayor volumen.

### ¿Puedo usarlo desde el navegador (browser)?

No. El SDK requiere Node.js. Las credenciales SII no deben enviarse desde el frontend. Llama el SDK desde tu backend (API route, Lambda, edge function) y expone tu propia API a tu frontend.

### ¿Soporta sandbox para pruebas?

Sí. RUT `11111111-1` es el sandbox de baseapi.cl: emite folios mock sin tocar el SII real. Útil para CI/CD y desarrollo local.

### ¿Es oficial del SII?

No. BaseAPI.cl es un servicio independiente que automatiza el portal público del SII (no usa APIs internas no documentadas del SII). El SII no provee API REST oficial para muchas operaciones; este SDK llena ese vacío.

## Documentación completa

- **Página oficial:** [baseapi.cl](https://baseapi.cl)
- **Documentación de la API:** [api.baseapi.cl/docs/client](https://api.baseapi.cl/docs/client)
- **Código fuente:** [github.com/tecnologicachile/baseapi-sdk](https://github.com/tecnologicachile/baseapi-sdk)

## Licencia

[MIT](./LICENSE) — Tecnológica Chile SpA
