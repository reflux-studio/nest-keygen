import { PasswordsService } from './passwords.service';
import { createMockHttpService } from '../../test-utils';

describe('PasswordsService', () => {
  let service: PasswordsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new PasswordsService(http as any);
  });

  it('forgotPassword calls POST /passwords with meta body', async () => {
    http.post.mockResolvedValue(undefined);
    await service.forgotPassword({ email: 'test@example.com' } as any);
    expect(http.post).toHaveBeenCalledWith('/passwords', {
      meta: { email: 'test@example.com' },
    });
  });
});
