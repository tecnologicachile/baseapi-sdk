# baseapi-cl

Official TypeScript SDK for [BaseAPI.cl](https://baseapi.cl) — Chile SII automation API.

Consulta RCV, contribuyentes, boletas de honorarios, BTE, DTE, cesiones, F22, carpeta tributaria, DJ y mas directamente desde Node.js.

## Instalacion

```bash
npm install baseapi-cl
```

## Uso rapido

```typescript
import BaseAPI from 'baseapi-cl';

const client = new BaseAPI('sk_tu_api_key');

// Validar credenciales SII
const auth = await client.auth.validar({ rut: '12345678-5', password: 'clave' });

// Consultar RCV compras
const compras = await client.rcv.consultar('2026-03', 'compra', {
  rut: '12345678-5',
  password: 'clave',
});

// Emitir factura electronica
const factura = await client.dte.emitir.factura({
  rut: '12345678-5',
  password: 'clave',
  rut_empresa: '76123456-7',
  clave_certificado: 'cert123',
  receptor: { rut: '76543210-3' },
  items: [{ nombre: 'Servicio', cantidad: 1, precio: 100000 }],
  descargar_pdf: true,
});

console.log(factura.folio, factura.totales?.total);
```

## Endpoints disponibles

### Auth
```typescript
await client.auth.validar({ rut, password });
```

### Contribuyente
```typescript
await client.contribuyente.informacion({ rut, password });
await client.contribuyente.situacionTributaria({ rut });
await client.contribuyente.datosReceptor({ rut, password, rut_receptor });
```

### RCV (Registro de Compras y Ventas)
```typescript
await client.rcv.consultar('2026-03', 'compra', { rut, password });
await client.rcv.consultar('2026-03', 'venta', { rut, password });
await client.rcv.anual(2025, 'compra', { rut, password });
await client.rcv.boletasDiarias('2026-03', { rut, password });
await client.rcv.boletasDetalle('2026-03', { rut, password });
await client.rcv.pendientes('2026-03', { rut, password });
```

### BHE (Boletas de Honorarios)
```typescript
// Receptor
await client.bhe.receptor.pdf(2026, 3, '123', { rut, password, rut_emisor });

// Emisor
await client.bhe.emisor.listar(2026, 3, { rut, password });
await client.bhe.emisor.emitir({
  rut, password,
  tipo_retencion: 1,
  rut_destinatario: '76543210-3',
  domicilio_destinatario: 'Calle 123',
  cod_region: '13', cod_comuna: '13101',
  prestaciones: [{ descripcion: 'Servicio', valor: 100000 }],
});
await client.bhe.emisor.anular({ rut, password, folio: '123' });
await client.bhe.emisor.pdf(2026, 3, '123', { rut, password });
```

### BTE (Boletas de Terceros)
```typescript
await client.bte.listar(2025, { rut, password });
await client.bte.emitidas(2025, 3, { rut, password, rut_empresa });
await client.bte.emitir({
  rut, password, rut_empresa,
  rut_beneficiario: '12345678-5',
  nombre_beneficiario: 'Juan Pérez',
  servicio: 'Consultoría',
  monto: 100000,
});
await client.bte.anular({ rut, password, rut_empresa, folio: '12' });
```

### DTE (Documentos Tributarios Electrónicos)

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
  items: [{ nombre: 'Servicio', cantidad: 1, precio: 100000 }],
};

await client.dte.preview.factura(params);     // borrador sin firmar
await client.dte.emitir.factura(params);
await client.dte.emitir.facturaExenta(params);
await client.dte.emitir.guiaDespacho({ ...params, tipo_traslado: 1 });
```

#### Anulación / Notas de Crédito / Notas de Débito
```typescript
// Anular DTE (NC automática)
await client.dte.anular({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  tipo_dte_original: 33,
});

// NC para corregir montos
await client.dte.notaCredito.montos({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  items: [{ nombre: 'Servicio corregido', cantidad: 1, precio: 50000 }],
});

// NC para corregir texto (giro, dirección, etc.)
await client.dte.notaCredito.texto({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  giro: 'NUEVO GIRO',
});

// ND para corregir montos al alza
await client.dte.notaDebito({
  rut, password, clave_certificado, rut_empresa,
  folio_referencia: 1108,
  items: [{ nombre: 'Diferencia', cantidad: 1, precio: 25000 }],
});
```

#### Validación
```typescript
await client.dte.validar({
  receptor: { rut: '76543210-3' },
  items: [{ nombre: 'Test', cantidad: 1, precio: 100 }],
});

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
```typescript
await client.cesiones.consultar({
  rut, password,
  tipo_consulta: 'cedente',
  desde: '2026-01-01',
  hasta: '2026-03-31',
});
```

### Honorarios
```typescript
await client.honorarios.anual(2026, { rut, password });
await client.honorarios.consultar(2026, 3, { rut, password });
```

### F22 / Carpeta Tributaria / DJ
```typescript
await client.f22.consultar(2025, { rut, password });
await client.carpetaTributaria.consultar({ rut, password });
await client.dj.consultar(2025, { rut, password });
```

### Datos auxiliares (sin credenciales)
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

El SDK reintenta automaticamente en errores 429 y 5xx con backoff exponencial.

## Rate limits

```typescript
await client.rcv.consultar('2026-03', 'compra', { rut, password });

const limits = client.rateLimitInfo;
console.log(limits.remaining);     // requests restantes por minuto
console.log(limits.planRemaining); // requests restantes del plan mensual
```

## Configuracion

```typescript
const client = new BaseAPI('sk_tu_api_key', {
  baseUrl: 'https://api.baseapi.cl/api/v1',  // default
  timeout: 120000,  // 2 min (default, SII es lento)
  maxRetries: 2,    // reintentos en 429/5xx (default)
});
```

## Documentacion

- [BaseAPI Docs](https://docs.baseapi.cl)
- [API Reference](https://api.baseapi.cl/docs)

## License

MIT
