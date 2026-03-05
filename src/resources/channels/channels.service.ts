import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ChannelResponse,
  ChannelListResponse,
  ListChannelsParams,
} from './channels.types';

@Injectable()
export class ChannelsService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取单个渠道详情 */
  async retrieve(channelId: string): Promise<ChannelResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ChannelResponse>(`/channels/${channelId}`),
    );
    return res.data;
  }

  /** 列出所有渠道，按创建时间倒序 */
  async list(params?: ListChannelsParams): Promise<ChannelListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ChannelListResponse>(
        '/channels',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
