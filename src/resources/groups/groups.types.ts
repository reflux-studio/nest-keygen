import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface GroupAttributes {
  name: string;
  maxUsers: number | null;
  maxLicenses: number | null;
  maxMachines: number | null;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface GroupRelationships {
  account: JsonApiRelationship;
  owners: JsonApiRelationship;
  users: JsonApiRelationship;
  licenses: JsonApiRelationship;
  machines: JsonApiRelationship;
}

export type GroupResource = JsonApiResource<
  GroupAttributes,
  GroupRelationships
>;
export type GroupResponse = JsonApiSingleResponse<GroupResource>;
export type GroupListResponse = JsonApiListResponse<GroupResource>;

export interface CreateGroupData {
  name: string;
  maxUsers?: number | null;
  maxLicenses?: number | null;
  maxMachines?: number | null;
  metadata?: Record<string, any>;
}

export interface UpdateGroupData {
  name?: string;
  maxUsers?: number | null;
  maxLicenses?: number | null;
  maxMachines?: number | null;
  metadata?: Record<string, any>;
}

export type ListGroupsParams = ListQueryParams;
