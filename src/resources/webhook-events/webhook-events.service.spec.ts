import { WebhookEventsService } from './webhook-events.service';
import { createMockHttpService } from '../../test-utils';

describe('WebhookEventsService', () => {
  let service: WebhookEventsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new WebhookEventsService(http as any);
  });

  it('retrieve calls GET /webhook-events/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('evt-1');
    expect(http.get).toHaveBeenCalledWith('/webhook-events/evt-1');
  });

  it('delete calls DELETE /webhook-events/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('evt-1');
    expect(http.delete).toHaveBeenCalledWith('/webhook-events/evt-1');
  });

  it('list calls GET /webhook-events', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/webhook-events', undefined);
  });

  it('retry calls POST /webhook-events/:id/actions/retry', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.retry('evt-1');
    expect(http.post).toHaveBeenCalledWith('/webhook-events/evt-1/actions/retry');
  });
});
