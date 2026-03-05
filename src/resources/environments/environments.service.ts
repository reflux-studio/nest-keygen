import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  EnvironmentResponse,
  EnvironmentListResponse,
  CreateEnvironmentData,
  UpdateEnvironmentData,
  ListEnvironmentsParams,
} from './environments.types';
import { TokenResponse } from '../tokens/tokens.types';

@Injectable()
export class EnvironmentsService {
  constructor(private readonly http: KeygenHttpService) {}

  async create(data: CreateEnvironmentData): Promise<EnvironmentResponse> {
    const { admins, ...attributes } = data;
    const body = {
      data: {
        type: 'environments',
        attributes,
        ...(admins ? { relationships: { admins: { data: admins } } } : {}),
      },
    };
    return this.http.post<EnvironmentResponse>('/environments', body);
  }

  async retrieve(environmentId: string): Promise<EnvironmentResponse> {
    return this.http.get<EnvironmentResponse>(`/environments/${environmentId}`);
  }

  async update(
    environmentId: string,
    data: UpdateEnvironmentData,
  ): Promise<EnvironmentResponse> {
    const body = { data: { type: 'environments', attributes: data } };
    return this.http.patch<EnvironmentResponse>(
      `/environments/${environmentId}`,
      body,
    );
  }

  async delete(environmentId: string): Promise<void> {
    return this.http.delete(`/environments/${environmentId}`);
  }

  async list(
    params?: ListEnvironmentsParams,
  ): Promise<EnvironmentListResponse> {
    return this.http.get<EnvironmentListResponse>('/environments', params);
  }

  async generateToken(environmentId: string): Promise<TokenResponse> {
    return this.http.post<TokenResponse>(
      `/environments/${environmentId}/tokens`,
    );
  }
}
