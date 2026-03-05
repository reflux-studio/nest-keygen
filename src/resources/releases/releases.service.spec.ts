import { ReleasesService } from './releases.service';
import { createMockHttpService } from '../../test-utils';

describe('ReleasesService', () => {
  let service: ReleasesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ReleasesService(http as any);
  });

  it('create builds correct body with product relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ productId: 'prod-1', version: '1.0.0' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.type).toBe('releases');
    expect(body.data.relationships.product).toEqual({
      data: { type: 'products', id: 'prod-1' },
    });
    expect(body.data.attributes.version).toBe('1.0.0');
  });

  it('create includes package relationship when packageId provided', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ productId: 'prod-1', packageId: 'pkg-1', version: '1.0.0' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.relationships['package']).toEqual({
      data: { type: 'packages', id: 'pkg-1' },
    });
  });

  it('retrieve calls GET /releases/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('rel-1');
    expect(http.get).toHaveBeenCalledWith('/releases/rel-1');
  });

  it('update calls PATCH /releases/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('rel-1', { tag: 'v1.0.1' } as any);
    expect(http.patch).toHaveBeenCalledWith('/releases/rel-1', {
      data: { type: 'releases', attributes: { tag: 'v1.0.1' } },
    });
  });

  it('delete calls DELETE /releases/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('rel-1');
    expect(http.delete).toHaveBeenCalledWith('/releases/rel-1');
  });

  it('list calls GET /releases', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/releases', undefined);
  });

  it('upgrade calls GET /releases/:id/upgrade', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.upgrade('rel-1');
    expect(http.get).toHaveBeenCalledWith('/releases/rel-1/upgrade');
  });

  it('publish calls POST /releases/:id/actions/publish', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.publish('rel-1');
    expect(http.post).toHaveBeenCalledWith('/releases/rel-1/actions/publish');
  });

  it('yank calls POST /releases/:id/actions/yank', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.yank('rel-1');
    expect(http.post).toHaveBeenCalledWith('/releases/rel-1/actions/yank');
  });

  it('attachConstraints calls POST with entitlement constraint bodies', async () => {
    http.post.mockResolvedValue(undefined);
    await service.attachConstraints('rel-1', { entitlementIds: ['ent-1', 'ent-2'] });
    expect(http.post).toHaveBeenCalledWith('/releases/rel-1/constraints', {
      data: [
        {
          type: 'constraints',
          relationships: { entitlement: { data: { type: 'entitlements', id: 'ent-1' } } },
        },
        {
          type: 'constraints',
          relationships: { entitlement: { data: { type: 'entitlements', id: 'ent-2' } } },
        },
      ],
    });
  });

  it('detachConstraints calls DELETE /releases/:id/constraints', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.detachConstraints('rel-1', { constraintIds: ['con-1'] });
    expect(http.delete).toHaveBeenCalledWith('/releases/rel-1/constraints', {
      data: [{ type: 'constraints', id: 'con-1' }],
    });
  });

  it('listConstraints calls GET /releases/:id/constraints', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.listConstraints('rel-1');
    expect(http.get).toHaveBeenCalledWith('/releases/rel-1/constraints', undefined);
  });

  it('listArtifacts calls GET /releases/:id/artifacts', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.listArtifacts('rel-1');
    expect(http.get).toHaveBeenCalledWith('/releases/rel-1/artifacts', undefined);
  });

  it('changePackage with packageId calls PUT with package data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changePackage('rel-1', 'pkg-1');
    expect(http.put).toHaveBeenCalledWith('/releases/rel-1/package', {
      data: { type: 'packages', id: 'pkg-1' },
    });
  });

  it('changePackage with null calls PUT with null data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changePackage('rel-1', null);
    expect(http.put).toHaveBeenCalledWith('/releases/rel-1/package', { data: null });
  });
});
