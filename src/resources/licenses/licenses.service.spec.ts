import { LicensesService } from './licenses.service';
import { createMockHttpService } from '../../test-utils';

describe('LicensesService', () => {
  let service: LicensesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new LicensesService(http as any);
  });

  it('create builds correct body with policy relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ policyId: 'pol-1', name: 'License A' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.type).toBe('licenses');
    expect(body.data.relationships.policy).toEqual({
      data: { type: 'policies', id: 'pol-1' },
    });
    expect(body.data.attributes.name).toBe('License A');
  });

  it('create includes user relationship when userId provided', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ policyId: 'pol-1', userId: 'usr-1' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.relationships.user).toEqual({
      data: { type: 'users', id: 'usr-1' },
    });
  });

  it('create includes group relationship when groupId provided', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.create({ policyId: 'pol-1', groupId: 'grp-1' } as any);
    const body = (http.post.mock.calls[0] as any[])[1];
    expect(body.data.relationships.group).toEqual({
      data: { type: 'groups', id: 'grp-1' },
    });
  });

  it('retrieve calls GET /licenses/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('lic-1');
    expect(http.get).toHaveBeenCalledWith('/licenses/lic-1');
  });

  it('update calls PATCH /licenses/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('lic-1', { name: 'Updated' } as any);
    expect(http.patch).toHaveBeenCalledWith('/licenses/lic-1', {
      data: { type: 'licenses', attributes: { name: 'Updated' } },
    });
  });

  it('delete calls DELETE /licenses/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.delete('lic-1');
    expect(http.delete).toHaveBeenCalledWith('/licenses/lic-1');
  });

  it('list calls GET /licenses', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/licenses', undefined);
  });

  it('validate calls POST with meta body', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.validate('lic-1', { nonce: 'abc' } as any);
    expect(http.post).toHaveBeenCalledWith(
      '/licenses/lic-1/actions/validate',
      { meta: { nonce: 'abc' } },
    );
  });

  it('validate without meta passes undefined body', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.validate('lic-1');
    expect(http.post).toHaveBeenCalledWith('/licenses/lic-1/actions/validate', undefined);
  });

  it('validateKey calls POST with key in meta', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.validateKey('KEY-123', { nonce: 'n1' } as any);
    expect(http.post).toHaveBeenCalledWith(
      '/licenses/actions/validate-key',
      { meta: { key: 'KEY-123', nonce: 'n1' } },
    );
  });

  it('suspend calls POST /licenses/:id/actions/suspend', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.suspend('lic-1');
    expect(http.post).toHaveBeenCalledWith('/licenses/lic-1/actions/suspend');
  });

  it('reinstate calls POST /licenses/:id/actions/reinstate', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.reinstate('lic-1');
    expect(http.post).toHaveBeenCalledWith('/licenses/lic-1/actions/reinstate');
  });

  it('renew calls POST /licenses/:id/actions/renew', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.renew('lic-1');
    expect(http.post).toHaveBeenCalledWith('/licenses/lic-1/actions/renew');
  });

  it('revoke calls DELETE /licenses/:id/actions/revoke', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.revoke('lic-1');
    expect(http.delete).toHaveBeenCalledWith('/licenses/lic-1/actions/revoke');
  });

  it('checkOut calls POST /licenses/:id/actions/check-out', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.checkOut('lic-1', { ttl: 3600 } as any);
    expect(http.post).toHaveBeenCalledWith(
      '/licenses/lic-1/actions/check-out',
      { ttl: 3600 },
    );
  });

  it('attachEntitlements calls POST /licenses/:id/entitlements', async () => {
    http.post.mockResolvedValue(undefined);
    await service.attachEntitlements('lic-1', ['ent-1', 'ent-2']);
    expect(http.post).toHaveBeenCalledWith('/licenses/lic-1/entitlements', {
      data: [
        { type: 'entitlements', id: 'ent-1' },
        { type: 'entitlements', id: 'ent-2' },
      ],
    });
  });

  it('detachEntitlements calls DELETE /licenses/:id/entitlements', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.detachEntitlements('lic-1', ['ent-1']);
    expect(http.delete).toHaveBeenCalledWith('/licenses/lic-1/entitlements', {
      data: [{ type: 'entitlements', id: 'ent-1' }],
    });
  });

  it('listEntitlements calls GET /licenses/:id/entitlements', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.listEntitlements('lic-1');
    expect(http.get).toHaveBeenCalledWith('/licenses/lic-1/entitlements', undefined);
  });

  it('changeOwner calls PUT /licenses/:id/owner', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeOwner('lic-1', 'usr-1');
    expect(http.put).toHaveBeenCalledWith('/licenses/lic-1/owner', {
      data: { type: 'users', id: 'usr-1' },
    });
  });

  it('changePolicy calls PUT /licenses/:id/policy', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changePolicy('lic-1', 'pol-2');
    expect(http.put).toHaveBeenCalledWith('/licenses/lic-1/policy', {
      data: { type: 'policies', id: 'pol-2' },
    });
  });

  it('changeGroup with groupId calls PUT with group data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeGroup('lic-1', 'grp-1');
    expect(http.put).toHaveBeenCalledWith('/licenses/lic-1/group', {
      data: { type: 'groups', id: 'grp-1' },
    });
  });

  it('changeGroup with null calls PUT with null data', async () => {
    http.put.mockResolvedValue(undefined);
    await service.changeGroup('lic-1', null);
    expect(http.put).toHaveBeenCalledWith('/licenses/lic-1/group', { data: null });
  });
});
