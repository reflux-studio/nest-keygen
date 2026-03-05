import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
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
  constructor(private readonly http: KeygenHttpService) {}

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
    return this.http.post<PolicyResponse>('/policies', body);
  }

  async retrieve(policyId: string): Promise<PolicyResponse> {
    return this.http.get<PolicyResponse>(`/policies/${policyId}`);
  }

  async update(
    policyId: string,
    data: UpdatePolicyData,
  ): Promise<PolicyResponse> {
    const body = { data: { type: 'policies', attributes: data } };
    return this.http.patch<PolicyResponse>(`/policies/${policyId}`, body);
  }

  async delete(policyId: string): Promise<void> {
    return this.http.delete(`/policies/${policyId}`);
  }

  async list(params?: ListPoliciesParams): Promise<PolicyListResponse> {
    return this.http.get<PolicyListResponse>('/policies', params);
  }

  async popPool(policyId: string): Promise<any> {
    return this.http.delete<any>(`/policies/${policyId}/pool`);
  }

  async attachEntitlements(
    policyId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    return this.http.post(`/policies/${policyId}/entitlements`, body);
  }

  async detachEntitlements(
    policyId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    return this.http.delete(`/policies/${policyId}/entitlements`, body);
  }

  async listEntitlements(
    policyId: string,
    params?: ListPoliciesParams,
  ): Promise<EntitlementListResponse> {
    return this.http.get<EntitlementListResponse>(
      `/policies/${policyId}/entitlements`,
      params,
    );
  }
}
