import { PoliciesService } from './policies.service';
import { createMockHttpService } from '../../test-utils';

describe('PoliciesService', () => {
  let service: PoliciesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new PoliciesService(http as any);
  });

  it('create builds correct body with product relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ productId: 'prod-1', name: 'Basic' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.type).toBe('policies');
    expect(body.data.relationships.product).toEqual({
      data: { type: 'products', id: 'prod-1' },
    });
    expect(body.data.attributes.name).toBe('Basic');
  });

  it('retrieve calls GET /policies/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('pol-1');
    expect(http.get).toHaveBeenCalledWith('/policies/pol-1');
  });

  it('update calls PATCH /policies/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('pol-1', { name: 'Pro' } as any);
    expect(http.patch).toHaveBeenCalledWith('/policies/pol-1', {
      data: { type: 'policies', attributes: { name: 'Pro' } },
    });
  });

  it('delete calls DELETE /policies/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('pol-1');
    expect(http.delete).toHaveBeenCalledWith('/policies/pol-1');
  });

  it('list calls GET /policies', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/policies', undefined);
  });

  it('popPool calls DELETE /policies/:id/pool', async () => {
    http.delete.mockResolvedValue({ data: {} });
    await service.popPool('pol-1');
    expect(http.delete).toHaveBeenCalledWith('/policies/pol-1/pool');
  });

  it('attachEntitlements calls POST /policies/:id/entitlements', async () => {
    http.post.mockResolvedValue(undefined);
    await service.attachEntitlements('pol-1', ['ent-1', 'ent-2']);
    expect(http.post).toHaveBeenCalledWith('/policies/pol-1/entitlements', {
      data: [
        { type: 'entitlements', id: 'ent-1' },
        { type: 'entitlements', id: 'ent-2' },
      ],
    });
  });

  it('detachEntitlements calls DELETE /policies/:id/entitlements', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.detachEntitlements('pol-1', ['ent-1']);
    expect(http.delete).toHaveBeenCalledWith('/policies/pol-1/entitlements', {
      data: [{ type: 'entitlements', id: 'ent-1' }],
    });
  });

  it('listEntitlements calls GET /policies/:id/entitlements', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.listEntitlements('pol-1');
    expect(http.get).toHaveBeenCalledWith('/policies/pol-1/entitlements', undefined);
  });
});
