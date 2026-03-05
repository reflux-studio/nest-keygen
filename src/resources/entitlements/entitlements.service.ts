import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  EntitlementResponse,
  EntitlementListResponse,
  CreateEntitlementData,
  UpdateEntitlementData,
  ListEntitlementsParams,
} from './entitlements.types';

@Injectable()
export class EntitlementsService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建权益，POST /entitlements */
  async create(data: CreateEntitlementData): Promise<EntitlementResponse> {
    const body = { data: { type: 'entitlements', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.post<EntitlementResponse>('/entitlements', body),
    );
    return res.data;
  }

  /** 获取权益详情 */
  async retrieve(entitlementId: string): Promise<EntitlementResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EntitlementResponse>(
        `/entitlements/${entitlementId}`,
      ),
    );
    return res.data;
  }

  /** 更新权益 */
  async update(
    entitlementId: string,
    data: UpdateEntitlementData,
  ): Promise<EntitlementResponse> {
    const body = { data: { type: 'entitlements', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<EntitlementResponse>(
        `/entitlements/${entitlementId}`,
        body,
      ),
    );
    return res.data;
  }

  /** 永久删除权益 */
  async delete(entitlementId: string): Promise<void> {
    await firstValueFrom(
      this.httpService.delete(`/entitlements/${entitlementId}`),
    );
  }

  /** 列出账户下所有权益 */
  async list(
    params?: ListEntitlementsParams,
  ): Promise<EntitlementListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EntitlementListResponse>('/entitlements', {
        params,
      }),
    );
    return res.data;
  }
}
