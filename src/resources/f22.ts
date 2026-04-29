import type { BaseAPIClient } from '../client.js';
import type { SiiCredentials, F22Response } from '../types.js';

export class F22Resource {
  constructor(private client: BaseAPIClient) {}

  /** Declaración anual de renta (Formulario 22) del año tributario */
  async consultar(year: number, credentials: SiiCredentials): Promise<F22Response> {
    return this.client.request('POST', `/sii/f22/${year}`, { body: credentials as any });
  }
}
