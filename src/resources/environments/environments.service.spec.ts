import { EnvironmentsService } from './environments.service';
import { createMockHttpService } from '../../test-utils';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new EnvironmentsService(http as any);
  });

  it('create without admins omits relationships', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ name: 'Staging' } as any);
    expect(http.post).toHaveBeenCalledWith('/environments', {
      data: { type: 'environments', attributes: { name: 'Staging' } },
    });
  });

  it('create with admins includes relationships', async () => {
    http.post.mockResolvedValue({ data: {} });
    const admins = [{ type: 'users', id: 'u-1' }];
    await service.create({ name: 'Staging', admins } as any);
    const call = http.post.mock.calls[0] as any[];
    expect(call[1].data.relationships).toEqual({ admins: { data: admins } });
  });

  it('retrieve calls GET /environments/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('env-1');
    expect(http.get).toHaveBeenCalledWith('/environments/env-1');
  });

  it('update calls PATCH /environments/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('env-1', { name: 'Production' } as any);
    expect(http.patch).toHaveBeenCalledWith('/environments/env-1', {
      data: { type: 'environments', attributes: { name: 'Production' } },
    });
  });

  it('delete calls DELETE /environments/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('env-1');
    expect(http.delete).toHaveBeenCalledWith('/environments/env-1');
  });

  it('list calls GET /environments', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/environments', undefined);
  });

  it('generateToken calls POST /environments/:id/tokens', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.generateToken('env-1');
    expect(http.post).toHaveBeenCalledWith('/environments/env-1/tokens');
  });
});
