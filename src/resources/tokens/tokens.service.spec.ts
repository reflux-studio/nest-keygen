import { TokensService } from './tokens.service';
import { createMockHttpService } from '../../test-utils';

describe('TokensService', () => {
  let service: TokensService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new TokensService(http as any);
  });

  it('generate calls POST /tokens with Basic auth override', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.generate({ email: 'user@example.com', password: 'secret' });
    const expectedAuth = `Basic ${Buffer.from('user@example.com:secret').toString('base64')}`;
    expect(http.post).toHaveBeenCalledWith('/tokens', undefined, undefined, expectedAuth);
  });

  it('list calls GET /tokens', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/tokens', undefined);
  });

  it('list passes params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list({ limit: 5 } as any);
    expect(http.get).toHaveBeenCalledWith('/tokens', { limit: 5 });
  });

  it('retrieve calls GET /tokens/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('tok-1');
    expect(http.get).toHaveBeenCalledWith('/tokens/tok-1');
  });

  it('regenerate calls PUT /tokens/:id', async () => {
    http.put.mockResolvedValue({ data: {} });
    await service.regenerate('tok-1');
    expect(http.put).toHaveBeenCalledWith('/tokens/tok-1');
  });

  it('revoke calls DELETE /tokens/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.revoke('tok-1');
    expect(http.delete).toHaveBeenCalledWith('/tokens/tok-1');
  });
});
