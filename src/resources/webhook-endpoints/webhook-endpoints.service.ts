import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  WebhookEndpointResponse,
  WebhookEndpointListResponse,
  CreateWebhookEndpointData,
  UpdateWebhookEndpointData,
  ListWebhookEndpointsParams,
} from './webhook-endpoints.types';

@Injectable()
export class WebhookEndpointsService {
  constructor(private readonly http: KeygenHttpService) {}

  async create(
    data: CreateWebhookEndpointData,
  ): Promise<WebhookEndpointResponse> {
    const { productId, ...attributes } = data;
    const body = {
      data: {
        type: 'webhook-endpoints',
        attributes,
        ...(productId
          ? {
              relationships: {
                product: { data: { type: 'products', id: productId } },
              },
            }
          : {}),
      },
    };
    return this.http.post<WebhookEndpointResponse>('/webhook-endpoints', body);
  }

  async retrieve(endpointId: string): Promise<WebhookEndpointResponse> {
    return this.http.get<WebhookEndpointResponse>(
      `/webhook-endpoints/${endpointId}`,
    );
  }

  async update(
    endpointId: string,
    data: UpdateWebhookEndpointData,
  ): Promise<WebhookEndpointResponse> {
    const body = { data: { type: 'webhook-endpoints', attributes: data } };
    return this.http.patch<WebhookEndpointResponse>(
      `/webhook-endpoints/${endpointId}`,
      body,
    );
  }

  async delete(endpointId: string): Promise<void> {
    return this.http.delete(`/webhook-endpoints/${endpointId}`);
  }

  async list(
    params?: ListWebhookEndpointsParams,
  ): Promise<WebhookEndpointListResponse> {
    return this.http.get<WebhookEndpointListResponse>(
      '/webhook-endpoints',
      params,
    );
  }
}
