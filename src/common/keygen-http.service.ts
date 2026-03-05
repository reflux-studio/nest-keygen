import { HttpException, Inject, Injectable } from '@nestjs/common';
import { KEYGEN_OPTIONS } from '../keygen.constants';
import type { KeygenOptions } from '../interfaces/keygen-options.interface';

@Injectable()
export class KeygenHttpService {
  private readonly baseUrl: string;
  private readonly account: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(@Inject(KEYGEN_OPTIONS) private readonly options: KeygenOptions) {
    this.baseUrl = options.baseUrl ?? 'https://api.keygen.sh';
    this.account = options.account;
    this.defaultHeaders = this.buildDefaultHeaders();
  }

  private buildDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    };

    if (this.options.token) {
      headers['Authorization'] = `Bearer ${this.options.token}`;
    } else if (this.options.licenseKey) {
      headers['Authorization'] = `License ${this.options.licenseKey}`;
    }

    if (this.options.apiVersion) {
      headers['Keygen-Version'] = this.options.apiVersion;
    }

    if (this.options.environment) {
      headers['Keygen-Environment'] = this.options.environment;
    }

    return headers;
  }

  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}/v1/accounts/${this.account}${path}`);
    if (params) {
      this.appendParams(url.searchParams, params);
    }
    return url.toString();
  }

  private appendParams(
    searchParams: URLSearchParams,
    params: Record<string, any>,
    prefix?: string,
  ): void {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (typeof value === 'object' && !Array.isArray(value)) {
        this.appendParams(searchParams, value as Record<string, any>, fullKey);
      } else {
        searchParams.set(fullKey, String(value as string | number | boolean));
      }
    }
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', path, undefined, params);
  }

  async post<T>(
    path: string,
    body?: unknown,
    params?: Record<string, any>,
    authOverride?: string,
  ): Promise<T> {
    return this.request<T>('POST', path, body, params, authOverride);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  async delete<T = void>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('DELETE', path, body);
  }

  async getRedirectUrl(
    path: string,
    params?: Record<string, any>,
  ): Promise<string> {
    const url = this.buildUrl(path, params);
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: this.defaultHeaders,
        redirect: 'manual',
      });
    } catch {
      throw new HttpException(
        { errors: [{ detail: 'Network request failed' }] },
        503,
      );
    }

    if (response.status >= 300 && response.status < 400) {
      return response.headers.get('location') ?? '';
    }

    const data: unknown = await response.json().catch(() => ({}));
    throw new HttpException(data as object, response.status);
  }

  async ping(): Promise<void> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/v1/ping`);
    } catch {
      throw new HttpException('Keygen API unreachable', 503);
    }
    if (!response.ok) {
      throw new HttpException('Keygen API unreachable', response.status);
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, any>,
    authOverride?: string,
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const headers: Record<string, string> = { ...this.defaultHeaders };

    if (authOverride) {
      headers['Authorization'] = authOverride;
    }

    const init: RequestInit = { method, headers };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch {
      throw new HttpException(
        { errors: [{ detail: 'Network request failed' }] },
        503,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    if (response.status >= 300 && response.status < 400) {
      return undefined as T;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new HttpException(data as object, response.status);
    }

    return data as T;
  }
}
