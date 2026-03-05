export interface JsonApiRelationshipData {
  type: string;
  id: string;
}

export interface JsonApiRelationship {
  data: JsonApiRelationshipData | JsonApiRelationshipData[] | null;
  links?: { related?: string; self?: string };
}

export interface JsonApiResource<
  TAttributes extends Record<string, any> = Record<string, any>,
  TRelationships = Record<string, JsonApiRelationship>,
> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: TRelationships;
  links?: Record<string, string>;
  meta?: Record<string, any>;
}

export interface JsonApiSingleResponse<T = JsonApiResource> {
  data: T;
  included?: JsonApiResource[];
  meta?: Record<string, any>;
  links?: Record<string, string>;
}

export interface JsonApiListResponse<T = JsonApiResource> {
  data: T[];
  included?: JsonApiResource[];
  meta?: Record<string, any>;
  links?: Record<string, string>;
}

export interface JsonApiError {
  title: string;
  detail: string;
  code: string;
  source?: { pointer?: string; parameter?: string };
}

export interface JsonApiErrorResponse {
  errors: JsonApiError[];
}

export interface PageParams {
  size?: number;
  number?: number;
}

export interface ListQueryParams {
  limit?: number;
  page?: PageParams;
  [key: string]: any;
}
