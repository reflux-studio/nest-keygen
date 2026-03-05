import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** Webhook 事件属性，失败会重试最多 15 次 */
export interface WebhookEventAttributes {
  event: string;
  payload: string;
  status: 'DELIVERING' | 'DELIVERED' | 'FAILED' | 'RETRYING';
  endpoint: string;
  lastResponseCode: number | null;
  lastResponseBody: string | null;
  created: string;
  updated: string;
}

export interface WebhookEventRelationships {
  account: JsonApiRelationship;
  environment: JsonApiRelationship;
}

export type WebhookEventResource = JsonApiResource<
  WebhookEventAttributes,
  WebhookEventRelationships
>;
export type WebhookEventResponse = JsonApiSingleResponse<WebhookEventResource>;
export type WebhookEventListResponse =
  JsonApiListResponse<WebhookEventResource>;

export interface ListWebhookEventsParams extends ListQueryParams {
  event?: string;
  status?: string;
}
