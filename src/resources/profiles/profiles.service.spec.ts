import { ProfilesService } from './profiles.service';
import { createMockHttpService } from '../../test-utils';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ProfilesService(http as any);
  });

  it('me calls GET /me', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.me();
    expect(http.get).toHaveBeenCalledWith('/me');
  });

  it('returns result from http.get', async () => {
    const profile = { data: { id: 'u-1' } };
    http.get.mockResolvedValue(profile);
    const result = await service.me();
    expect(result).toEqual(profile);
  });
});
