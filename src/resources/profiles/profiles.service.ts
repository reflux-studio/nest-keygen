import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import { ProfileResponse } from './profiles.types';

@Injectable()
export class ProfilesService {
  constructor(private readonly http: KeygenHttpService) {}

  async me(): Promise<ProfileResponse> {
    return this.http.get<ProfileResponse>('/me');
  }
}
