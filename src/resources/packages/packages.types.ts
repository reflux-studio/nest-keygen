import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface PackageAttributes {
  name: string;
  key: string;
  engine: string | null;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface PackageRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
}

export type PackageResource = JsonApiResource<
  PackageAttributes,
  PackageRelationships
>;
export type PackageResponse = JsonApiSingleResponse<PackageResource>;
export type PackageListResponse = JsonApiListResponse<PackageResource>;

export interface CreatePackageData {
  name: string;
  key: string;
  productId: string;
  engine?: string;
  metadata?: Record<string, any>;
}

export interface UpdatePackageData {
  name?: string;
  key?: string;
  engine?: string | null;
  metadata?: Record<string, any>;
}

export interface ListPackagesParams extends ListQueryParams {
  product?: string;
  engine?: string;
}
