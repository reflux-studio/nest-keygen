import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ArchResponse,
  ArchListResponse,
  ListArchesParams,
} from './architectures.types';

@Injectable()
export class ArchitecturesService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取单个架构详情，GET /arches/<arch> */
  async retrieve(archId: string): Promise<ArchResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ArchResponse>(`/arches/${archId}`),
    );
    return res.data;
  }

  /** 列出所有架构，按创建时间倒序，支持 limit/page */
  async list(params?: ListArchesParams): Promise<ArchListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ArchListResponse>(
        '/arches',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
