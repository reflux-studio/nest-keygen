import { HttpException } from '@nestjs/common';
import { KeygenHttpService } from './keygen-http.service';

function makeResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: (key: string) => headers[key.toLowerCase()] ?? null,
    },
  } as unknown as Response;
}

describe('KeygenHttpService', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor / headers', () => {
    it('sets Bearer auth when token provided', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, { data: {} }));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
      await svc.get('/test');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer tok');
    });

    it('sets License auth when licenseKey provided', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, { data: {} }));
      const svc = new KeygenHttpService({ account: 'acc', licenseKey: 'lk' } as any);
      await svc.get('/test');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect((init.headers as Record<string, string>)['Authorization']).toBe('License lk');
    });

    it('sets Keygen-Version header when apiVersion provided', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok', apiVersion: '1.5' } as any);
      await svc.get('/test');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect((init.headers as Record<string, string>)['Keygen-Version']).toBe('1.5');
    });

    it('sets Keygen-Environment header when environment provided', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok', environment: 'sandbox' } as any);
      await svc.get('/test');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect((init.headers as Record<string, string>)['Keygen-Environment']).toBe('sandbox');
    });

    it('uses custom baseUrl when provided', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok', baseUrl: 'https://custom.api' } as any);
      await svc.get('/test');
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('https://custom.api');
    });

    it('defaults to https://api.keygen.sh when baseUrl not provided', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
      await svc.get('/test');
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('https://api.keygen.sh');
    });
  });

  describe('buildUrl / query params', () => {
    it('builds correct url with account', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'my-account', token: 'tok' } as any);
      await svc.get('/licenses');
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/v1/accounts/my-account/licenses');
    });

    it('appends flat query params', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
      await svc.get('/licenses', { limit: 10, page: 2 });
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('limit=10');
      expect(url).toContain('page=2');
    });

    it('appends nested query params with bracket notation', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
      await svc.get('/licenses', { filter: { status: 'active' } });
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('filter%5Bstatus%5D=active');
    });

    it('skips null/undefined params', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      const svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
      await svc.get('/licenses', { limit: null, page: undefined });
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).not.toContain('limit');
      expect(url).not.toContain('page');
    });
  });

  describe('HTTP methods', () => {
    let svc: KeygenHttpService;

    beforeEach(() => {
      svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
    });

    it('get calls fetch with GET method', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, { data: 'ok' }));
      const result = await svc.get('/path');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.method).toBe('GET');
      expect(result).toEqual({ data: 'ok' });
    });

    it('post calls fetch with POST and body', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, { data: 'created' }));
      const result = await svc.post('/path', { foo: 'bar' });
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.method).toBe('POST');
      expect(init.body).toBe(JSON.stringify({ foo: 'bar' }));
      expect(result).toEqual({ data: 'created' });
    });

    it('post with authOverride replaces Authorization header', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      await svc.post('/path', undefined, undefined, 'Basic xyz');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect((init.headers as Record<string, string>)['Authorization']).toBe('Basic xyz');
    });

    it('patch calls fetch with PATCH and body', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, { data: 'updated' }));
      const result = await svc.patch('/path', { a: 1 });
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.method).toBe('PATCH');
      expect(init.body).toBe(JSON.stringify({ a: 1 }));
      expect(result).toEqual({ data: 'updated' });
    });

    it('put calls fetch with PUT and body', async () => {
      fetchMock.mockResolvedValue(makeResponse(200, {}));
      await svc.put('/path', { b: 2 });
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.method).toBe('PUT');
      expect(init.body).toBe(JSON.stringify({ b: 2 }));
    });

    it('delete calls fetch with DELETE method', async () => {
      fetchMock.mockResolvedValue(makeResponse(204, undefined));
      const result = await svc.delete('/path');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.method).toBe('DELETE');
      expect(result).toBeUndefined();
    });

    it('delete with body sends body', async () => {
      fetchMock.mockResolvedValue(makeResponse(204, undefined));
      await svc.delete('/path', { data: [] });
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.body).toBe(JSON.stringify({ data: [] }));
    });
  });

  describe('response handling', () => {
    let svc: KeygenHttpService;

    beforeEach(() => {
      svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
    });

    it('returns undefined for 204 response', async () => {
      fetchMock.mockResolvedValue(makeResponse(204, undefined));
      const result = await svc.get('/path');
      expect(result).toBeUndefined();
    });

    it('returns undefined for 3xx response', async () => {
      fetchMock.mockResolvedValue(makeResponse(301, undefined));
      const result = await svc.get('/path');
      expect(result).toBeUndefined();
    });

    it('throws HttpException on error response', async () => {
      const errorBody = { errors: [{ detail: 'not found' }] };
      fetchMock.mockResolvedValue(makeResponse(404, errorBody));
      await expect(svc.get('/path')).rejects.toBeInstanceOf(HttpException);
    });

    it('HttpException has correct status code', async () => {
      fetchMock.mockResolvedValue(makeResponse(422, { errors: [] }));
      try {
        await svc.get('/path');
      } catch (e) {
        expect((e as HttpException).getStatus()).toBe(422);
      }
    });
  });

  describe('getRedirectUrl', () => {
    let svc: KeygenHttpService;

    beforeEach(() => {
      svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
    });

    it('returns location header on 3xx', async () => {
      const res = {
        status: 302,
        ok: false,
        headers: { get: (k: string) => (k === 'location' ? 'https://s3.example.com/file' : null) },
        json: jest.fn(),
      } as unknown as Response;
      fetchMock.mockResolvedValue(res);
      const url = await svc.getRedirectUrl('/artifacts/123');
      expect(url).toBe('https://s3.example.com/file');
    });

    it('returns empty string when location header is missing', async () => {
      const res = {
        status: 302,
        ok: false,
        headers: { get: () => null },
        json: jest.fn(),
      } as unknown as Response;
      fetchMock.mockResolvedValue(res);
      const url = await svc.getRedirectUrl('/artifacts/123');
      expect(url).toBe('');
    });

    it('throws HttpException on non-redirect response', async () => {
      const res = {
        status: 404,
        ok: false,
        headers: { get: () => null },
        json: jest.fn().mockResolvedValue({ errors: [] }),
      } as unknown as Response;
      fetchMock.mockResolvedValue(res);
      await expect(svc.getRedirectUrl('/artifacts/bad')).rejects.toBeInstanceOf(HttpException);
    });

    it('uses redirect: manual option', async () => {
      const res = {
        status: 302,
        ok: false,
        headers: { get: () => 'https://example.com' },
        json: jest.fn(),
      } as unknown as Response;
      fetchMock.mockResolvedValue(res);
      await svc.getRedirectUrl('/path');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.redirect).toBe('manual');
    });
  });

  describe('ping', () => {
    let svc: KeygenHttpService;

    beforeEach(() => {
      svc = new KeygenHttpService({ account: 'acc', token: 'tok' } as any);
    });

    it('calls /v1/ping endpoint', async () => {
      fetchMock.mockResolvedValue({ ok: true, status: 200 } as Response);
      await svc.ping();
      const [url] = fetchMock.mock.calls[0] as [string];
      expect(url).toContain('/v1/ping');
    });

    it('throws HttpException when ping fails', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 503 } as Response);
      await expect(svc.ping()).rejects.toBeInstanceOf(HttpException);
    });
  });
});
