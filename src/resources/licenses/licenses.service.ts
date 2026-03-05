import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  LicenseResponse,
  LicenseListResponse,
  LicenseValidationResponse,
  CreateLicenseData,
  UpdateLicenseData,
  ValidateLicenseMeta,
  ValidateKeyMeta,
  CheckOutLicenseParams,
  ListLicensesParams,
} from './licenses.types';
import { EntitlementListResponse } from '../entitlements/entitlements.types';
import { ListQueryParams } from '../../interfaces/common.types';

@Injectable()
export class LicensesService {
  constructor(private readonly http: KeygenHttpService) {}

  async create(data: CreateLicenseData): Promise<LicenseResponse> {
    const { policyId, userId, groupId, ...attributes } = data;
    const relationships: Record<
      string,
      { data: { type: string; id: string } | null }
    > = {
      policy: { data: { type: 'policies', id: policyId } },
    };
    if (userId) relationships['user'] = { data: { type: 'users', id: userId } };
    if (groupId)
      relationships['group'] = { data: { type: 'groups', id: groupId } };

    const body = { data: { type: 'licenses', attributes, relationships } };
    return this.http.post<LicenseResponse>('/licenses', body);
  }

  async retrieve(licenseId: string): Promise<LicenseResponse> {
    return this.http.get<LicenseResponse>(`/licenses/${licenseId}`);
  }

  async update(
    licenseId: string,
    data: UpdateLicenseData,
  ): Promise<LicenseResponse> {
    const body = { data: { type: 'licenses', attributes: data } };
    return this.http.patch<LicenseResponse>(`/licenses/${licenseId}`, body);
  }

  async delete(licenseId: string): Promise<void> {
    return this.http.delete(`/licenses/${licenseId}`);
  }

  async list(params?: ListLicensesParams): Promise<LicenseListResponse> {
    return this.http.get<LicenseListResponse>('/licenses', params);
  }

  async validate(
    licenseId: string,
    meta?: ValidateLicenseMeta,
  ): Promise<LicenseValidationResponse> {
    const body = meta ? { meta } : undefined;
    return this.http.post<LicenseValidationResponse>(
      `/licenses/${licenseId}/actions/validate`,
      body,
    );
  }

  async validateKey(
    key: string,
    meta?: Omit<ValidateKeyMeta, 'key'>,
  ): Promise<LicenseValidationResponse> {
    const body = { meta: { key, ...meta } };
    return this.http.post<LicenseValidationResponse>(
      '/licenses/actions/validate-key',
      body,
    );
  }

  async suspend(licenseId: string): Promise<LicenseResponse> {
    return this.http.post<LicenseResponse>(
      `/licenses/${licenseId}/actions/suspend`,
    );
  }

  async reinstate(licenseId: string): Promise<LicenseResponse> {
    return this.http.post<LicenseResponse>(
      `/licenses/${licenseId}/actions/reinstate`,
    );
  }

  async renew(licenseId: string): Promise<LicenseResponse> {
    return this.http.post<LicenseResponse>(
      `/licenses/${licenseId}/actions/renew`,
    );
  }

  async revoke(licenseId: string): Promise<void> {
    return this.http.delete(`/licenses/${licenseId}/actions/revoke`);
  }

  async checkOut(
    licenseId: string,
    params?: CheckOutLicenseParams,
  ): Promise<any> {
    return this.http.post<any>(
      `/licenses/${licenseId}/actions/check-out`,
      params,
    );
  }

  async attachEntitlements(
    licenseId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    return this.http.post(`/licenses/${licenseId}/entitlements`, body);
  }

  async detachEntitlements(
    licenseId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    return this.http.delete(`/licenses/${licenseId}/entitlements`, body);
  }

  async listEntitlements(
    licenseId: string,
    params?: ListQueryParams,
  ): Promise<EntitlementListResponse> {
    return this.http.get<EntitlementListResponse>(
      `/licenses/${licenseId}/entitlements`,
      params,
    );
  }

  async changeOwner(licenseId: string, userId: string): Promise<void> {
    const body = { data: { type: 'users', id: userId } };
    return this.http.put(`/licenses/${licenseId}/owner`, body);
  }

  async changePolicy(licenseId: string, policyId: string): Promise<void> {
    const body = { data: { type: 'policies', id: policyId } };
    return this.http.put(`/licenses/${licenseId}/policy`, body);
  }

  async changeGroup(licenseId: string, groupId: string | null): Promise<void> {
    const body = { data: groupId ? { type: 'groups', id: groupId } : null };
    return this.http.put(`/licenses/${licenseId}/group`, body);
  }
}
