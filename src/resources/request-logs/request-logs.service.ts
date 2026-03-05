import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  RequestLogResponse,
  RequestLogListResponse,
  ListRequestLogsParams,
} from './request-logs.types';

@Injectable()
export class RequestLogsService {
  constructor(private readonly http: KeygenHttpService) {}

  async retrieve(requestId: string): Promise<RequestLogResponse> {
    return this.http.get<RequestLogResponse>(`/request-logs/${requestId}`);
  }

  async list(params?: ListRequestLogsParams): Promise<RequestLogListResponse> {
    return this.http.get<RequestLogListResponse>('/request-logs', params);
  }
}
