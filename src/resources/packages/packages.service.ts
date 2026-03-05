import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  PackageResponse,
  PackageListResponse,
  CreatePackageData,
  UpdatePackageData,
  ListPackagesParams,
} from './packages.types';

@Injectable()
export class PackagesService {
  constructor(private readonly http: KeygenHttpService) {}

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
    return this.http.post<PackageResponse>('/packages', body);
  }

  async retrieve(packageId: string): Promise<PackageResponse> {
    return this.http.get<PackageResponse>(`/packages/${packageId}`);
  }

  async update(
    packageId: string,
    data: UpdatePackageData,
  ): Promise<PackageResponse> {
    const body = { data: { type: 'packages', attributes: data } };
    return this.http.patch<PackageResponse>(`/packages/${packageId}`, body);
  }

  async delete(packageId: string): Promise<void> {
    return this.http.delete(`/packages/${packageId}`);
  }

  async list(params?: ListPackagesParams): Promise<PackageListResponse> {
    return this.http.get<PackageListResponse>('/packages', params);
  }
}
