# baseapi-cl

Official TypeScript SDK for [BaseAPI.cl](https://baseapi.cl) — Chile SII automation API.

Consulta RCV, contribuyentes, boletas de honorarios, DTE, cesiones y mas directamente desde Node.js.

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
console.log(auth.valid); // true

// Consultar RCV compras
const compras = await client.rcv.consultar('2026-03', 'compra', {
  rut: '12345678-5',
  password: 'clave',
});
console.log(compras.totalRegistros); // 42

// Info contribuyente
const info = await client.contribuyente.informacion({
  rut: '12345678-5',
  password: 'clave',
});
console.log(info.contribuyente.razonSocial);
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
await client.rcv.pendientes('2026-03', { rut, password });
```

### BHE (Boletas de Honorarios)
```typescript
// Receptor
await client.bhe.receptor.listar(2026, 3, { rut, password });
await client.bhe.receptor.pdf(2026, 3, '123', { rut, password, rut_emisor });

// Emisor
await client.bhe.emisor.listar(2026, 3, { rut, password });
await client.bhe.emisor.emitir({ rut, password, tipo_retencion: 1, ... });
await client.bhe.emisor.anular({ rut, password, folio: '123' });
```

### DTE (Documentos Tributarios Electronicos)
```typescript
// Consulta emitidos
await client.dte.consulta.listar('2026-03', { rut, password, rut_empresa });
await client.dte.consulta.pdf(12345, { rut, password, rut_empresa });

// Recibidos
await client.dte.recibidos.listar('2026-03', { rut, password, rut_empresa });

// Emision
await client.dte.emitir.factura({
  rut, password, clave_certificado, rut_empresa,
  receptor: { rut: '76543210-3', razon_social: 'Empresa SPA' },
  items: [{ nombre: 'Servicio', cantidad: 1, precio: 100000 }],
});
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
await client.honorarios.consultar(2026, 3, { rut, password });
```

### Datos auxiliares (sin credenciales)
```typescript
await client.datos.regiones();
await client.datos.comunas('13');
await client.datos.buscarComuna('providencia');
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
  } else if (e instanceof BaseAPI.ValidationError) {
    console.log('Parametros invalidos:', e.message);
  }
}
```

El SDK reintenta automaticamente en errores 429 y 5xx con backoff exponencial.

## Rate limits

```typescript
const compras = await client.rcv.consultar('2026-03', 'compra', { rut, password });

// Consultar limites despues de cada request
const limits = client.rateLimitInfo;
console.log(limits.remaining);   // requests restantes por minuto
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
