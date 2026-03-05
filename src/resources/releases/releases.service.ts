import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
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
import { ListQueryParams } from '../../interfaces/common.types';

@Injectable()
export class ReleasesService {
  constructor(private readonly http: KeygenHttpService) {}

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
    return this.http.post<ReleaseResponse>('/releases', body);
  }

  async retrieve(releaseId: string): Promise<ReleaseResponse> {
    return this.http.get<ReleaseResponse>(`/releases/${releaseId}`);
  }

  async update(
    releaseId: string,
    data: UpdateReleaseData,
  ): Promise<ReleaseResponse> {
    const body = { data: { type: 'releases', attributes: data } };
    return this.http.patch<ReleaseResponse>(`/releases/${releaseId}`, body);
  }

  async delete(releaseId: string): Promise<void> {
    return this.http.delete(`/releases/${releaseId}`);
  }

  async list(params?: ListReleasesParams): Promise<ReleaseListResponse> {
    return this.http.get<ReleaseListResponse>('/releases', params);
  }

  async upgrade(releaseId: string): Promise<ReleaseResponse> {
    return this.http.get<ReleaseResponse>(`/releases/${releaseId}/upgrade`);
  }

  async publish(releaseId: string): Promise<ReleaseResponse> {
    return this.http.post<ReleaseResponse>(
      `/releases/${releaseId}/actions/publish`,
    );
  }

  async yank(releaseId: string): Promise<ReleaseResponse> {
    return this.http.post<ReleaseResponse>(
      `/releases/${releaseId}/actions/yank`,
    );
  }

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
    return this.http.post(`/releases/${releaseId}/constraints`, body);
  }

  async detachConstraints(
    releaseId: string,
    data: DetachConstraintsData,
  ): Promise<void> {
    const body = {
      data: data.constraintIds.map((id) => ({ type: 'constraints', id })),
    };
    return this.http.delete(`/releases/${releaseId}/constraints`, body);
  }

  async listConstraints(
    releaseId: string,
    params?: ListQueryParams,
  ): Promise<any> {
    return this.http.get<any>(`/releases/${releaseId}/constraints`, params);
  }

  async listArtifacts(
    releaseId: string,
    params?: ListQueryParams,
  ): Promise<ArtifactListResponse> {
    return this.http.get<ArtifactListResponse>(
      `/releases/${releaseId}/artifacts`,
      params,
    );
  }

  async changePackage(
    releaseId: string,
    packageId: string | null,
  ): Promise<void> {
    const body = {
      data: packageId ? { type: 'packages', id: packageId } : null,
    };
    return this.http.put(`/releases/${releaseId}/package`, body);
  }
}
