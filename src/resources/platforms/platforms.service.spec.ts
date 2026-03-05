import { PlatformsService } from './platforms.service';
import { createMockHttpService } from '../../test-utils';

describe('PlatformsService', () => {
  let service: PlatformsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new PlatformsService(http as any);
  });

  it('retrieve calls GET /platforms/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('plat-1');
    expect(http.get).toHaveBeenCalledWith('/platforms/plat-1');
  });

  it('list calls GET /platforms without params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/platforms', undefined);
  });

  it('list passes params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list({ limit: 5 } as any);
    expect(http.get).toHaveBeenCalledWith('/platforms', { limit: 5 });
  });
});
