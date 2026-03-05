import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  EnvironmentResponse,
  EnvironmentListResponse,
  CreateEnvironmentData,
  UpdateEnvironmentData,
  ListEnvironmentsParams,
} from './environments.types';
import { TokenResponse } from '../tokens/tokens.types';

@Injectable()
export class EnvironmentsService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建环境，ISOLATED 需至少嵌入一个 admin */
  async create(data: CreateEnvironmentData): Promise<EnvironmentResponse> {
    const { admins, ...attributes } = data;
    const body = {
      data: {
        type: 'environments',
        attributes,
        ...(admins ? { relationships: { admins: { data: admins } } } : {}),
      },
    };
    const res = await firstValueFrom(
      this.httpService.post<EnvironmentResponse>('/environments', body),
    );
    return res.data;
  }

  /** 获取环境详情（按 ID 或 code） */
  async retrieve(environmentId: string): Promise<EnvironmentResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EnvironmentResponse>(
        `/environments/${environmentId}`,
      ),
    );
    return res.data;
  }

  /** 更新环境 */
  async update(
    environmentId: string,
    data: UpdateEnvironmentData,
  ): Promise<EnvironmentResponse> {
    const body = { data: { type: 'environments', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<EnvironmentResponse>(
        `/environments/${environmentId}`,
        body,
      ),
    );
    return res.data;
  }

  /** 永久删除环境，资源将排队删除 */
  async delete(environmentId: string): Promise<void> {
    await firstValueFrom(
      this.httpService.delete(`/environments/${environmentId}`),
    );
  }

  /** 列出环境，支持 limit/page */
  async list(
    params?: ListEnvironmentsParams,
  ): Promise<EnvironmentListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EnvironmentListResponse>('/environments', {
        params,
      }),
    );
    return res.data;
  }

  /** 生成该环境的非过期 token，需带 Keygen-Environment header */
  async generateToken(environmentId: string): Promise<TokenResponse> {
    const res = await firstValueFrom(
      this.httpService.post<TokenResponse>(
        `/environments/${environmentId}/tokens`,
      ),
    );
    return res.data;
  }
}
