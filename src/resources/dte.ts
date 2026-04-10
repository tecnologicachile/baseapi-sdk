import type { BaseAPIClient } from '../client.js';
import type { EmpresaCredentials, DteEmitirParams, DteEmitirResponse, DteConsultaResponse } from '../types.js';

export class DteConsultaResource {
  constructor(private client: BaseAPIClient) {}

  async listar(periodo: string, credentials: EmpresaCredentials, query?: Record<string, string | number | undefined>): Promise<DteConsultaResponse> {
    return this.client.request('POST', `/sii/dte/consulta/${periodo}`, { body: credentials as any, query });
  }

  async folio(periodo: string, folio: number, credentials: EmpresaCredentials): Promise<any> {
    return this.client.request('POST', `/sii/dte/consulta/${periodo}/folio/${folio}`, { body: credentials as any });
  }

  async pdf(folio: number, credentials: EmpresaCredentials): Promise<any> {
    return this.client.request('POST', `/sii/dte/consulta/folio/${folio}/pdf`, { body: credentials as any });
  }
}

export class DteRecibidosResource {
  constructor(private client: BaseAPIClient) {}

  async listar(periodo: string, credentials: EmpresaCredentials, query?: Record<string, string | number | undefined>): Promise<any> {
    return this.client.request('POST', `/sii/dte/recibidos/${periodo}`, { body: credentials as any, query });
  }

  async folio(periodo: string, folio: number, credentials: EmpresaCredentials): Promise<any> {
    return this.client.request('POST', `/sii/dte/recibidos/${periodo}/folio/${folio}`, { body: credentials as any });
  }

  async pdf(folio: number, credentials: EmpresaCredentials): Promise<any> {
    return this.client.request('POST', `/sii/dte/recibidos/folio/${folio}/pdf`, { body: credentials as any });
  }
}

export class DteEmitirResource {
  constructor(private client: BaseAPIClient) {}

  async factura(params: DteEmitirParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/emitir/factura', { body: params as any });
  }

  async facturaExenta(params: DteEmitirParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/emitir/factura-exenta', { body: params as any });
  }

  async guiaDespacho(params: DteEmitirParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/emitir/guia-despacho', { body: params as any });
  }
}
