import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  EventLogResponse,
  EventLogListResponse,
  ListEventLogsParams,
} from './event-logs.types';

@Injectable()
export class EventLogsService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取单条事件日志，需 event-log.read 权限 */
  async retrieve(eventId: string): Promise<EventLogResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EventLogResponse>(`/event-logs/${eventId}`),
    );
    return res.data;
  }

  /** 列出事件日志，按创建时间倒序 */
  async list(params?: ListEventLogsParams): Promise<EventLogListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EventLogListResponse>(
        '/event-logs',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
