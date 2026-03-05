import { KeygenService } from './keygen.service';
import { createMockHttpService } from './test-utils';

describe('KeygenService', () => {
  let service: KeygenService;
  let mockHttp: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    mockHttp = createMockHttpService();
    service = new KeygenService(
      {} as any, {} as any, {} as any, {} as any, {} as any,
      {} as any, {} as any, {} as any, {} as any, {} as any,
      {} as any, {} as any, {} as any, {} as any, {} as any,
      {} as any, {} as any, {} as any, {} as any, {} as any,
      {} as any, {} as any, {} as any,
      mockHttp as any,
    );
  });

  it('ping delegates to KeygenHttpService.ping', async () => {
    mockHttp.ping.mockResolvedValue(undefined);
    await service.ping();
    expect(mockHttp.ping).toHaveBeenCalledTimes(1);
  });
});
