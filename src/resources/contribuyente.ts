import type { BaseAPIClient } from '../client.js';
import type {
  SiiCredentials,
  ContribuyenteInfo,
  SituacionTributaria,
  DatosReceptor,
} from '../types.js';

export class ContribuyenteResource {
  constructor(private client: BaseAPIClient) {}

  /** Información completa del contribuyente autenticado */
  async informacion(credentials: SiiCredentials): Promise<ContribuyenteInfo> {
    return this.client.request('POST', '/sii/contribuyente/informacion', { body: credentials as any });
  }

  /** Situación tributaria pública por RUT (sin credenciales) */
  async situacionTributaria(params: { rut: string }): Promise<SituacionTributaria> {
    return this.client.request('POST', '/sii/contribuyente/situacion-tributaria', { body: params as any });
  }

  /** Datos del receptor para autocompletar facturación */
  async datosReceptor(params: SiiCredentials & { rut_receptor: string }): Promise<DatosReceptor> {
    return this.client.request('POST', '/sii/contribuyente/datos-receptor', { body: params as any });
  }
}
