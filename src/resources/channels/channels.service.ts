import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  ChannelResponse,
  ChannelListResponse,
  ListChannelsParams,
} from './channels.types';

@Injectable()
export class ChannelsService {
  constructor(private readonly http: KeygenHttpService) {}

  async retrieve(channelId: string): Promise<ChannelResponse> {
    return this.http.get<ChannelResponse>(`/channels/${channelId}`);
  }

  async list(params?: ListChannelsParams): Promise<ChannelListResponse> {
    return this.http.get<ChannelListResponse>('/channels', params);
  }
}
