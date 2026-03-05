import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ProfileResponse } from './profiles.types';

@Injectable()
export class ProfilesService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取当前 token bearer 的用户信息 */
  async me(): Promise<ProfileResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ProfileResponse>('/me'),
    );
    return res.data;
  }
}
