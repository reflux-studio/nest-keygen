import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import { ForgotPasswordData } from './passwords.types';

@Injectable()
export class PasswordsService {
  constructor(private readonly http: KeygenHttpService) {}

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    const body = { meta: data };
    return this.http.post('/passwords', body);
  }
}
