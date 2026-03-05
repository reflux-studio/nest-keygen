import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** 平台属性，由 releases/artifacts 自动填充，只读，如 macOS/Windows/Linux */
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
