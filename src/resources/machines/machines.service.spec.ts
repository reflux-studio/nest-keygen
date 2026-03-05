import { MachinesService } from './machines.service';
import { createMockHttpService } from '../../test-utils';

describe('MachinesService', () => {
  let service: MachinesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new MachinesService(http as any);
  });

  it('activate builds correct body with license relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.activate({ licenseId: 'lic-1', fingerprint: 'fp-1' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.type).toBe('machines');
    expect(body.data.relationships.license).toEqual({
      data: { type: 'licenses', id: 'lic-1' },
    });
    expect(body.data.attributes.fingerprint).toBe('fp-1');
  });

  it('activate includes owner relationship when ownerId provided', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.activate({
      licenseId: 'lic-1',
      ownerId: 'usr-1',
      fingerprint: 'fp-1',
    } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.relationships.owner).toEqual({
      data: { type: 'users', id: 'usr-1' },
    });
  });

  it('activate includes group relationship when groupId provided', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.activate({
      licenseId: 'lic-1',
      groupId: 'grp-1',
      fingerprint: 'fp-1',
    } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.relationships.group).toEqual({
      data: { type: 'groups', id: 'grp-1' },
    });
  });

  it('retrieve calls GET /machines/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('mac-1');
    expect(http.get).toHaveBeenCalledWith('/machines/mac-1');
  });

  it('update calls PATCH /machines/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('mac-1', { name: 'My Machine' } as any);
    expect(http.patch).toHaveBeenCalledWith('/machines/mac-1', {
      data: { type: 'machines', attributes: { name: 'My Machine' } },
    });
  });

  it('deactivate calls DELETE /machines/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.deactivate('mac-1');
    expect(http.delete).toHaveBeenCalledWith('/machines/mac-1');
  });

  it('list calls GET /machines', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/machines', undefined);
  });

  it('checkOut calls POST /machines/:id/actions/check-out', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.checkOut('mac-1', { ttl: 60 } as any);
    expect(http.post).toHaveBeenCalledWith(
      '/machines/mac-1/actions/check-out',
      { ttl: 60 },
    );
  });

  it('ping calls POST /machines/:id/actions/ping', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.ping('mac-1');
    expect(http.post).toHaveBeenCalledWith('/machines/mac-1/actions/ping');
  });

  it('reset calls POST /machines/:id/actions/reset', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.reset('mac-1');
    expect(http.post).toHaveBeenCalledWith('/machines/mac-1/actions/reset');
  });

  it('changeOwner calls PUT /machines/:id/owner', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeOwner('mac-1', 'usr-1');
    expect(http.put).toHaveBeenCalledWith('/machines/mac-1/owner', {
      data: { type: 'users', id: 'usr-1' },
    });
  });

  it('changeGroup with groupId calls PUT with group data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeGroup('mac-1', 'grp-1');
    expect(http.put).toHaveBeenCalledWith('/machines/mac-1/group', {
      data: { type: 'groups', id: 'grp-1' },
    });
  });

  it('changeGroup with null calls PUT with null data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeGroup('mac-1', null);
    expect(http.put).toHaveBeenCalledWith('/machines/mac-1/group', {
      data: null,
    });
  });
});
