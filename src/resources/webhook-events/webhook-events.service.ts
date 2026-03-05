import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  WebhookEventResponse,
  WebhookEventListResponse,
  ListWebhookEventsParams,
} from './webhook-events.types';

@Injectable()
export class WebhookEventsService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取 webhook 事件详情 */
  async retrieve(eventId: string): Promise<WebhookEventResponse> {
    const res = await firstValueFrom(
      this.httpService.get<WebhookEventResponse>(`/webhook-events/${eventId}`),
    );
    return res.data;
  }

  /** 永久删除 webhook 事件 */
  async delete(eventId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/webhook-events/${eventId}`));
  }

  /** 列出 webhook 事件，支持 event/status 过滤 */
  async list(
    params?: ListWebhookEventsParams,
  ): Promise<WebhookEventListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<WebhookEventListResponse>(
        '/webhook-events',
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 手动重试失败的事件 */
  async retry(eventId: string): Promise<WebhookEventResponse> {
    const res = await firstValueFrom(
      this.httpService.post<WebhookEventResponse>(
        `/webhook-events/${eventId}/actions/retry`,
      ),
    );
    return res.data;
  }
}
