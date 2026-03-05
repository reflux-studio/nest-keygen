import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ForgotPasswordData } from './passwords.types';

@Injectable()
export class PasswordsService {
  constructor(private readonly httpService: HttpService) {}

  /** 请求密码重置，POST /passwords，Keygen 会发邮件或触发 webhook */
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    const body = { meta: data };
    await firstValueFrom(this.httpService.post('/passwords', body));
  }
}
