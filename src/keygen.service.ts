import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from './common/keygen-http.service';
import { TokensService } from './resources/tokens/tokens.service';
import { EnvironmentsService } from './resources/environments/environments.service';
import { ProductsService } from './resources/products/products.service';
import { EntitlementsService } from './resources/entitlements/entitlements.service';
import { PoliciesService } from './resources/policies/policies.service';
import { GroupsService } from './resources/groups/groups.service';
import { LicensesService } from './resources/licenses/licenses.service';
import { MachinesService } from './resources/machines/machines.service';
import { ComponentsService } from './resources/components/components.service';
import { ProcessesService } from './resources/processes/processes.service';
import { UsersService } from './resources/users/users.service';
import { PackagesService } from './resources/packages/packages.service';
import { ReleasesService } from './resources/releases/releases.service';
import { ArtifactsService } from './resources/artifacts/artifacts.service';
import { PlatformsService } from './resources/platforms/platforms.service';
import { ArchitecturesService } from './resources/architectures/architectures.service';
import { ChannelsService } from './resources/channels/channels.service';
import { WebhookEndpointsService } from './resources/webhook-endpoints/webhook-endpoints.service';
import { WebhookEventsService } from './resources/webhook-events/webhook-events.service';
import { RequestLogsService } from './resources/request-logs/request-logs.service';
import { EventLogsService } from './resources/event-logs/event-logs.service';
import { ProfilesService } from './resources/profiles/profiles.service';
import { PasswordsService } from './resources/passwords/passwords.service';

@Injectable()
export class KeygenService {
  constructor(
    readonly tokens: TokensService,
    readonly environments: EnvironmentsService,
    readonly products: ProductsService,
    readonly entitlements: EntitlementsService,
    readonly policies: PoliciesService,
    readonly groups: GroupsService,
    readonly licenses: LicensesService,
    readonly machines: MachinesService,
    readonly components: ComponentsService,
    readonly processes: ProcessesService,
    readonly users: UsersService,
    readonly packages: PackagesService,
    readonly releases: ReleasesService,
    readonly artifacts: ArtifactsService,
    readonly platforms: PlatformsService,
    readonly architectures: ArchitecturesService,
    readonly channels: ChannelsService,
    readonly webhookEndpoints: WebhookEndpointsService,
    readonly webhookEvents: WebhookEventsService,
    readonly requestLogs: RequestLogsService,
    readonly eventLogs: EventLogsService,
    readonly profiles: ProfilesService,
    readonly passwords: PasswordsService,
    private readonly http: KeygenHttpService,
  ) {}

  async ping(): Promise<void> {
    return this.http.ping();
  }
}
