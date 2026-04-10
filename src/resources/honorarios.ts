import type { BaseAPIClient } from '../client.js';
import type { SiiCredentials, HonorariosResponse } from '../types.js';

export class HonorariosResource {
  constructor(private client: BaseAPIClient) {}

  async consultar(year: number, month: number, credentials: SiiCredentials): Promise<HonorariosResponse> {
    return this.client.request('POST', `/sii/honorarios/${year}/${month}`, { body: credentials as any });
  }
}
