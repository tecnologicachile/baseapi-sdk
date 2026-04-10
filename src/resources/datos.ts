import type { BaseAPIClient } from '../client.js';
import type { Region, Comuna } from '../types.js';

export class DatosResource {
  constructor(private client: BaseAPIClient) {}

  async regiones(): Promise<Region[]> {
    return this.client.request('GET', '/sii/datos/regiones');
  }

  async comunas(codigoRegion: string): Promise<Comuna[]> {
    return this.client.request('GET', `/sii/datos/regiones/${codigoRegion}/comunas`);
  }

  async buscarComuna(query: string): Promise<Comuna[]> {
    return this.client.request('GET', '/sii/datos/comunas/buscar', { query: { q: query } });
  }
}
