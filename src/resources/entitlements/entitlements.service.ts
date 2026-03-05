import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  EntitlementResponse,
  EntitlementListResponse,
  CreateEntitlementData,
  UpdateEntitlementData,
  ListEntitlementsParams,
} from './entitlements.types';

@Injectable()
export class EntitlementsService {
  constructor(private readonly http: KeygenHttpService) {}

  async create(data: CreateEntitlementData): Promise<EntitlementResponse> {
    const body = { data: { type: 'entitlements', attributes: data } };
    return this.http.post<EntitlementResponse>('/entitlements', body);
  }

  async retrieve(entitlementId: string): Promise<EntitlementResponse> {
    return this.http.get<EntitlementResponse>(`/entitlements/${entitlementId}`);
  }

  async update(
    entitlementId: string,
    data: UpdateEntitlementData,
  ): Promise<EntitlementResponse> {
    const body = { data: { type: 'entitlements', attributes: data } };
    return this.http.patch<EntitlementResponse>(
      `/entitlements/${entitlementId}`,
      body,
    );
  }

  async delete(entitlementId: string): Promise<void> {
    return this.http.delete(`/entitlements/${entitlementId}`);
  }

  async list(
    params?: ListEntitlementsParams,
  ): Promise<EntitlementListResponse> {
    return this.http.get<EntitlementListResponse>('/entitlements', params);
  }
}
