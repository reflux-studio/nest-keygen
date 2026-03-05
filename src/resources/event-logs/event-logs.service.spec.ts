import { EventLogsService } from './event-logs.service';
import { createMockHttpService } from '../../test-utils';

describe('EventLogsService', () => {
  let service: EventLogsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new EventLogsService(http as any);
  });

  it('retrieve calls GET /event-logs/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('evt-1');
    expect(http.get).toHaveBeenCalledWith('/event-logs/evt-1');
  });

  it('list calls GET /event-logs without params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/event-logs', undefined);
  });

  it('list passes params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list({ limit: 10 } as any);
    expect(http.get).toHaveBeenCalledWith('/event-logs', { limit: 10 });
  });
});
