import { ProcessesService } from './processes.service';
import { createMockHttpService } from '../../test-utils';

describe('ProcessesService', () => {
  let service: ProcessesService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ProcessesService(http as any);
  });

  it('spawn builds correct body with machine relationship', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.spawn({ machineId: 'mac-1', pid: 1234 } as any);
    expect(http.post).toHaveBeenCalledWith('/processes', {
      data: {
        type: 'processes',
        attributes: { pid: 1234 },
        relationships: {
          machine: { data: { type: 'machines', id: 'mac-1' } },
        },
      },
    });
  });

  it('retrieve calls GET /processes/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('proc-1');
    expect(http.get).toHaveBeenCalledWith('/processes/proc-1');
  });

  it('update calls PATCH /processes/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('proc-1', { status: 'ALIVE' } as any);
    expect(http.patch).toHaveBeenCalledWith('/processes/proc-1', {
      data: { type: 'processes', attributes: { status: 'ALIVE' } },
    });
  });

  it('kill calls DELETE /processes/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.kill('proc-1');
    expect(http.delete).toHaveBeenCalledWith('/processes/proc-1');
  });

  it('list calls GET /processes', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/processes', undefined);
  });

  it('ping calls POST /processes/:id/actions/ping', async () => {
    http.post.mockResolvedValue({ data: {} });
    await service.ping('proc-1');
    expect(http.post).toHaveBeenCalledWith('/processes/proc-1/actions/ping');
  });
});
