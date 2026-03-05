import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface ArchAttributes {
  name: string | null;
  key: string;
  created: string;
  updated: string;
}

export interface ArchRelationships {
  account: JsonApiRelationship;
}

export type ArchResource = JsonApiResource<ArchAttributes, ArchRelationships>;
export type ArchResponse = JsonApiSingleResponse<ArchResource>;
export type ArchListResponse = JsonApiListResponse<ArchResource>;

export type ListArchesParams = ListQueryParams;
