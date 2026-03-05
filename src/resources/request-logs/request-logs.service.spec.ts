import { RequestLogsService } from './request-logs.service';
import { createMockHttpService } from '../../test-utils';

describe('RequestLogsService', () => {
  let service: RequestLogsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new RequestLogsService(http as any);
  });

  it('retrieve calls GET /request-logs/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('req-1');
    expect(http.get).toHaveBeenCalledWith('/request-logs/req-1');
  });

  it('list calls GET /request-logs without params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/request-logs', undefined);
  });

  it('list passes params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list({ limit: 10 } as any);
    expect(http.get).toHaveBeenCalledWith('/request-logs', { limit: 10 });
  });
});
