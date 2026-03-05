import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** Token 属性，user-token 默认过期，env/product token 不过期 */
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

/** 用邮箱密码生成 user-token，raw token 仅返回一次 */
export interface GenerateTokenInput {
  email: string;
  password: string;
}

export type ListTokensParams = ListQueryParams;
