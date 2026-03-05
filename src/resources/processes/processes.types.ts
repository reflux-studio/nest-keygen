import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface ProcessAttributes {
  pid: string;
  status: 'ALIVE' | 'DEAD';
  interval: number;
  lastHeartbeat: string | null;
  nextHeartbeat: string | null;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface ProcessRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
  license: JsonApiRelationship;
  machine: JsonApiRelationship;
}

export type ProcessResource = JsonApiResource<
  ProcessAttributes,
  ProcessRelationships
>;
export type ProcessResponse = JsonApiSingleResponse<ProcessResource>;
export type ProcessListResponse = JsonApiListResponse<ProcessResource>;

export interface SpawnProcessData {
  pid: string;
  machineId: string;
  metadata?: Record<string, any>;
}

export interface UpdateProcessData {
  metadata?: Record<string, any>;
}

export interface ListProcessesParams extends ListQueryParams {
  machine?: string;
  license?: string;
  product?: string;
  user?: string;
}
