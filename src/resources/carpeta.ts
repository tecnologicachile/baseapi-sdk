import type { BaseAPIClient } from '../client.js';
import type { SiiCredentials, CarpetaTributariaResponse } from '../types.js';

export class CarpetaTributariaResource {
  constructor(private client: BaseAPIClient) {}

  /** Carpeta tributaria electrónica del contribuyente */
  async consultar(credentials: SiiCredentials): Promise<CarpetaTributariaResponse> {
    return this.client.request('POST', '/sii/carpeta-tributaria', { body: credentials as any });
  }
}
