import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  EventLogResponse,
  EventLogListResponse,
  ListEventLogsParams,
} from './event-logs.types';

@Injectable()
export class EventLogsService {
  constructor(private readonly http: KeygenHttpService) {}

  async retrieve(eventId: string): Promise<EventLogResponse> {
    return this.http.get<EventLogResponse>(`/event-logs/${eventId}`);
  }

  async list(params?: ListEventLogsParams): Promise<EventLogListResponse> {
    return this.http.get<EventLogListResponse>('/event-logs', params);
  }
}
