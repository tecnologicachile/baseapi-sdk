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
  [key: string]: string | number | undefined;
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

export interface RcvBoletasDiariasResponse {
  periodo: string;
  totalDias: number;
  dias: Array<{
    fecha: string;
    cantidad: number;
    montoNeto: number;
    montoIva: number;
    montoTotal: number;
  }>;
}

export interface RcvBoletasDetalleResponse {
  periodo: string;
  totalBoletas: number;
  boletas: RcvRegistro[];
}

// ---------------------------------------------------------------------------
// BHE (Boletas de Honorarios)
// ---------------------------------------------------------------------------

export interface BheDocumento {
  folio?: string;
  fechaEmision?: string;
  rutReceptor?: string;
  rutEmisor?: string;
  nombreReceptor?: string;
  nombreEmisor?: string;
  bruto?: number;
  retencion?: number;
  liquido?: number;
  estado?: string;
  [key: string]: unknown;
}

export interface BheListarResponse {
  total: number;
  documentos: BheDocumento[];
}

export interface BheEmitirParams extends SiiCredentials {
  /** 1 = retención por receptor (cliente paga retención), 2 = retención por emisor */
  tipo_retencion: 1 | 2;
  rut_destinatario: string;
  nombre_destinatario?: string;
  domicilio_destinatario: string;
  cod_region: string;
  cod_comuna: string;
  prestaciones: Array<{ descripcion: string; valor: number }>;
  fecha_emision?: string;
  [key: string]: unknown;
}

export interface BheEmitirResponse {
  folio: string;
  message: string;
  pdf?: BhePdfResponse;
  [key: string]: unknown;
}

export interface BhePdfResponse {
  pdf_base64?: string;
  base64?: string;
  pdf_size?: number;
  size?: number;
  filename: string;
  content_type?: string;
}

// ---------------------------------------------------------------------------
// BTE (Boletas de Terceros)
// ---------------------------------------------------------------------------

export interface BteDocumento {
  folio?: string;
  fecha?: string;
  rutBeneficiario?: string;
  nombreBeneficiario?: string;
  monto?: number;
  retencion?: number;
  liquido?: number;
  estado?: string;
  [key: string]: unknown;
}

export interface BteListarResponse {
  total: number;
  documentos: BteDocumento[];
}

export interface BteEmitirParams extends EmpresaCredentials {
  rut_beneficiario: string;
  nombre_beneficiario: string;
  servicio: string;
  monto: number;
  fecha_emision?: string;
  [key: string]: unknown;
}

export interface BteEmitirResponse {
  success: boolean;
  folio: string;
  mensaje?: string;
  pdf?: BhePdfResponse;
  [key: string]: unknown;
}

export interface BteAnularParams extends EmpresaCredentials {
  folio: string;
}

// ---------------------------------------------------------------------------
// DTE (Documentos Tributarios Electrónicos)
// ---------------------------------------------------------------------------

