import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ReleaseResponse,
  ReleaseListResponse,
  CreateReleaseData,
  UpdateReleaseData,
  AttachConstraintsData,
  DetachConstraintsData,
  ListReleasesParams,
} from './releases.types';
import { ArtifactListResponse } from '../artifacts/artifacts.types';
import { ListQueryParams } from '../../keygen.types';

@Injectable()
export class ReleasesService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 release，初始为 DRAFT，需先上传 artifacts 再 publish */
  async create(data: CreateReleaseData): Promise<ReleaseResponse> {
    const { productId, packageId, ...attributes } = data;
    const relationships: Record<
      string,
      { data: { type: string; id: string } | null }
    > = {
      product: { data: { type: 'products', id: productId } },
    };
    if (packageId) {
      relationships['package'] = { data: { type: 'packages', id: packageId } };
    }

    const body = { data: { type: 'releases', attributes, relationships } };
    const res = await firstValueFrom(
      this.httpService.post<ReleaseResponse>('/releases', body),
    );
    return res.data;
  }

  /** 获取 release 详情（按 ID、version 或 tag） */
  async retrieve(releaseId: string): Promise<ReleaseResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ReleaseResponse>(`/releases/${releaseId}`),
    );
    return res.data;
  }

  /** 更新 release */
  async update(
    releaseId: string,
    data: UpdateReleaseData,
  ): Promise<ReleaseResponse> {
    const body = { data: { type: 'releases', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<ReleaseResponse>(`/releases/${releaseId}`, body),
    );
    return res.data;
  }

  /** 永久删除 release */
  async delete(releaseId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/releases/${releaseId}`));
  }

  /** 列出 releases，支持 product/package/engine/channel/status 过滤 */
  async list(params?: ListReleasesParams): Promise<ReleaseListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ReleaseListResponse>(
        '/releases',
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 获取 channel 内符合语义版本的最新可升级 release */
  async upgrade(releaseId: string): Promise<ReleaseResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ReleaseResponse>(`/releases/${releaseId}/upgrade`),
    );
    return res.data;
  }

  /** 发布 DRAFT release */
  async publish(releaseId: string): Promise<ReleaseResponse> {
    const res = await firstValueFrom(
      this.httpService.post<ReleaseResponse>(
        `/releases/${releaseId}/actions/publish`,
      ),
    );
    return res.data;
  }

  /** 下架已发布的 release，可重新 publish */
  async yank(releaseId: string): Promise<ReleaseResponse> {
    const res = await firstValueFrom(
      this.httpService.post<ReleaseResponse>(
        `/releases/${releaseId}/actions/yank`,
      ),
    );
    return res.data;
  }

  /** 附加 entitlement 约束，下载需满足所有约束 */
  async attachConstraints(
    releaseId: string,
    data: AttachConstraintsData,
  ): Promise<void> {
    const body = {
      data: data.entitlementIds.map((id) => ({
        type: 'constraints',
        relationships: { entitlement: { data: { type: 'entitlements', id } } },
      })),
    };
    await firstValueFrom(
      this.httpService.post(`/releases/${releaseId}/constraints`, body),
    );
  }

  /** 移除 entitlement 约束 */
  async detachConstraints(
    releaseId: string,
    data: DetachConstraintsData,
  ): Promise<void> {
    const body = {
      data: data.constraintIds.map((id) => ({ type: 'constraints', id })),
    };
    await firstValueFrom(
      this.httpService.delete(`/releases/${releaseId}/constraints`, {
        data: body,
      }),
    );
  }

  /** 列出 release 的约束 */
  async listConstraints(
    releaseId: string,
    params?: ListQueryParams,
  ): Promise<any> {
    const res = await firstValueFrom(
      this.httpService.get<any>(
        `/releases/${releaseId}/constraints`,
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 列出 release 的 artifacts */
  async listArtifacts(
    releaseId: string,
    params?: ListQueryParams,
  ): Promise<ArtifactListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ArtifactListResponse>(
        `/releases/${releaseId}/artifacts`,
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 更换 release 关联的 package（同 product） */
  async changePackage(
    releaseId: string,
    packageId: string | null,
  ): Promise<void> {
    const body = {
      data: packageId ? { type: 'packages', id: packageId } : null,
    };
    await firstValueFrom(
      this.httpService.put(`/releases/${releaseId}/package`, body),
    );
  }
}
