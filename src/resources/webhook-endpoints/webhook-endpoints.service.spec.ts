import { WebhookEndpointsService } from './webhook-endpoints.service';
import { createMockHttpService } from '../../test-utils';

describe('WebhookEndpointsService', () => {
  let service: WebhookEndpointsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new WebhookEndpointsService(http as any);
  });

  it('create without productId omits relationships', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ url: 'https://example.com/hook' } as any);
    expect(http.post).toHaveBeenCalledWith('/webhook-endpoints', {
      data: {
        type: 'webhook-endpoints',
        attributes: { url: 'https://example.com/hook' },
      },
    });
  });

  it('create with productId includes product relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ url: 'https://example.com/hook', productId: 'prod-1' } as any);
    const call = http.post.mock.calls[0] as any[];
    expect(call[1].data.relationships).toEqual({
      product: { data: { type: 'products', id: 'prod-1' } },
    });
  });

  it('retrieve calls GET /webhook-endpoints/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('ep-1');
    expect(http.get).toHaveBeenCalledWith('/webhook-endpoints/ep-1');
  });

  it('update calls PATCH /webhook-endpoints/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('ep-1', { url: 'https://new.url' } as any);
    expect(http.patch).toHaveBeenCalledWith('/webhook-endpoints/ep-1', {
      data: { type: 'webhook-endpoints', attributes: { url: 'https://new.url' } },
    });
  });

  it('delete calls DELETE /webhook-endpoints/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('ep-1');
    expect(http.delete).toHaveBeenCalledWith('/webhook-endpoints/ep-1');
  });

  it('list calls GET /webhook-endpoints', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/webhook-endpoints', undefined);
  });
});
