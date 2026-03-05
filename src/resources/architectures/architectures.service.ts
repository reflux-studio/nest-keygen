import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  ArchResponse,
  ArchListResponse,
  ListArchesParams,
} from './architectures.types';

@Injectable()
export class ArchitecturesService {
  constructor(private readonly http: KeygenHttpService) {}

  async retrieve(archId: string): Promise<ArchResponse> {
    return this.http.get<ArchResponse>(`/arches/${archId}`);
  }

  async list(params?: ListArchesParams): Promise<ArchListResponse> {
    return this.http.get<ArchListResponse>('/arches', params);
  }
}
