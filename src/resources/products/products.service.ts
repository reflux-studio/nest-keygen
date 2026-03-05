import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ProductResponse,
  ProductListResponse,
  CreateProductData,
  UpdateProductData,
  ListProductsParams,
} from './products.types';
import { TokenResponse } from '../tokens/tokens.types';

@Injectable()
export class ProductsService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 product */
  async create(data: CreateProductData): Promise<ProductResponse> {
    const body = { data: { type: 'products', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.post<ProductResponse>('/products', body),
    );
    return res.data;
  }

  /** 获取 product 详情 */
  async retrieve(productId: string): Promise<ProductResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ProductResponse>(`/products/${productId}`),
    );
    return res.data;
  }

  /** 更新 product */
  async update(
    productId: string,
    data: UpdateProductData,
  ): Promise<ProductResponse> {
    const body = { data: { type: 'products', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<ProductResponse>(`/products/${productId}`, body),
    );
    return res.data;
  }

  /** 永久删除 product 及其 policies/licenses/machines */
  async delete(productId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/products/${productId}`));
  }

  /** 列出 products，按创建时间倒序 */
  async list(params?: ListProductsParams): Promise<ProductListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ProductListResponse>('/products', { params }),
    );
    return res.data;
  }

  /** 生成 product 的长期 token，仅返回一次 */
  async generateToken(productId: string): Promise<TokenResponse> {
    const res = await firstValueFrom(
      this.httpService.post<TokenResponse>(`/products/${productId}/tokens`),
    );
    return res.data;
  }
}
