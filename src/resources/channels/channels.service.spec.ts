import { ChannelsService } from './channels.service';
import { createMockHttpService } from '../../test-utils';

describe('ChannelsService', () => {
  let service: ChannelsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ChannelsService(http as any);
  });

  it('retrieve calls GET /channels/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('chan-1');
    expect(http.get).toHaveBeenCalledWith('/channels/chan-1');
  });

  it('list calls GET /channels without params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/channels', undefined);
  });

  it('list passes params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list({ limit: 5 } as any);
    expect(http.get).toHaveBeenCalledWith('/channels', { limit: 5 });
  });
});
