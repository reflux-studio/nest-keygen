import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** 权益属性，命名权限/功能开关，可挂到 policy/license/release */
export interface EntitlementAttributes {
  name: string;
  code: string;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface EntitlementRelationships {
  account: JsonApiRelationship;
}

export type EntitlementResource = JsonApiResource<
  EntitlementAttributes,
  EntitlementRelationships
>;
export type EntitlementResponse = JsonApiSingleResponse<EntitlementResource>;
export type EntitlementListResponse = JsonApiListResponse<EntitlementResource>;

export interface CreateEntitlementData {
  name: string;
  code: string;
  metadata?: Record<string, any>;
}

export interface UpdateEntitlementData {
  name?: string;
  code?: string;
  metadata?: Record<string, any>;
}

export type ListEntitlementsParams = ListQueryParams;
