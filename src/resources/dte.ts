import type { BaseAPIClient } from '../client.js';
import type {
  EmpresaCredentials,
  EmisionCredentials,
  DteEmitirParams,
  DteEmitirResponse,
  DteAnularParams,
  DteNotaCreditoMontosParams,
  DteNotaCreditoTextoParams,
  DteNotaDebitoParams,
  DteValidarParams,
  DteValidarResponse,
  DteValidezParams,
  DteValidezResponse,
  DteConsultaResponse,
  DteRecibidosResponse,
  DteReceptorResponse,
  DteEmisorResponse,
  DteTipo,
  DtePdfResponse,
  DteXmlToPdfParams,
} from '../types.js';

export class DteConsultaResource {
  constructor(private client: BaseAPIClient) {}

  async listar(periodo: string, credentials: EmpresaCredentials, query?: { tipo_dte?: number }): Promise<DteConsultaResponse> {
    return this.client.request('POST', `/sii/dte/consulta/${periodo}`, {
      body: credentials as any,
      query: query as any,
    });
  }

  async folio(periodo: string, folio: number, credentials: EmpresaCredentials): Promise<DteConsultaResponse> {
    return this.client.request('POST', `/sii/dte/consulta/${periodo}/folio/${folio}`, { body: credentials as any });
  }

  async pdf(folio: number, credentials: EmpresaCredentials): Promise<DtePdfResponse> {
    return this.client.request('POST', `/sii/dte/consulta/folio/${folio}/pdf`, { body: credentials as any });
  }
}

export class DteRecibidosResource {
  constructor(private client: BaseAPIClient) {}

  async listar(periodo: string, credentials: EmpresaCredentials, query?: { tipo_dte?: number }): Promise<DteRecibidosResponse> {
    return this.client.request('POST', `/sii/dte/recibidos/${periodo}`, {
      body: credentials as any,
      query: query as any,
    });
  }

  async folio(periodo: string, folio: number, credentials: EmpresaCredentials): Promise<DteRecibidosResponse> {
    return this.client.request('POST', `/sii/dte/recibidos/${periodo}/folio/${folio}`, { body: credentials as any });
  }

  async pdf(folio: number, credentials: EmpresaCredentials): Promise<DtePdfResponse> {
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

  async guiaDespacho(params: DteEmitirParams & { tipo_traslado: number }): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/emitir/guia-despacho', { body: params as any });
  }
}

export class DtePreviewResource {
  constructor(private client: BaseAPIClient) {}

  /** Genera el preview/borrador de una factura sin firmarla ni emitirla */
  async factura(params: DteEmitirParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/preview/factura', { body: params as any });
  }
}

export class DteNotaCreditoResource {
  constructor(private client: BaseAPIClient) {}

  /** NC para corregir montos del DTE original (folio_referencia) */
  async montos(params: DteNotaCreditoMontosParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/nota-credito/montos', { body: params as any });
  }

  /** NC para corregir texto (giro, dirección, etc.) del DTE original */
  async texto(params: DteNotaCreditoTextoParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/nota-credito/texto', { body: params as any });
  }
}

export class DteResource {
  public readonly consulta: DteConsultaResource;
  public readonly recibidos: DteRecibidosResource;
  public readonly emitir: DteEmitirResource;
  public readonly preview: DtePreviewResource;
  public readonly notaCredito: DteNotaCreditoResource;

  constructor(private client: BaseAPIClient) {
    this.consulta = new DteConsultaResource(client);
    this.recibidos = new DteRecibidosResource(client);
    this.emitir = new DteEmitirResource(client);
    this.preview = new DtePreviewResource(client);
    this.notaCredito = new DteNotaCreditoResource(client);
  }

  /** Anula un DTE emitido (genera NC de anulación automática) */
  async anular(params: DteAnularParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/anular', { body: params as any });
  }

  /** ND para corregir montos al alza */
  async notaDebito(params: DteNotaDebitoParams): Promise<DteEmitirResponse> {
    return this.client.request('POST', '/sii/dte/nota-debito', { body: params as any });
  }

  /** Validación local del DTO sin tocar el SII */
  async validar(params: DteValidarParams): Promise<DteValidarResponse> {
    return this.client.request('POST', '/sii/dte/validar', { body: params as any });
  }

  /** Verifica validez de un DTE ya emitido por folio + RUT emisor */
  async validez(params: DteValidezParams): Promise<DteValidezResponse> {
    return this.client.request('POST', '/sii/dte/validez', { body: params as any });
  }

  /** Convierte el XML del DTE a PDF */
  async xmlToPdf(params: DteXmlToPdfParams): Promise<DtePdfResponse> {
    return this.client.request('POST', '/sii/dte/xml-to-pdf', { body: params as any });
  }

  /** Datos del receptor por RUT (autocompletado SII) */
  async receptor(rut: string, credentials: EmpresaCredentials): Promise<DteReceptorResponse> {
    return this.client.request('POST', `/sii/dte/receptor/${rut}`, { body: credentials as any });
  }

  /** Datos del emisor (empresa autenticada) */
  async emisor(credentials: EmpresaCredentials): Promise<DteEmisorResponse> {
    return this.client.request('POST', '/sii/dte/emisor', { body: credentials as any });
  }

  /** Lista de tipos de DTE soportados (33, 34, 39, 41, 52, 56, 61, etc.) */
  async tipos(): Promise<DteTipo[]> {
    return this.client.request('GET', '/sii/dte/tipos');
  }
}

// Re-export legacy classes for backwards compat — pero el preferido es DteResource
export { DteConsultaResource as _DteConsultaResource, DteRecibidosResource as _DteRecibidosResource };
