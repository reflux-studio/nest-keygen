import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface ComponentAttributes {
  fingerprint: string;
  name: string;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface ComponentRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
  license: JsonApiRelationship;
  machine: JsonApiRelationship;
}

export type ComponentResource = JsonApiResource<
  ComponentAttributes,
  ComponentRelationships
>;
export type ComponentResponse = JsonApiSingleResponse<ComponentResource>;
export type ComponentListResponse = JsonApiListResponse<ComponentResource>;

export interface AddComponentData {
  fingerprint: string;
  name: string;
  machineId: string;
  metadata?: Record<string, any>;
}

export interface UpdateComponentData {
  name?: string;
  metadata?: Record<string, any>;
}

export interface ListComponentsParams extends ListQueryParams {
  machine?: string;
  license?: string;
  product?: string;
}
