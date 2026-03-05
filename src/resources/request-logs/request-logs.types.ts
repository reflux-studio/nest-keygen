import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface RequestLogAttributes {
  url: string;
  method: string;
  status: string;
  userAgent: string | null;
  ip: string | null;
  requestHeaders: Record<string, string> | null;
  requestBody: string | null;
  responseHeaders: Record<string, string> | null;
  responseBody: string | null;
  responseSignature: string | null;
  created: string;
  updated: string;
}

export interface RequestLogRelationships {
  account: JsonApiRelationship;
  environment: JsonApiRelationship;
  requestor: JsonApiRelationship;
}

export type RequestLogResource = JsonApiResource<
  RequestLogAttributes,
  RequestLogRelationships
>;
export type RequestLogResponse = JsonApiSingleResponse<RequestLogResource>;
export type RequestLogListResponse = JsonApiListResponse<RequestLogResource>;

export interface ListRequestLogsParams extends ListQueryParams {
  ip?: string;
  method?: string;
  status?: string;
  url?: string;
}
