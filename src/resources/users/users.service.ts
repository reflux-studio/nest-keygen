import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
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
  constructor(private readonly http: KeygenHttpService) {}

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
    return this.http.post<UserResponse>('/users', body);
  }

  async retrieve(userId: string): Promise<UserResponse> {
    return this.http.get<UserResponse>(`/users/${userId}`);
  }

  async update(userId: string, data: UpdateUserData): Promise<UserResponse> {
    const body = { data: { type: 'users', attributes: data } };
    return this.http.patch<UserResponse>(`/users/${userId}`, body);
  }

  async delete(userId: string): Promise<void> {
    return this.http.delete(`/users/${userId}`);
  }

  async list(params?: ListUsersParams): Promise<UserListResponse> {
    return this.http.get<UserListResponse>('/users', params);
  }

  async updatePassword(
    userId: string,
    data: UpdatePasswordData,
  ): Promise<void> {
    const body = { data: { type: 'users', attributes: data } };
    return this.http.put(`/users/${userId}/password`, body);
  }

  async ban(userId: string): Promise<UserResponse> {
    return this.http.post<UserResponse>(`/users/${userId}/actions/ban`);
  }

  async unban(userId: string): Promise<UserResponse> {
    return this.http.post<UserResponse>(`/users/${userId}/actions/unban`);
  }

  async changeGroup(userId: string, groupId: string | null): Promise<void> {
    const body = { data: groupId ? { type: 'groups', id: groupId } : null };
    return this.http.put(`/users/${userId}/group`, body);
  }
}
