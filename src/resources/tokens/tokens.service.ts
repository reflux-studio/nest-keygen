import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  TokenResponse,
  TokenListResponse,
  GenerateTokenInput,
  ListTokensParams,
} from './tokens.types';

@Injectable()
export class TokensService {
  constructor(private readonly httpService: HttpService) {}

  /** 用邮箱密码生成 user-token，POST /tokens，Basic 认证 */
  async generate(credentials: GenerateTokenInput): Promise<TokenResponse> {
    const auth = `Basic ${Buffer.from(`${credentials.email}:${credentials.password}`).toString('base64')}`;
    const res = await firstValueFrom(
      this.httpService.post<TokenResponse>('/tokens', undefined, {
        headers: { Authorization: auth },
      }),
    );
    return res.data;
  }

  /** 列出当前 bearer 的 tokens */
  async list(params?: ListTokensParams): Promise<TokenListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<TokenListResponse>('/tokens', { params }),
    );
    return res.data;
  }

  /** 获取 token 详情 */
  async retrieve(tokenId: string): Promise<TokenResponse> {
    const res = await firstValueFrom(
      this.httpService.get<TokenResponse>(`/tokens/${tokenId}`),
    );
    return res.data;
  }

  /** 轮换 token secret 并延长两周过期 */
  async regenerate(tokenId: string): Promise<TokenResponse> {
    const res = await firstValueFrom(
      this.httpService.put<TokenResponse>(`/tokens/${tokenId}`),
    );
    return res.data;
  }

  /** 永久撤销 token */
  async revoke(tokenId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/tokens/${tokenId}`));
  }
}
