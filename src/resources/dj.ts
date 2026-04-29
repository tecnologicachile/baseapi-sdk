import type { BaseAPIClient } from '../client.js';
import type { SiiCredentials, DjResponse } from '../types.js';

export class DjResource {
  constructor(private client: BaseAPIClient) {}

  /** Declaraciones juradas del año tributario */
  async consultar(year: number, credentials: SiiCredentials): Promise<DjResponse> {
    return this.client.request('POST', `/sii/dj/consulta/${year}`, { body: credentials as any });
  }
}
