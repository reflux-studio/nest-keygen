import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
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
  constructor(private readonly http: KeygenHttpService) {}

  async create(data: CreateProductData): Promise<ProductResponse> {
    const body = { data: { type: 'products', attributes: data } };
    return this.http.post<ProductResponse>('/products', body);
  }

  async retrieve(productId: string): Promise<ProductResponse> {
    return this.http.get<ProductResponse>(`/products/${productId}`);
  }

  async update(
    productId: string,
    data: UpdateProductData,
  ): Promise<ProductResponse> {
    const body = { data: { type: 'products', attributes: data } };
    return this.http.patch<ProductResponse>(`/products/${productId}`, body);
  }

  async delete(productId: string): Promise<void> {
    return this.http.delete(`/products/${productId}`);
  }

  async list(params?: ListProductsParams): Promise<ProductListResponse> {
    return this.http.get<ProductListResponse>('/products', params);
  }

  async generateToken(productId: string): Promise<TokenResponse> {
    return this.http.post<TokenResponse>(`/products/${productId}/tokens`);
  }
}
