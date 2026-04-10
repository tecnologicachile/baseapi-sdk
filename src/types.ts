// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

export interface SiiCredentials {
  rut: string;
  password: string;
}

export interface EmpresaCredentials extends SiiCredentials {
  rut_empresa: string;
}

export interface EmisionCredentials extends EmpresaCredentials {
  clave_certificado: string;
}

// ---------------------------------------------------------------------------
// Client options
// ---------------------------------------------------------------------------

export interface BaseAPIOptions {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

// ---------------------------------------------------------------------------
// Rate limit info
// ---------------------------------------------------------------------------

export interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  reset: Date | null;
  planLimit: number | null;
  planRemaining: number | null;
  planReset: Date | null;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface ValidarResponse {
  valid: boolean;
  rut: string;
}

// ---------------------------------------------------------------------------
// Contribuyente
// ---------------------------------------------------------------------------

export interface ContribuyenteInfo {
  contribuyente: {
    rut: string;
    dv: string;
    razonSocial: string;
    tipoContribuyenteDescripcion: string;
    eMail: string;
    fechaInicioActividades: string;
    [key: string]: unknown;
  };
  actEcos: Array<{ codigo: string; descripcion: string; afectoIva: string; fechaInicio: string }>;
  direcciones: Array<{ comunaDescripcion: string; regionDescripcion: string; calle: string }>;
  representantes: Array<{ rut: string; dv: string; nombres: string; apellidoPaterno: string }>;
  [key: string]: unknown;
}

export interface SituacionTributaria {
  rut: string;
  nombre: string;
  inicioActividades: boolean;
  fechaInicioActividades: string | null;
  empresaMenorTamano: boolean;
  actividadesEconomicas: Array<{ codigo: string; descripcion: string; afectaIva: boolean }>;
  documentosAutorizados: Array<{ codigo: string; descripcion: string }>;
  [key: string]: unknown;
}

export interface DatosReceptor {
  rut: string;
  razonSocial: string;
  giro: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// RCV
// ---------------------------------------------------------------------------

export type TipoRcv = 'compra' | 'venta';

export interface RcvRegistro {
  [key: string]: string | undefined;
}

export interface RcvResumenTipo {
  tipoDocumento: string;
  codigoTipoDoc: number;
  totalDocumentos: number;
  montoExento: number;
  montoNeto: number;
  montoIva: number;
  montoTotal: number;
}

export interface RcvResponse {
  rut?: string;
  periodo?: string;
  totalRegistros: number;
  datos: RcvRegistro[];
  resumenPorTipo?: RcvResumenTipo[];
}

// ---------------------------------------------------------------------------
// BHE
// ---------------------------------------------------------------------------

export interface BheDocumento {
  [key: string]: unknown;
}

export interface BheListarResponse {
  total: number;
  documentos: BheDocumento[];
}

export interface BheEmitirParams extends SiiCredentials {
  tipo_retencion: 1 | 2;
  rut_destinatario: string;
  nombre_destinatario?: string;
  domicilio_destinatario: string;
  cod_region: string;
  cod_comuna: string;
  prestaciones: Array<{ descripcion: string; valor: number }>;
  [key: string]: unknown;
}

export interface BheEmitirResponse {
  folio: string;
  message: string;
  [key: string]: unknown;
}

export interface BhePdfResponse {
  pdf_base64: string;
  pdf_size: number;
  filename: string;
}

// ---------------------------------------------------------------------------
// DTE
// ---------------------------------------------------------------------------

export interface DteReceptorInput {
  rut: string;
  razon_social?: string;
  giro?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
}

export interface DteItemInput {
  nombre: string;
  cantidad: number;
  precio: number;
  unidad?: string;
  descuento?: number;
}

export interface DteEmitirParams extends EmisionCredentials {
  tipo_dte?: 33 | 34 | 52 | 56 | 61;
  receptor: DteReceptorInput;
  items: DteItemInput[];
  forma_pago?: 'CONTADO' | 'CREDITO' | 'SIN_COSTO';
  descuento_global?: number;
  referencias?: Array<{ tipo_documento: string; folio: string; fecha: string; razon?: string }>;
  pagos?: Array<{ fecha: string; monto: number; glosa?: string }>;
  descargar_pdf?: boolean;
  [key: string]: unknown;
}

export interface DteEmitirResponse {
  success: boolean;
  folio?: string;
  codigo_pdf?: string;
  mensaje?: string;
  totales?: { neto: number; iva: number; total: number };
  pdf?: { filename: string; content_type: string; base64: string; size: number };
  tiempo_ms: number;
}

export interface DteDocumento {
  [key: string]: unknown;
}

export interface DteConsultaResponse {
  total: number;
  documentos: DteDocumento[];
}

// ---------------------------------------------------------------------------
// Cesiones
// ---------------------------------------------------------------------------

export type TipoConsultaCesiones = 'deudor' | 'cedente' | 'cesionario';

export interface CesionesParams extends SiiCredentials {
  tipo_consulta: TipoConsultaCesiones;
  desde: string;
  hasta: string;
}

export interface CesionRecord {
  [key: string]: unknown;
}

export interface CesionesResponse {
  total: number;
  cesiones: CesionRecord[];
}

// ---------------------------------------------------------------------------
// Honorarios
// ---------------------------------------------------------------------------

export interface HonorariosResponse {
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Datos auxiliares
// ---------------------------------------------------------------------------

export interface Region {
  codigo: string;
  nombre: string;
}

export interface Comuna {
  codigo: string;
  nombre: string;
}
