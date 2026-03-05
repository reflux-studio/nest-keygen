import { GroupsService } from './groups.service';
import { createMockHttpService } from '../../test-utils';

describe('GroupsService', () => {
  let service: GroupsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new GroupsService(http as any);
  });

  it('create calls POST /groups with correct body', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ name: 'Team A' } as any);
    expect(http.post).toHaveBeenCalledWith('/groups', {
      data: { type: 'groups', attributes: { name: 'Team A' } },
    });
  });

  it('retrieve calls GET /groups/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('grp-1');
    expect(http.get).toHaveBeenCalledWith('/groups/grp-1');
  });

  it('update calls PATCH /groups/:id with correct body', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('grp-1', { name: 'Team B' } as any);
    expect(http.patch).toHaveBeenCalledWith('/groups/grp-1', {
      data: { type: 'groups', attributes: { name: 'Team B' } },
    });
  });

  it('delete calls DELETE /groups/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('grp-1');
    expect(http.delete).toHaveBeenCalledWith('/groups/grp-1');
  });

  it('list calls GET /groups', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/groups', undefined);
  });
});
