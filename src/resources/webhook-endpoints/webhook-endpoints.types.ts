import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface WebhookEndpointAttributes {
  url: string;
  subscriptions: string[];
  created: string;
  updated: string;
}

export interface WebhookEndpointRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
  environment: JsonApiRelationship;
}

export type WebhookEndpointResource = JsonApiResource<
  WebhookEndpointAttributes,
  WebhookEndpointRelationships
>;
export type WebhookEndpointResponse =
  JsonApiSingleResponse<WebhookEndpointResource>;
export type WebhookEndpointListResponse =
  JsonApiListResponse<WebhookEndpointResource>;

export interface CreateWebhookEndpointData {
  url: string;
  subscriptions?: string[];
  productId?: string;
}

export interface UpdateWebhookEndpointData {
  url?: string;
  subscriptions?: string[];
}

export type ListWebhookEndpointsParams = ListQueryParams;
