import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  PackageResponse,
  PackageListResponse,
  CreatePackageData,
  UpdatePackageData,
  ListPackagesParams,
} from './packages.types';

@Injectable()
export class PackagesService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 package，可关联 product 和 engine（pypi/npm/oci 等） */
  async create(data: CreatePackageData): Promise<PackageResponse> {
    const { productId, ...attributes } = data;
    const body = {
      data: {
        type: 'packages',
        attributes,
        relationships: {
          product: { data: { type: 'products', id: productId } },
        },
      },
    };
    const res = await firstValueFrom(
      this.httpService.post<PackageResponse>('/packages', body),
    );
    return res.data;
  }

  /** 获取 package 详情（按 ID 或 key） */
  async retrieve(packageId: string): Promise<PackageResponse> {
    const res = await firstValueFrom(
      this.httpService.get<PackageResponse>(`/packages/${packageId}`),
    );
    return res.data;
  }

  /** 更新 package */
  async update(
    packageId: string,
    data: UpdatePackageData,
  ): Promise<PackageResponse> {
    const body = { data: { type: 'packages', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<PackageResponse>(`/packages/${packageId}`, body),
    );
    return res.data;
  }

  /** 永久删除 package 及其 releases/artifacts */
  async delete(packageId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/packages/${packageId}`));
  }

  /** 列出 packages，支持 product/engine 过滤 */
  async list(params?: ListPackagesParams): Promise<PackageListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<PackageListResponse>(
        '/packages',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
