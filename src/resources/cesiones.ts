import type { BaseAPIClient } from '../client.js';
import type { CesionesParams, CesionesResponse } from '../types.js';

export class CesionesResource {
  constructor(private client: BaseAPIClient) {}

  async consultar(params: CesionesParams): Promise<CesionesResponse> {
    return this.client.request('POST', '/sii/cesiones/consulta', { body: params as any });
  }
}
