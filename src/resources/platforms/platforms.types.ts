import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface PlatformAttributes {
  name: string | null;
  key: string;
  created: string;
  updated: string;
}

export interface PlatformRelationships {
  account: JsonApiRelationship;
}

export type PlatformResource = JsonApiResource<
  PlatformAttributes,
  PlatformRelationships
>;
export type PlatformResponse = JsonApiSingleResponse<PlatformResource>;
export type PlatformListResponse = JsonApiListResponse<PlatformResource>;

export type ListPlatformsParams = ListQueryParams;
