import { BaseAPIClient } from './client.js';
import { AuthResource } from './resources/auth.js';
import { ContribuyenteResource } from './resources/contribuyente.js';
import { RcvResource } from './resources/rcv.js';
import { BheReceptorResource, BheEmisorResource } from './resources/bhe.js';
import { BteResource } from './resources/bte.js';
import { DteResource } from './resources/dte.js';
import { CesionesResource } from './resources/cesiones.js';
import { HonorariosResource } from './resources/honorarios.js';
import { F22Resource } from './resources/f22.js';
import { CarpetaTributariaResource } from './resources/carpeta.js';
import { DjResource } from './resources/dj.js';
import { DatosResource } from './resources/datos.js';
import {
  BaseAPIError, APIError, AuthenticationError, PermissionError,
  NotFoundError, ValidationError, RateLimitError, ConnectionError,
} from './errors.js';
import type { BaseAPIOptions, RateLimitInfo } from './types.js';

export class BaseAPI {
  public readonly auth: AuthResource;
  public readonly contribuyente: ContribuyenteResource;
  public readonly rcv: RcvResource;
  public readonly bhe: { receptor: BheReceptorResource; emisor: BheEmisorResource };
  public readonly bte: BteResource;
  public readonly dte: DteResource;
  public readonly cesiones: CesionesResource;
  public readonly honorarios: HonorariosResource;
  public readonly f22: F22Resource;
  public readonly carpetaTributaria: CarpetaTributariaResource;
  public readonly dj: DjResource;
  public readonly datos: DatosResource;

  private readonly _client: BaseAPIClient;

  constructor(apiKey: string, options?: BaseAPIOptions) {
    this._client = new BaseAPIClient(apiKey, options);
    this.auth = new AuthResource(this._client);
    this.contribuyente = new ContribuyenteResource(this._client);
    this.rcv = new RcvResource(this._client);
    this.bhe = {
      receptor: new BheReceptorResource(this._client),
      emisor: new BheEmisorResource(this._client),
    };
    this.bte = new BteResource(this._client);
    this.dte = new DteResource(this._client);
    this.cesiones = new CesionesResource(this._client);
    this.honorarios = new HonorariosResource(this._client);
    this.f22 = new F22Resource(this._client);
    this.carpetaTributaria = new CarpetaTributariaResource(this._client);
    this.dj = new DjResource(this._client);
    this.datos = new DatosResource(this._client);
  }

  get rateLimitInfo(): RateLimitInfo {
    return this._client.rateLimitInfo;
  }

  // Error classes as static properties for catch patterns
  static BaseAPIError = BaseAPIError;
  static APIError = APIError;
  static AuthenticationError = AuthenticationError;
  static PermissionError = PermissionError;
  static NotFoundError = NotFoundError;
  static ValidationError = ValidationError;
  static RateLimitError = RateLimitError;
  static ConnectionError = ConnectionError;
}

export default BaseAPI;

// Re-export everything
export * from './types.js';
export * from './errors.js';
export { BaseAPIClient } from './client.js';
