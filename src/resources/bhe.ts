import type { BaseAPIClient } from '../client.js';
import type { SiiCredentials, BheListarResponse, BheEmitirParams, BheEmitirResponse, BhePdfResponse } from '../types.js';

export class BheReceptorResource {
  constructor(private client: BaseAPIClient) {}

  async listar(year: number, month: number, credentials: SiiCredentials): Promise<BheListarResponse> {
    return this.client.request('POST', `/sii/bhe/receptor/${year}/${month}`, { body: credentials as any });
  }

  async pdf(year: number, month: number, folio: string, params: SiiCredentials & { rut_emisor: string }): Promise<BhePdfResponse> {
    return this.client.request('POST', `/sii/bhe/receptor/${year}/${month}/pdf/${folio}`, { body: params as any });
  }
}

export class BheEmisorResource {
  constructor(private client: BaseAPIClient) {}

  async listar(year: number, month?: number, credentials?: SiiCredentials): Promise<BheListarResponse> {
    const path = month ? `/sii/bhe/emisor/${year}/${month}` : `/sii/bhe/emisor/${year}`;
    return this.client.request('POST', path, { body: credentials as any });
  }

  async emitir(params: BheEmitirParams): Promise<BheEmitirResponse> {
    return this.client.request('POST', '/sii/bhe/emisor/emitir', { body: params as any });
  }

  async anular(params: SiiCredentials & { folio: string }): Promise<any> {
    return this.client.request('POST', '/sii/bhe/emisor/anular', { body: params as any });
  }

  async pdf(year: number, month: number, folio: string, credentials: SiiCredentials): Promise<BhePdfResponse> {
    return this.client.request('POST', `/sii/bhe/emisor/${year}/${month}/pdf/${folio}`, { body: credentials as any });
  }
}
