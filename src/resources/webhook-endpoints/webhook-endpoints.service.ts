import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  WebhookEndpointResponse,
  WebhookEndpointListResponse,
  CreateWebhookEndpointData,
  UpdateWebhookEndpointData,
  ListWebhookEndpointsParams,
} from './webhook-endpoints.types';

@Injectable()
export class WebhookEndpointsService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 webhook 端点，接收 license.created 等异步事件 */
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
    const res = await firstValueFrom(
      this.httpService.post<WebhookEndpointResponse>(
        '/webhook-endpoints',
        body,
      ),
    );
    return res.data;
  }

  /** 获取 webhook 端点详情 */
  async retrieve(endpointId: string): Promise<WebhookEndpointResponse> {
    const res = await firstValueFrom(
      this.httpService.get<WebhookEndpointResponse>(
        `/webhook-endpoints/${endpointId}`,
      ),
    );
    return res.data;
  }

  /** 更新 webhook 端点 */
  async update(
    endpointId: string,
    data: UpdateWebhookEndpointData,
  ): Promise<WebhookEndpointResponse> {
    const body = { data: { type: 'webhook-endpoints', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<WebhookEndpointResponse>(
        `/webhook-endpoints/${endpointId}`,
        body,
      ),
    );
    return res.data;
  }

  /** 永久删除 webhook 端点 */
  async delete(endpointId: string): Promise<void> {
    await firstValueFrom(
      this.httpService.delete(`/webhook-endpoints/${endpointId}`),
    );
  }

  /** 列出 webhook 端点 */
  async list(
    params?: ListWebhookEndpointsParams,
  ): Promise<WebhookEndpointListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<WebhookEndpointListResponse>(
        '/webhook-endpoints',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
