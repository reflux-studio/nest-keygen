import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KEYGEN_OPTIONS } from './keygen.constants';
import {
  KeygenOptions,
  KeygenAsyncOptions,
  KeygenOptionsFactory,
} from './interfaces/keygen-options.interface';
import { KeygenHttpService } from './common/keygen-http.service';
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
  KeygenHttpService,
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
    const optionsProvider: Provider = {
      provide: KEYGEN_OPTIONS,
      useValue: options,
    };

    return {
      module: KeygenModule,
      global: options.isGlobal ?? false,
      providers: [optionsProvider, ...RESOURCE_SERVICES],
      exports: [KeygenService],
    };
  }

  static forRootAsync(options: KeygenAsyncOptions): DynamicModule {
    return {
      module: KeygenModule,
      global: options.isGlobal ?? false,
      imports: options.imports ?? [],
      providers: [
        ...KeygenModule.createAsyncProviders(options),
        ...RESOURCE_SERVICES,
      ],
      exports: [KeygenService],
    };
  }

  private static createAsyncProviders(options: KeygenAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: KEYGEN_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: KEYGEN_OPTIONS,
          useFactory: async (factory: KeygenOptionsFactory) =>
            factory.createKeygenOptions(),
          inject: [options.useClass],
        },
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: KEYGEN_OPTIONS,
          useFactory: async (factory: KeygenOptionsFactory) =>
            factory.createKeygenOptions(),
          inject: [options.useExisting],
        },
      ];
    }

    return [];
  }
}
