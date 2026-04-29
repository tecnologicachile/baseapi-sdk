import type { BaseAPIClient } from '../client.js';
import type {
  SiiCredentials,
  TipoRcv,
  RcvResponse,
  RcvBoletasDiariasResponse,
  RcvBoletasDetalleResponse,
} from '../types.js';

export class RcvResource {
  constructor(private client: BaseAPIClient) {}

  /** RCV de un período (compras o ventas) */
  async consultar(periodo: string, tipo: TipoRcv, credentials: SiiCredentials): Promise<RcvResponse> {
    return this.client.request('POST', `/sii/rcv/${periodo}/${tipo}`, { body: credentials as any });
  }

  /** RCV anual agregado (12 meses cacheados individualmente) */
  async anual(year: number, tipo: TipoRcv, credentials: SiiCredentials): Promise<RcvResponse> {
    return this.client.request('POST', `/sii/rcv/anual/${year}/${tipo}`, { body: credentials as any });
  }

  /** Resumen diario de boletas de venta del período */
  async boletasDiarias(periodo: string, credentials: SiiCredentials): Promise<RcvBoletasDiariasResponse> {
    return this.client.request('POST', `/sii/rcv/${periodo}/venta/boletas-diarias`, { body: credentials as any });
  }

  /** Detalle granular de boletas de venta del período */
  async boletasDetalle(periodo: string, credentials: SiiCredentials): Promise<RcvBoletasDetalleResponse> {
    return this.client.request('POST', `/sii/rcv/${periodo}/venta/boletas-detalle`, { body: credentials as any });
  }

  /** DTEs pendientes de aceptación/reclamo en el período */
  async pendientes(periodo: string, credentials: SiiCredentials): Promise<RcvResponse> {
    return this.client.request('POST', `/sii/rcv/${periodo}/compra/pendientes`, { body: credentials as any });
  }
}
