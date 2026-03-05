import { ArchitecturesService } from './architectures.service';
import { createMockHttpService } from '../../test-utils';

describe('ArchitecturesService', () => {
  let service: ArchitecturesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ArchitecturesService(http as any);
  });

  it('retrieve calls GET /arches/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('arch-1');
    expect(http.get).toHaveBeenCalledWith('/arches/arch-1');
  });

  it('list calls GET /arches without params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/arches', undefined);
  });

  it('list passes params', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list({ limit: 5 } as any);
    expect(http.get).toHaveBeenCalledWith('/arches', { limit: 5 });
  });
});
