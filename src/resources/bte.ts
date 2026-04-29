import type { BaseAPIClient } from '../client.js';
import type {
  SiiCredentials,
  EmpresaCredentials,
  BteEmitirParams,
  BteEmitirResponse,
  BteAnularParams,
  BteListarResponse,
} from '../types.js';

export class BteResource {
  constructor(private client: BaseAPIClient) {}

  /** Lista BTE recibidas en el año (consulta para receptor) */
  async listar(year: number, credentials: SiiCredentials): Promise<BteListarResponse> {
    return this.client.request('POST', `/sii/bte/${year}`, { body: credentials as any });
  }

  /** Lista BTE emitidas en un período (year/month) por la empresa */
  async emitidas(year: number, month: number, credentials: EmpresaCredentials): Promise<BteListarResponse> {
    return this.client.request('POST', `/sii/bte/emitidas/${year}/${month}`, { body: credentials as any });
  }

  /** Emite una boleta de terceros */
  async emitir(params: BteEmitirParams): Promise<BteEmitirResponse> {
    return this.client.request('POST', '/sii/bte/emitir', { body: params as any });
  }

  /** Anula una BTE emitida */
  async anular(params: BteAnularParams): Promise<BteEmitirResponse> {
    return this.client.request('POST', '/sii/bte/anular', { body: params as any });
  }
}
