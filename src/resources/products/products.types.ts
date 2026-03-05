import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** Product 属性，代表软件应用，定义分发策略、平台、权限 */
export interface ProductAttributes {
  name: string;
  code: string | null;
  distributionStrategy: 'OPEN' | 'LICENSED' | 'CLOSED';
  url: string | null;
  platforms: string[] | null;
  permissions: string[];
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface ProductRelationships {
  account: JsonApiRelationship;
  policies: JsonApiRelationship;
  licenses: JsonApiRelationship;
  machines: JsonApiRelationship;
  users: JsonApiRelationship;
  tokens: JsonApiRelationship;
}

export type ProductResource = JsonApiResource<
  ProductAttributes,
  ProductRelationships
>;
export type ProductResponse = JsonApiSingleResponse<ProductResource>;
export type ProductListResponse = JsonApiListResponse<ProductResource>;

export interface CreateProductData {
  name: string;
  code?: string;
  distributionStrategy?: 'OPEN' | 'LICENSED' | 'CLOSED';
  url?: string;
  platforms?: string[];
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateProductData {
  name?: string;
  code?: string;
  distributionStrategy?: 'OPEN' | 'LICENSED' | 'CLOSED';
  url?: string;
  platforms?: string[];
  permissions?: string[];
  metadata?: Record<string, any>;
}

export type ListProductsParams = ListQueryParams;
