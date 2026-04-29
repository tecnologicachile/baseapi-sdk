import type { BaseAPIClient } from '../client.js';
import type { Region, Comuna, TipoRetencion, TipoTraslado } from '../types.js';

export class DatosResource {
  constructor(private client: BaseAPIClient) {}

  /** Lista de regiones de Chile (público, sin auth) */
  async regiones(): Promise<Region[]> {
    return this.client.request('GET', '/sii/datos/regiones');
  }

  /** Comunas de una región por código */
  async comunas(codigoRegion: string): Promise<Comuna[]> {
    return this.client.request('GET', `/sii/datos/regiones/${codigoRegion}/comunas`);
  }

  /** Lista todas las comunas de Chile */
  async todasLasComunas(): Promise<Comuna[]> {
    return this.client.request('GET', '/sii/datos/comunas');
  }

  /** Búsqueda de comunas por nombre */
  async buscarComuna(query: string): Promise<Comuna[]> {
    return this.client.request('GET', '/sii/datos/comunas/buscar', { query: { q: query } });
  }

  /** Tipos de retención BHE (1 = retención cliente, 2 = retención emisor) */
  async tiposRetencion(): Promise<TipoRetencion[]> {
    return this.client.request('GET', '/sii/datos/tipos-retencion');
  }

  /** Tipos de traslado para guía despacho */
  async tiposTraslado(): Promise<TipoTraslado[]> {
    return this.client.request('GET', '/sii/datos/tipos-traslado');
  }
}
