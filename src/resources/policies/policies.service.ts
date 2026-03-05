import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  PolicyResponse,
  PolicyListResponse,
  CreatePolicyData,
  UpdatePolicyData,
  ListPoliciesParams,
} from './policies.types';
import { EntitlementListResponse } from '../entitlements/entitlements.types';

@Injectable()
export class PoliciesService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 policy，需关联 product */
  async create(data: CreatePolicyData): Promise<PolicyResponse> {
    const { productId, ...attributes } = data;
    const body = {
      data: {
        type: 'policies',
        attributes,
        relationships: {
          product: { data: { type: 'products', id: productId } },
        },
      },
    };
    const res = await firstValueFrom(
      this.httpService.post<PolicyResponse>('/policies', body),
    );
    return res.data;
  }

  /** 获取 policy 详情 */
  async retrieve(policyId: string): Promise<PolicyResponse> {
    const res = await firstValueFrom(
      this.httpService.get<PolicyResponse>(`/policies/${policyId}`),
    );
    return res.data;
  }

  /** 更新 policy */
  async update(
    policyId: string,
    data: UpdatePolicyData,
  ): Promise<PolicyResponse> {
    const body = { data: { type: 'policies', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<PolicyResponse>(`/policies/${policyId}`, body),
    );
    return res.data;
  }

  /** 永久删除 policy 及其 licenses */
  async delete(policyId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/policies/${policyId}`));
  }

  /** 列出 policies，支持按 product 过滤 */
  async list(params?: ListPoliciesParams): Promise<PolicyListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<PolicyListResponse>('/policies', { params }),
    );
    return res.data;
  }

  /** 从 policy 的 key pool 弹出一个 key，不创建 license */
  async popPool(policyId: string): Promise<any> {
    const res = await firstValueFrom(
      this.httpService.delete<any>(`/policies/${policyId}/pool`),
    );
    return res.data;
  }

  /** 为 policy 附加权益 */
  async attachEntitlements(
    policyId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    await firstValueFrom(
      this.httpService.post(`/policies/${policyId}/entitlements`, body),
    );
  }

  /** 从 policy 移除权益 */
  async detachEntitlements(
    policyId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    await firstValueFrom(
      this.httpService.delete(`/policies/${policyId}/entitlements`, {
        data: body,
      }),
    );
  }

  /** 列出 policy 的权益 */
  async listEntitlements(
    policyId: string,
    params?: ListPoliciesParams,
  ): Promise<EntitlementListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EntitlementListResponse>(
        `/policies/${policyId}/entitlements`,
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
