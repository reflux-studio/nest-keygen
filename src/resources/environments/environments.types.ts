import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface EnvironmentAttributes {
  name: string;
  code: string;
  isolationStrategy: 'ISOLATED' | 'SHARED';
  created: string;
  updated: string;
}

export interface EnvironmentRelationships {
  account: JsonApiRelationship;
}

export type EnvironmentResource = JsonApiResource<
  EnvironmentAttributes,
  EnvironmentRelationships
>;
export type EnvironmentResponse = JsonApiSingleResponse<EnvironmentResource>;
export type EnvironmentListResponse = JsonApiListResponse<EnvironmentResource>;

export interface CreateEnvironmentData {
  name: string;
  code: string;
  isolationStrategy?: 'ISOLATED' | 'SHARED';
  admins?: Array<{ type: 'users'; attributes: { email: string } }>;
}

export interface UpdateEnvironmentData {
  name?: string;
  code?: string;
}

export type ListEnvironmentsParams = ListQueryParams;
