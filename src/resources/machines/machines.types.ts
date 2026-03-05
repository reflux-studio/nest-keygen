import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface MachineAttributes {
  fingerprint: string;
  cores: number | null;
  name: string | null;
  platform: string | null;
  requireHeartbeat: boolean;
  lastHeartbeat: string | null;
  nextHeartbeat: string | null;
  ip: string | null;
  hostname: string | null;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface MachineRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
  license: JsonApiRelationship;
  owner: JsonApiRelationship;
  group: JsonApiRelationship;
  components: JsonApiRelationship;
  processes: JsonApiRelationship;
}

export type MachineResource = JsonApiResource<
  MachineAttributes,
  MachineRelationships
>;
export type MachineResponse = JsonApiSingleResponse<MachineResource>;
export type MachineListResponse = JsonApiListResponse<MachineResource>;

export interface ActivateMachineData {
  fingerprint: string;
  licenseId: string;
  platform?: string;
  name?: string;
  cores?: number;
  ip?: string;
  hostname?: string;
  ownerId?: string;
  groupId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateMachineData {
  name?: string;
  ip?: string;
  hostname?: string;
  cores?: number;
  metadata?: Record<string, any>;
}

export interface CheckOutMachineParams {
  encrypt?: boolean;
  ttl?: number;
  include?: string[];
}

export interface ListMachinesParams extends ListQueryParams {
  license?: string;
  product?: string;
  user?: string;
  group?: string;
  fingerprint?: string;
}
