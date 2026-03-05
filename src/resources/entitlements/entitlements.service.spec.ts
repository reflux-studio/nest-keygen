import { EntitlementsService } from './entitlements.service';
import { createMockHttpService } from '../../test-utils';

describe('EntitlementsService', () => {
  let service: EntitlementsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new EntitlementsService(http as any);
  });

  it('create calls POST /entitlements with correct body', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ code: 'FEAT_X' } as any);
    expect(http.post).toHaveBeenCalledWith('/entitlements', {
      data: { type: 'entitlements', attributes: { code: 'FEAT_X' } },
    });
  });

  it('retrieve calls GET /entitlements/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('ent-1');
    expect(http.get).toHaveBeenCalledWith('/entitlements/ent-1');
  });

  it('update calls PATCH /entitlements/:id with correct body', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('ent-1', { name: 'New Name' } as any);
    expect(http.patch).toHaveBeenCalledWith('/entitlements/ent-1', {
      data: { type: 'entitlements', attributes: { name: 'New Name' } },
    });
  });

  it('delete calls DELETE /entitlements/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('ent-1');
    expect(http.delete).toHaveBeenCalledWith('/entitlements/ent-1');
  });

  it('list calls GET /entitlements without params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/entitlements', undefined);
  });

  it('list passes params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list({ limit: 10 } as any);
    expect(http.get).toHaveBeenCalledWith('/entitlements', { limit: 10 });
  });
});
