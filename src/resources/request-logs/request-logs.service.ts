import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  RequestLogResponse,
  RequestLogListResponse,
  ListRequestLogsParams,
} from './request-logs.types';

@Injectable()
export class RequestLogsService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取单条请求日志，列表中的 requestBody/responseBody 为 null */
  async retrieve(requestId: string): Promise<RequestLogResponse> {
    const res = await firstValueFrom(
      this.httpService.get<RequestLogResponse>(`/request-logs/${requestId}`),
    );
    return res.data;
  }

  /** 列出请求日志，按创建时间倒序 */
  async list(params?: ListRequestLogsParams): Promise<RequestLogListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<RequestLogListResponse>(
        '/request-logs',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
