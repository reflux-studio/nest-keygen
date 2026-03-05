import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  UserResponse,
  UserListResponse,
  CreateUserData,
  UpdateUserData,
  UpdatePasswordData,
  ListUsersParams,
} from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建用户，anon 可自注册（若账户未 protected） */
  async create(data: CreateUserData): Promise<UserResponse> {
    const { groupId, ...attributes } = data;
    const body = {
      data: {
        type: 'users',
        attributes,
        ...(groupId
          ? {
              relationships: {
                group: { data: { type: 'groups', id: groupId } },
              },
            }
          : {}),
      },
    };
    const res = await firstValueFrom(
      this.httpService.post<UserResponse>('/users', body),
    );
    return res.data;
  }

  /** 获取用户详情 */
  async retrieve(userId: string): Promise<UserResponse> {
    const res = await firstValueFrom(
      this.httpService.get<UserResponse>(`/users/${userId}`),
    );
    return res.data;
  }

  /** 更新用户 */
  async update(userId: string, data: UpdateUserData): Promise<UserResponse> {
    const body = { data: { type: 'users', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<UserResponse>(`/users/${userId}`, body),
    );
    return res.data;
  }

  /** 永久删除用户 */
  async delete(userId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/users/${userId}`));
  }

  /** 列出用户，支持 product/group/status 过滤 */
  async list(params?: ListUsersParams): Promise<UserListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<UserListResponse>(
        '/users',
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 更新用户密码 */
  async updatePassword(
    userId: string,
    data: UpdatePasswordData,
  ): Promise<void> {
    const body = { data: { type: 'users', attributes: data } };
    await firstValueFrom(
      this.httpService.put(`/users/${userId}/password`, body),
    );
  }

  /** 封禁用户 */
  async ban(userId: string): Promise<UserResponse> {
    const res = await firstValueFrom(
      this.httpService.post<UserResponse>(`/users/${userId}/actions/ban`),
    );
    return res.data;
  }

  /** 解封用户 */
  async unban(userId: string): Promise<UserResponse> {
    const res = await firstValueFrom(
      this.httpService.post<UserResponse>(`/users/${userId}/actions/unban`),
    );
    return res.data;
  }

  /** 更换用户所属组 */
  async changeGroup(userId: string, groupId: string | null): Promise<void> {
    const body = { data: groupId ? { type: 'groups', id: groupId } : null };
    await firstValueFrom(this.httpService.put(`/users/${userId}/group`, body));
  }
}
