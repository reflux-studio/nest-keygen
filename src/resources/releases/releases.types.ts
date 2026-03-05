import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface ReleaseAttributes {
  name: string | null;
  version: string;
  channel: string;
  status: 'DRAFT' | 'PUBLISHED' | 'YANKED';
  tag: string | null;
  backdated: string | null;
  yanked: string | null;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface ReleaseRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
  package: JsonApiRelationship;
  artifacts: JsonApiRelationship;
  constraints: JsonApiRelationship;
  entitlements: JsonApiRelationship;
}

export type ReleaseResource = JsonApiResource<
  ReleaseAttributes,
  ReleaseRelationships
>;
export type ReleaseResponse = JsonApiSingleResponse<ReleaseResource>;
export type ReleaseListResponse = JsonApiListResponse<ReleaseResource>;

export interface CreateReleaseData {
  version: string;
  productId: string;
  packageId?: string;
  name?: string;
  channel?: 'stable' | 'rc' | 'beta' | 'alpha' | 'dev';
  status?: 'DRAFT' | 'PUBLISHED';
  tag?: string;
  backdated?: string;
  metadata?: Record<string, any>;
}

export interface UpdateReleaseData {
  name?: string;
  channel?: 'stable' | 'rc' | 'beta' | 'alpha' | 'dev';
  tag?: string | null;
  backdated?: string | null;
  metadata?: Record<string, any>;
}

export interface AttachConstraintsData {
  entitlementIds: string[];
}

export interface DetachConstraintsData {
  constraintIds: string[];
}

export interface ListReleasesParams extends ListQueryParams {
  product?: string;
  package?: string;
  engine?: string;
  channel?: string;
  status?: string;
}
