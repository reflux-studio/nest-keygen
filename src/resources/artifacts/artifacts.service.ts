import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ArtifactResponse,
  ArtifactListResponse,
  UploadArtifactData,
  UpdateArtifactData,
  ListArtifactsParams,
} from './artifacts.types';

@Injectable()
export class ArtifactsService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 artifact 并获取 S3 上传 URL，POST /artifacts，返回 307 重定向 */
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
    const res = await firstValueFrom(
      this.httpService.post<ArtifactResponse>('/artifacts', body),
    );
    const artifact = res.data;
    const redirectRes = await firstValueFrom(
      this.httpService.get(`/artifacts/${artifact.data.id}`, {
        maxRedirects: 0,
        validateStatus: (s) => s >= 300 && s < 400,
      }),
    );
    const uploadUrl = (redirectRes.headers['location'] as string) ?? '';
    return { artifact, uploadUrl };
  }

  /** 获取 artifact 下载 URL，GET 返回 303 重定向到 S3 */
  async getDownloadUrl(artifactId: string): Promise<string> {
    const res = await firstValueFrom(
      this.httpService.get(`/artifacts/${artifactId}`, {
        maxRedirects: 0,
        validateStatus: (s) => s >= 300 && s < 400,
      }),
    );
    return (res.headers['location'] as string) ?? '';
  }

  /** 获取 artifact 详情 */
  async retrieve(artifactId: string): Promise<ArtifactResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ArtifactResponse>(`/artifacts/${artifactId}`),
    );
    return res.data;
  }

  /** 更新 artifact 元数据（checksum、signature 等） */
  async update(
    artifactId: string,
    data: UpdateArtifactData,
  ): Promise<ArtifactResponse> {
    const body = { data: { type: 'artifacts', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<ArtifactResponse>(
        `/artifacts/${artifactId}`,
        body,
      ),
    );
    return res.data;
  }

  /** 永久删除 artifact 及其文件 */
  async yank(artifactId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/artifacts/${artifactId}`));
  }

  /** 列出 artifacts，支持 product/release/platform/arch/status 过滤 */
  async list(params?: ListArtifactsParams): Promise<ArtifactListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ArtifactListResponse>(
        '/artifacts',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
