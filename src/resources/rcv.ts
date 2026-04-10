import type { BaseAPIClient } from '../client.js';
import type { SiiCredentials, TipoRcv, RcvResponse } from '../types.js';

export class RcvResource {
  constructor(private client: BaseAPIClient) {}

  async consultar(periodo: string, tipo: TipoRcv, credentials: SiiCredentials): Promise<RcvResponse> {
    return this.client.request('POST', `/sii/rcv/${periodo}/${tipo}`, { body: credentials as any });
  }

  async anual(year: number, tipo: TipoRcv, credentials: SiiCredentials): Promise<RcvResponse> {
    return this.client.request('POST', `/sii/rcv/anual/${year}/${tipo}`, { body: credentials as any });
  }

  async boletasDiarias(periodo: string, credentials: SiiCredentials): Promise<any> {
    return this.client.request('POST', `/sii/rcv/${periodo}/venta/boletas-diarias`, { body: credentials as any });
  }

  async pendientes(periodo: string, credentials: SiiCredentials): Promise<RcvResponse> {
    return this.client.request('POST', `/sii/rcv/${periodo}/compra/pendientes`, { body: credentials as any });
  }
}
