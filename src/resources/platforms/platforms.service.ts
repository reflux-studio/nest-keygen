import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  PlatformResponse,
  PlatformListResponse,
  ListPlatformsParams,
} from './platforms.types';

@Injectable()
export class PlatformsService {
  constructor(private readonly http: KeygenHttpService) {}

  async retrieve(platformId: string): Promise<PlatformResponse> {
    return this.http.get<PlatformResponse>(`/platforms/${platformId}`);
  }

  async list(params?: ListPlatformsParams): Promise<PlatformListResponse> {
    return this.http.get<PlatformListResponse>('/platforms', params);
  }
}
