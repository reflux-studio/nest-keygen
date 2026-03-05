import { createMockHttpService } from '../test-utils';
import { ChannelsService } from './channels/channels.service';
import { PlatformsService } from './platforms/platforms.service';
import { ArchitecturesService } from './architectures/architectures.service';
import { RequestLogsService } from './request-logs/request-logs.service';
import { EventLogsService } from './event-logs/event-logs.service';

type ReadOnlyResourceCase = {
  name: string;
  Service: new (http: any) => {
    retrieve(id: string): Promise<unknown>;
    list(params?: Record<string, unknown>): Promise<unknown>;
  };
  retrieveId: string;
  retrievePath: string;
  listPath: string;
  listParams: Record<string, unknown>;
};

const cases: ReadOnlyResourceCase[] = [
  {
    name: 'ChannelsService',
    Service: ChannelsService,
    retrieveId: 'chan-1',
    retrievePath: '/channels/chan-1',
    listPath: '/channels',
    listParams: { limit: 5 },
  },
  {
    name: 'PlatformsService',
    Service: PlatformsService,
    retrieveId: 'plat-1',
    retrievePath: '/platforms/plat-1',
    listPath: '/platforms',
    listParams: { limit: 5 },
  },
  {
    name: 'ArchitecturesService',
    Service: ArchitecturesService,
    retrieveId: 'arch-1',
    retrievePath: '/arches/arch-1',
    listPath: '/arches',
    listParams: { limit: 5 },
  },
  {
    name: 'RequestLogsService',
    Service: RequestLogsService,
    retrieveId: 'req-1',
    retrievePath: '/request-logs/req-1',
    listPath: '/request-logs',
    listParams: { limit: 10 },
  },
  {
    name: 'EventLogsService',
    Service: EventLogsService,
    retrieveId: 'evt-1',
    retrievePath: '/event-logs/evt-1',
    listPath: '/event-logs',
    listParams: { limit: 10 },
  },
];

describe('Read-only resources contract', () => {
  describe.each(cases)(
    '$name',
    ({ Service, retrieveId, retrievePath, listPath, listParams }) => {
      let service: InstanceType<typeof Service>;
      let http: ReturnType<typeof createMockHttpService>;

      beforeEach(() => {
        http = createMockHttpService();
        service = new Service(http as any);
      });

      it('retrieve calls expected GET path', async () => {
        http.get.mockResolvedValue({ data: {} });
        await service.retrieve(retrieveId);
        expect(http.get).toHaveBeenCalledWith(retrievePath);
      });

      it('list calls expected GET path without params', async () => {
        http.get.mockResolvedValue({ data: [] });
        await service.list();
        expect(http.get).toHaveBeenCalledWith(listPath, undefined);
      });

      it('list passes params', async () => {
        http.get.mockResolvedValue({ data: [] });
        await service.list(listParams);
        expect(http.get).toHaveBeenCalledWith(listPath, listParams);
      });
    },
  );
});
