import { ProductsService } from './products.service';
import { createMockHttpService } from '../../test-utils';

describe('ProductsService', () => {
  let service: ProductsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ProductsService(http as any);
  });

  it('create calls POST /products with correct body', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ name: 'My App' } as any);
    expect(http.post).toHaveBeenCalledWith('/products', {
      data: { type: 'products', attributes: { name: 'My App' } },
    });
  });

  it('retrieve calls GET /products/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('prod-1');
    expect(http.get).toHaveBeenCalledWith('/products/prod-1');
  });

  it('update calls PATCH /products/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('prod-1', { name: 'Updated App' } as any);
    expect(http.patch).toHaveBeenCalledWith('/products/prod-1', {
      data: { type: 'products', attributes: { name: 'Updated App' } },
    });
  });

  it('delete calls DELETE /products/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('prod-1');
    expect(http.delete).toHaveBeenCalledWith('/products/prod-1');
  });

  it('list calls GET /products', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/products', undefined);
  });

  it('generateToken calls POST /products/:id/tokens', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.generateToken('prod-1');
    expect(http.post).toHaveBeenCalledWith('/products/prod-1/tokens');
  });
});
