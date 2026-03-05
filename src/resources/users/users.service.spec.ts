import { UsersService } from './users.service';
import { createMockHttpService } from '../../test-utils';

describe('UsersService', () => {
  let service: UsersService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new UsersService(http as any);
  });

  it('create without groupId omits relationships', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ email: 'a@b.com', firstName: 'Alice' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.relationships).toBeUndefined();
    expect(body.data.attributes.email).toBe('a@b.com');
  });

  it('create with groupId includes group relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ email: 'a@b.com', groupId: 'grp-1' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.relationships).toEqual({
      group: { data: { type: 'groups', id: 'grp-1' } },
    });
  });

  it('retrieve calls GET /users/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('usr-1');
    expect(http.get).toHaveBeenCalledWith('/users/usr-1');
  });

  it('update calls PATCH /users/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('usr-1', { firstName: 'Bob' } as any);
    expect(http.patch).toHaveBeenCalledWith('/users/usr-1', {
      data: { type: 'users', attributes: { firstName: 'Bob' } },
    });
  });

  it('delete calls DELETE /users/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('usr-1');
    expect(http.delete).toHaveBeenCalledWith('/users/usr-1');
  });

  it('list calls GET /users', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/users', undefined);
  });

  it('updatePassword calls PUT /users/:id/password', async () => {
    http.put.mockResolvedValue(undefined);
    await service.updatePassword('usr-1', { oldPassword: 'old', newPassword: 'new' } as any);
    expect(http.put).toHaveBeenCalledWith('/users/usr-1/password', {
      data: { type: 'users', attributes: { oldPassword: 'old', newPassword: 'new' } },
    });
  });

  it('ban calls POST /users/:id/actions/ban', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.ban('usr-1');
    expect(http.post).toHaveBeenCalledWith('/users/usr-1/actions/ban');
  });

  it('unban calls POST /users/:id/actions/unban', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.unban('usr-1');
    expect(http.post).toHaveBeenCalledWith('/users/usr-1/actions/unban');
  });

  it('changeGroup with groupId calls PUT with group data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeGroup('usr-1', 'grp-1');
    expect(http.put).toHaveBeenCalledWith('/users/usr-1/group', {
      data: { type: 'groups', id: 'grp-1' },
    });
  });

  it('changeGroup with null calls PUT with null data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeGroup('usr-1', null);
    expect(http.put).toHaveBeenCalledWith('/users/usr-1/group', { data: null });
  });
});
