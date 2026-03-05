import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface EventLogAttributes {
  event: string;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface EventLogRelationships {
  account: JsonApiRelationship;
  environment: JsonApiRelationship;
  request: JsonApiRelationship;
  whodunnit: JsonApiRelationship;
  resource: JsonApiRelationship;
}

export type EventLogResource = JsonApiResource<
  EventLogAttributes,
  EventLogRelationships
>;
export type EventLogResponse = JsonApiSingleResponse<EventLogResource>;
export type EventLogListResponse = JsonApiListResponse<EventLogResource>;

export interface ListEventLogsParams extends ListQueryParams {
  event?: string;
  resource?: string;
  resourceType?: string;
}