export interface DteReceptorInput {
  rut: string;
  razon_social?: string;
  giro?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  contacto?: string;
  /** 1=Del Giro (default), 2=Supermercados, 3=BBRR, 4=Activo Fijo, 5=IVA Uso Común, 6=IVA No Recuperable, 7=No Corresponde */
  tipo_compra?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface DteItemInput {
  nombre: string;
  cantidad: number;
  /** Precio unitario neto (sin IVA) */
  precio: number;
  unidad?: string;
  /** Porcentaje 0-100 */
  descuento?: number;
  descripcion?: string;
  codigo?: string;
  /** Impuesto adicional: 23/24/25/26/27/271/44 */
  impuesto_adicional?: number;
}

export interface DteReferenciaInput {
  tipo_documento: string | number;
  folio: string | number;
  /** YYYY-MM-DD */
  fecha: string;
  razon?: string;
}

export interface DtePagoInput {
  /** YYYY-MM-DD */
  fecha: string;
  monto: number;
  glosa?: string;
}

export interface DteTransporteInput {
  rut: string;
  patente?: string;
  rut_chofer?: string;
  nombre_chofer?: string;
}

export interface DteEmitirParams extends EmisionCredentials {
  /** 33=Factura, 34=Factura Exenta. Default según endpoint */
  tipo_dte?: 33 | 34;
  receptor: DteReceptorInput;
  items: DteItemInput[];
  forma_pago?: 'CONTADO' | 'CREDITO' | 'SIN_COSTO';
  /** 1=Del Giro, 2=Activo Fijo, 3=BBRR */
  tipo_venta?: 1 | 2 | 3;
  /** Porcentaje 0-100 */
  descuento_global?: number;
  /** YYYY-MM-DD. Default: hoy */
  fecha_emision?: string;
  /** Max 3 referencias */
  referencias?: DteReferenciaInput[];
  /** Max 3 cuotas. Solo aplica si forma_pago=CREDITO */
  pagos?: DtePagoInput[];
  transporte?: DteTransporteInput;
  /** Si true, incluye el PDF en base64 en la respuesta */
  descargar_pdf?: boolean;
  [key: string]: unknown;
}

export interface DteEmitirResponse {
  success: boolean;
  folio?: string;
  codigo_pdf?: string;
  mensaje?: string;
  message?: string;
  totales?: {
    subtotal?: number;
    descuento_monto?: number;
    neto: number;
    iva: number;
    total: number;
    items_detalle?: Array<{
      nombre: string;
      cantidad: number;
      precio: number;
      descuento_porcentaje?: number;
      subtotal: number;
    }>;
  };
  pdf?: {
    filename: string;
    content_type: string;
    base64?: string;
    size: number;
  };
  tiempo_ms?: number;
}

// Anulación / NC / ND base
export interface DteNotaBaseParams extends EmisionCredentials {
  folio_referencia: number;
  /** Tipo del DTE original. Default: 33 */
  tipo_dte_original?: 33 | 34 | 52 | 56 | 61;
  descargar_pdf?: boolean;
}

export type DteAnularParams = DteNotaBaseParams;

export interface DteNotaCreditoMontosParams extends DteNotaBaseParams {
  /** Items con montos corregidos. Si se omite, usa los originales */
  items?: DteItemInput[];
}

export interface DteNotaCreditoTextoParams extends DteNotaBaseParams {
  giro?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
}

export interface DteNotaDebitoParams extends DteNotaBaseParams {
  items?: DteItemInput[];
}

export interface DteValidarParams {
  receptor: DteReceptorInput;
  items: DteItemInput[];
  forma_pago?: 'CONTADO' | 'CREDITO' | 'SIN_COSTO';
  descuento_global?: number;
  referencias?: DteReferenciaInput[];
  pagos?: DtePagoInput[];
}

export interface DteValidarResponse {
  valido: boolean;
  errores?: string[];
  warnings?: string[];
  totales?: { neto: number; iva: number; total: number };
}

export interface DteValidezParams extends SiiCredentials {
  rut_emisor: string;
  tipo_dte: number;
  folio: number;
}

export interface DteValidezResponse {
  valido: boolean;
  estado?: string;
  detalle?: Record<string, unknown>;
}

export interface DteDocumento {
  folio?: number | string;
  fecha?: string;
  rutReceptor?: string;
  rutEmisor?: string;
  razonSocial?: string;
  tipoDte?: number;
  total?: number;
  estado?: string;
  [key: string]: unknown;
}

export interface DteConsultaResponse {
  total: number;
  documentos: DteDocumento[];
}

export type DteRecibidosResponse = DteConsultaResponse;

export interface DtePdfResponse {
  filename: string;
  content_type?: string;
  base64?: string;
  pdf_base64?: string;
  size?: number;
}

export interface DteXmlToPdfParams {
  xml: string;
}

export interface DteReceptorResponse {
  rut: string;
  razon_social?: string;
  giro?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  [key: string]: unknown;
}

export interface DteEmisorResponse {
  rut: string;
  razon_social?: string;
  giro?: string;
  actividad_economica?: string;
  direccion?: string;
  [key: string]: unknown;
}

export interface DteTipo {
  codigo: number;
  nombre: string;
  descripcion?: string;
}

// ---------------------------------------------------------------------------
// Cesiones
// ---------------------------------------------------------------------------

export type TipoConsultaCesiones = 'deudor' | 'cedente' | 'cesionario';

export interface CesionesParams extends SiiCredentials {
  tipo_consulta: TipoConsultaCesiones;
  /** YYYY-MM-DD */
  desde: string;
  /** YYYY-MM-DD */
  hasta: string;
}

export interface CesionRecord {
  folio?: string | number;
  fechaCesion?: string;
  rutCedente?: string;
  rutCesionario?: string;
  rutDeudor?: string;
  monto?: number;
  estado?: string;
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
  year?: number;
  month?: number;
  total?: number;
  documentos?: BheDocumento[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// F22 / Carpeta Tributaria / DJ
// ---------------------------------------------------------------------------

export interface F22Response {
  year: number;
  estado?: string;
  datos?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CarpetaTributariaResponse {
  pdf?: { filename: string; base64: string; size: number };
  url?: string;
  [key: string]: unknown;
}

export interface DjResponse {
  year: number;
  declaraciones: Array<{
    codigo: string;
    nombre: string;
    estado: string;
    [key: string]: unknown;
  }>;
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
  codigo_region?: string;
}

export interface TipoRetencion {
  codigo: number;
  nombre: string;
  descripcion?: string;
}

export interface TipoTraslado {
  codigo: number;
  nombre: string;
  descripcion?: string;
}
