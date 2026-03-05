import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  PlatformResponse,
  PlatformListResponse,
  ListPlatformsParams,
} from './platforms.types';

@Injectable()
export class PlatformsService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取平台详情 */
  async retrieve(platformId: string): Promise<PlatformResponse> {
    const res = await firstValueFrom(
      this.httpService.get<PlatformResponse>(`/platforms/${platformId}`),
    );
    return res.data;
  }

  /** 列出所有平台，按创建时间倒序 */
  async list(params?: ListPlatformsParams): Promise<PlatformListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<PlatformListResponse>(
        '/platforms',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
