import { PackagesService } from './packages.service';
import { createMockHttpService } from '../../test-utils';

describe('PackagesService', () => {
  let service: PackagesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new PackagesService(http as any);
  });

  it('create calls POST /packages with product relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ productId: 'prod-1', key: 'my-pkg' } as any);
    expect(http.post).toHaveBeenCalledWith('/packages', {
      data: {
        type: 'packages',
        attributes: { key: 'my-pkg' },
        relationships: {
          product: { data: { type: 'products', id: 'prod-1' } },
        },
      },
    });
  });

  it('retrieve calls GET /packages/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('pkg-1');
    expect(http.get).toHaveBeenCalledWith('/packages/pkg-1');
  });

  it('update calls PATCH /packages/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('pkg-1', { key: 'new-key' } as any);
    expect(http.patch).toHaveBeenCalledWith('/packages/pkg-1', {
      data: { type: 'packages', attributes: { key: 'new-key' } },
    });
  });

  it('delete calls DELETE /packages/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('pkg-1');
    expect(http.delete).toHaveBeenCalledWith('/packages/pkg-1');
  });

  it('list calls GET /packages', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/packages', undefined);
  });
});
