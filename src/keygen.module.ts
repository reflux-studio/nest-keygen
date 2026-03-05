import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KEYGEN_OPTIONS } from './keygen.constants';
import { KeygenOptions } from './keygen.types';
import { KeygenService } from './keygen.service';
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

const RESOURCE_SERVICES = [
  TokensService,
  EnvironmentsService,
  ProductsService,
  EntitlementsService,
  PoliciesService,
  GroupsService,
  LicensesService,
  MachinesService,
  ComponentsService,
  ProcessesService,
  UsersService,
  PackagesService,
  ReleasesService,
  ArtifactsService,
  PlatformsService,
  ArchitecturesService,
  ChannelsService,
  WebhookEndpointsService,
  WebhookEventsService,
  RequestLogsService,
  EventLogsService,
  ProfilesService,
  PasswordsService,
  KeygenService,
];

@Module({})
export class KeygenModule {
  static forRoot(options: KeygenOptions): DynamicModule {
    return {
      module: KeygenModule,
      global: options.isGlobal ?? false,
      imports: [
        HttpModule.register({
          baseURL: `${options.baseUrl ?? 'https://api.keygen.sh'}/v1/accounts/${options.account}`,
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
            ...(options.token && { Authorization: `Bearer ${options.token}` }),
            ...(options.licenseKey && {
              Authorization: `License ${options.licenseKey}`,
            }),
            ...(options.apiVersion && { 'Keygen-Version': options.apiVersion }),
            ...(options.environment && {
              'Keygen-Environment': options.environment,
            }),
          },
        }),
      ],
      providers: [
        { provide: KEYGEN_OPTIONS, useValue: options },
        ...RESOURCE_SERVICES,
      ],
      exports: [KeygenService, HttpModule],
    };
  }
}
