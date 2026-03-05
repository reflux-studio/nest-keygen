import { ComponentsService } from './components.service';
import { createMockHttpService } from '../../test-utils';

describe('ComponentsService', () => {
  let service: ComponentsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ComponentsService(http as any);
  });

  it('add builds correct body with machine relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.add({
      machineId: 'mac-1',
      fingerprint: 'fp-1',
      name: 'GPU',
    } as any);
    expect(http.post).toHaveBeenCalledWith('/components', {
      data: {
        type: 'components',
        attributes: { fingerprint: 'fp-1', name: 'GPU' },
        relationships: {
          machine: { data: { type: 'machines', id: 'mac-1' } },
        },
      },
    });
  });

  it('retrieve calls GET /components/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('comp-1');
    expect(http.get).toHaveBeenCalledWith('/components/comp-1');
  });

  it('update calls PATCH /components/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('comp-1', { name: 'CPU' } as any);
    expect(http.patch).toHaveBeenCalledWith('/components/comp-1', {
      data: { type: 'components', attributes: { name: 'CPU' } },
    });
  });

  it('remove calls DELETE /components/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.remove('comp-1');
    expect(http.delete).toHaveBeenCalledWith('/components/comp-1');
  });

  it('list calls GET /components', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/components', undefined);
  });
});
