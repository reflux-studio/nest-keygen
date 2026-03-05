import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  WebhookEventResponse,
  WebhookEventListResponse,
  ListWebhookEventsParams,
} from './webhook-events.types';

@Injectable()
export class WebhookEventsService {
  constructor(private readonly http: KeygenHttpService) {}

  async retrieve(eventId: string): Promise<WebhookEventResponse> {
    return this.http.get<WebhookEventResponse>(`/webhook-events/${eventId}`);
  }

  async delete(eventId: string): Promise<void> {
    return this.http.delete(`/webhook-events/${eventId}`);
  }

  async list(
    params?: ListWebhookEventsParams,
  ): Promise<WebhookEventListResponse> {
    return this.http.get<WebhookEventListResponse>('/webhook-events', params);
  }

  async retry(eventId: string): Promise<WebhookEventResponse> {
    return this.http.post<WebhookEventResponse>(
      `/webhook-events/${eventId}/actions/retry`,
    );
  }
}
