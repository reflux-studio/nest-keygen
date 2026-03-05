import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface TokenAttributes {
  kind: string;
  token?: string;
  expiry: string | null;
  permissions: string[];
  created: string;
  updated: string;
}

export interface TokenRelationships {
  account: JsonApiRelationship;
  bearer: JsonApiRelationship;
  environment?: JsonApiRelationship;
}

export type TokenResource = JsonApiResource<
  TokenAttributes,
  TokenRelationships
>;
export type TokenResponse = JsonApiSingleResponse<TokenResource>;
export type TokenListResponse = JsonApiListResponse<TokenResource>;

export interface GenerateTokenInput {
  email: string;
  password: string;
}

export type ListTokensParams = ListQueryParams;
