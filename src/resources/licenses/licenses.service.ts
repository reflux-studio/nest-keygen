import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
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
import { ListQueryParams } from '../../keygen.types';

@Injectable()
export class LicensesService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 license，需关联 policy */
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
    const res = await firstValueFrom(
      this.httpService.post<LicenseResponse>('/licenses', body),
    );
    return res.data;
  }

  /** 获取 license 详情 */
  async retrieve(licenseId: string): Promise<LicenseResponse> {
    const res = await firstValueFrom(
      this.httpService.get<LicenseResponse>(`/licenses/${licenseId}`),
    );
    return res.data;
  }

  /** 更新 license */
  async update(
    licenseId: string,
    data: UpdateLicenseData,
  ): Promise<LicenseResponse> {
    const body = { data: { type: 'licenses', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<LicenseResponse>(`/licenses/${licenseId}`, body),
    );
    return res.data;
  }

  /** 永久删除 license */
  async delete(licenseId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/licenses/${licenseId}`));
  }

  /** 列出 licenses，支持 product/policy/user/group/status 过滤 */
  async list(params?: ListLicensesParams): Promise<LicenseListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<LicenseListResponse>(
        '/licenses',
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 按 license ID 验证，需认证 */
  async validate(
    licenseId: string,
    meta?: ValidateLicenseMeta,
  ): Promise<LicenseValidationResponse> {
    const body = meta ? { meta } : undefined;
    const res = await firstValueFrom(
      this.httpService.post<LicenseValidationResponse>(
        `/licenses/${licenseId}/actions/validate`,
        body,
      ),
    );
    return res.data;
  }

  /** 按 key 验证，无需认证，POST /licenses/actions/validate-key */
  async validateKey(
    key: string,
    meta?: Omit<ValidateKeyMeta, 'key'>,
  ): Promise<LicenseValidationResponse> {
    const body = { meta: { key, ...meta } };
    const res = await firstValueFrom(
      this.httpService.post<LicenseValidationResponse>(
        '/licenses/actions/validate-key',
        body,
      ),
    );
    return res.data;
  }

  /** 暂停 license */
  async suspend(licenseId: string): Promise<LicenseResponse> {
    const res = await firstValueFrom(
      this.httpService.post<LicenseResponse>(
        `/licenses/${licenseId}/actions/suspend`,
      ),
    );
    return res.data;
  }

  /** 恢复已暂停的 license */
  async reinstate(licenseId: string): Promise<LicenseResponse> {
    const res = await firstValueFrom(
      this.httpService.post<LicenseResponse>(
        `/licenses/${licenseId}/actions/reinstate`,
      ),
    );
    return res.data;
  }

  /** 续期 license */
  async renew(licenseId: string): Promise<LicenseResponse> {
    const res = await firstValueFrom(
      this.httpService.post<LicenseResponse>(
        `/licenses/${licenseId}/actions/renew`,
      ),
    );
    return res.data;
  }

  /** 撤销 license */
  async revoke(licenseId: string): Promise<void> {
    await firstValueFrom(
      this.httpService.delete(`/licenses/${licenseId}/actions/revoke`),
    );
  }

  /** 签出 license 文件（.lic），支持加密和 TTL */
  async checkOut(
    licenseId: string,
    params?: CheckOutLicenseParams,
  ): Promise<any> {
    const res = await firstValueFrom(
      this.httpService.post<any>(
        `/licenses/${licenseId}/actions/check-out`,
        params,
      ),
    );
    return res.data;
  }

  /** 为 license 附加权益 */
  async attachEntitlements(
    licenseId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    await firstValueFrom(
      this.httpService.post(`/licenses/${licenseId}/entitlements`, body),
    );
  }

  /** 从 license 移除权益 */
  async detachEntitlements(
    licenseId: string,
    entitlementIds: string[],
  ): Promise<void> {
    const body = {
      data: entitlementIds.map((id) => ({ type: 'entitlements', id })),
    };
    await firstValueFrom(
      this.httpService.delete(`/licenses/${licenseId}/entitlements`, {
        data: body,
      }),
    );
  }

  /** 列出 license 的权益 */
  async listEntitlements(
    licenseId: string,
    params?: ListQueryParams,
  ): Promise<EntitlementListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<EntitlementListResponse>(
        `/licenses/${licenseId}/entitlements`,
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 更换 license 所属用户 */
  async changeOwner(licenseId: string, userId: string): Promise<void> {
    const body = { data: { type: 'users', id: userId } };
    await firstValueFrom(
      this.httpService.put(`/licenses/${licenseId}/owner`, body),
    );
  }

  /** 更换 license 的 policy */
  async changePolicy(licenseId: string, policyId: string): Promise<void> {
    const body = { data: { type: 'policies', id: policyId } };
    await firstValueFrom(
      this.httpService.put(`/licenses/${licenseId}/policy`, body),
    );
  }

  /** 更换 license 的组 */
  async changeGroup(licenseId: string, groupId: string | null): Promise<void> {
    const body = { data: groupId ? { type: 'groups', id: groupId } : null };
    await firstValueFrom(
      this.httpService.put(`/licenses/${licenseId}/group`, body),
    );
  }
}
