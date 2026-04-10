import type { BaseAPIClient } from '../client.js';
import type { SiiCredentials, ValidarResponse } from '../types.js';

export class AuthResource {
  constructor(private client: BaseAPIClient) {}

  async validar(credentials: SiiCredentials): Promise<ValidarResponse> {
    return this.client.request('POST', '/sii/auth/validar', { body: credentials as any });
  }
}
