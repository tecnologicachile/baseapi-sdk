export class BaseAPIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number | undefined,
    public readonly rawResponse: unknown,
  ) {
    super(message);
    this.name = 'BaseAPIError';
  }
}

export class APIError extends BaseAPIError {
  public readonly error: string;
  constructor(statusCode: number, body: { message: string; error?: string; statusCode?: number }) {
    super(body.message, statusCode, body);
    this.name = 'APIError';
    this.error = body.error ?? 'Unknown';
  }
}

export class AuthenticationError extends APIError {
  constructor(body: any) { super(401, body); this.name = 'AuthenticationError'; }
}

export class PermissionError extends APIError {
  constructor(body: any) { super(403, body); this.name = 'PermissionError'; }
}

export class NotFoundError extends APIError {
  constructor(body: any) { super(404, body); this.name = 'NotFoundError'; }
}

export class ValidationError extends APIError {
  constructor(body: any) { super(400, body); this.name = 'ValidationError'; }
}

export class RateLimitError extends APIError {
  public readonly retryAfter: number | null;
  constructor(body: any, retryAfter: number | null) {
    super(429, body);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ConnectionError extends BaseAPIError {
  constructor(message: string, cause?: Error) {
    super(message, undefined, null);
    this.name = 'ConnectionError';
    if (cause) this.cause = cause;
  }
}
