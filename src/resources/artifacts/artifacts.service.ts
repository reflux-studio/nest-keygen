import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  ArtifactResponse,
  ArtifactListResponse,
  UploadArtifactData,
  UpdateArtifactData,
  ListArtifactsParams,
} from './artifacts.types';

@Injectable()
export class ArtifactsService {
  constructor(private readonly http: KeygenHttpService) {}

  async upload(
    data: UploadArtifactData,
  ): Promise<{ artifact: ArtifactResponse; uploadUrl: string }> {
    const { releaseId, ...attributes } = data;
    const body = {
      data: {
        type: 'artifacts',
        attributes,
        relationships: {
          release: { data: { type: 'releases', id: releaseId } },
        },
      },
    };
    const artifact = await this.http.post<ArtifactResponse>('/artifacts', body);
    const uploadUrl = await this.http.getRedirectUrl(
      `/artifacts/${artifact.data.id}`,
    );
    return { artifact, uploadUrl };
  }

  async getDownloadUrl(artifactId: string): Promise<string> {
    return this.http.getRedirectUrl(`/artifacts/${artifactId}`);
  }

  async retrieve(artifactId: string): Promise<ArtifactResponse> {
    return this.http.get<ArtifactResponse>(`/artifacts/${artifactId}`);
  }

  async update(
    artifactId: string,
    data: UpdateArtifactData,
  ): Promise<ArtifactResponse> {
    const body = { data: { type: 'artifacts', attributes: data } };
    return this.http.patch<ArtifactResponse>(`/artifacts/${artifactId}`, body);
  }

  async yank(artifactId: string): Promise<void> {
    return this.http.delete(`/artifacts/${artifactId}`);
  }

  async list(params?: ListArtifactsParams): Promise<ArtifactListResponse> {
    return this.http.get<ArtifactListResponse>('/artifacts', params);
  }
}
