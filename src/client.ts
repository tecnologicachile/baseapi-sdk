import { setTimeout } from 'timers/promises';
import {
  BaseAPIError,
  APIError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ConnectionError,
} from './errors.js';
import type { BaseAPIOptions, RateLimitInfo } from './types.js';

const DEFAULT_BASE_URL = 'https://api.baseapi.cl/api/v1';
const DEFAULT_TIMEOUT = 120_000;
const DEFAULT_MAX_RETRIES = 2;

export class BaseAPIClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private _rateLimitInfo: RateLimitInfo = {
    limit: null, remaining: null, reset: null,
    planLimit: null, planRemaining: null, planReset: null,
  };

  constructor(apiKey: string, options?: BaseAPIOptions) {
    if (!apiKey) throw new BaseAPIError('API key is required', undefined, null);
    this.apiKey = apiKey;
    this.baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  get rateLimitInfo(): RateLimitInfo {
    return { ...this._rateLimitInfo };
  }

  async request<T>(
    method: 'GET' | 'POST',
    path: string,
    options?: { body?: Record<string, unknown>; query?: Record<string, string | number | undefined> },
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    if (options?.query) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined) params.set(k, String(v));
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = globalThis.setTimeout(() => controller.abort(), this.timeout);

        const res = await fetch(url, {
          method,
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'baseapi-cl-sdk/0.1.0',
          },
          body: options?.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);
        this.parseRateLimitHeaders(res.headers);

        if (res.ok) {
          const json = await res.json() as { success: boolean; data: T };
          return json.data;
        }

        const body = await res.json().catch(() => ({ message: res.statusText, error: 'Unknown' }));
        const error = this.buildError(res.status, body, res.headers);

        if (error instanceof RateLimitError && attempt < this.maxRetries) {
          const wait = error.retryAfter ? error.retryAfter * 1000 : this.backoff(attempt);
          await setTimeout(wait);
          lastError = error;
          continue;
        }

        if (res.status >= 500 && attempt < this.maxRetries) {
          await setTimeout(this.backoff(attempt));
          lastError = error;
          continue;
        }

        throw error;
      } catch (e) {
        if (e instanceof BaseAPIError) throw e;
        if ((e as any)?.name === 'AbortError') {
          lastError = new ConnectionError(`Request timed out after ${this.timeout}ms`);
          if (attempt < this.maxRetries) { await setTimeout(this.backoff(attempt)); continue; }
          throw lastError;
        }
        lastError = new ConnectionError((e as Error).message, e as Error);
        if (attempt < this.maxRetries) { await setTimeout(this.backoff(attempt)); continue; }
        throw lastError;
      }
    }

    throw lastError ?? new ConnectionError('Request failed after retries');
  }

  private backoff(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 30_000);
  }

  private parseRateLimitHeaders(headers: Headers): void {
    const get = (name: string) => {
      const v = headers.get(name);
      return v ? Number(v) : null;
    };
    this._rateLimitInfo = {
      limit: get('x-ratelimit-limit'),
      remaining: get('x-ratelimit-remaining'),
      reset: headers.get('x-ratelimit-reset') ? new Date(Number(headers.get('x-ratelimit-reset')) * 1000) : null,
      planLimit: get('x-plan-limit'),
      planRemaining: get('x-plan-remaining'),
      planReset: headers.get('x-plan-reset') ? new Date(Number(headers.get('x-plan-reset')) * 1000) : null,
    };
  }

  private buildError(status: number, body: any, headers: Headers): APIError {
    switch (status) {
      case 400: return new ValidationError(body);
      case 401: return new AuthenticationError(body);
      case 403: return new PermissionError(body);
      case 404: return new NotFoundError(body);
      case 429: {
        const retryAfter = headers.get('retry-after');
        return new RateLimitError(body, retryAfter ? Number(retryAfter) : null);
      }
      default: return new APIError(status, body);
    }
  }
}
