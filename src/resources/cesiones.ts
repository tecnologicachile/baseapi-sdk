import type { BaseAPIClient } from '../client.js';
import type { CesionesParams, CesionesResponse } from '../types.js';

export class CesionesResource {
  constructor(private client: BaseAPIClient) {}

  /** Consulta cesiones electrónicas (factoring) por rol */
  async consultar(params: CesionesParams): Promise<CesionesResponse> {
    return this.client.request('POST', '/sii/cesiones', { body: params as any });
  }
}
