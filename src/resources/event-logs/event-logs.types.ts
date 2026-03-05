import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** 事件日志属性，记录 license 验证、更新等操作 */
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
