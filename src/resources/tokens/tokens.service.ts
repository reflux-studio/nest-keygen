import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  TokenResponse,
  TokenListResponse,
  GenerateTokenInput,
  ListTokensParams,
} from './tokens.types';

@Injectable()
export class TokensService {
  constructor(private readonly http: KeygenHttpService) {}

  async generate(credentials: GenerateTokenInput): Promise<TokenResponse> {
    const auth = `Basic ${Buffer.from(`${credentials.email}:${credentials.password}`).toString('base64')}`;
    return this.http.post<TokenResponse>('/tokens', undefined, undefined, auth);
  }

  async list(params?: ListTokensParams): Promise<TokenListResponse> {
    return this.http.get<TokenListResponse>('/tokens', params);
  }

  async retrieve(tokenId: string): Promise<TokenResponse> {
    return this.http.get<TokenResponse>(`/tokens/${tokenId}`);
  }

  async regenerate(tokenId: string): Promise<TokenResponse> {
    return this.http.put<TokenResponse>(`/tokens/${tokenId}`);
  }

  async revoke(tokenId: string): Promise<void> {
    return this.http.delete(`/tokens/${tokenId}`);
  }
}
