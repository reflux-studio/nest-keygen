import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  GroupResponse,
  GroupListResponse,
  CreateGroupData,
  UpdateGroupData,
  ListGroupsParams,
} from './groups.types';

@Injectable()
export class GroupsService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建组，POST /groups */
  async create(data: CreateGroupData): Promise<GroupResponse> {
    const body = { data: { type: 'groups', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.post<GroupResponse>('/groups', body),
    );
    return res.data;
  }

  /** 获取组详情 */
  async retrieve(groupId: string): Promise<GroupResponse> {
    const res = await firstValueFrom(
      this.httpService.get<GroupResponse>(`/groups/${groupId}`),
    );
    return res.data;
  }

  /** 更新组 */
  async update(groupId: string, data: UpdateGroupData): Promise<GroupResponse> {
    const body = { data: { type: 'groups', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<GroupResponse>(`/groups/${groupId}`, body),
    );
    return res.data;
  }

  /** 永久删除组 */
  async delete(groupId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/groups/${groupId}`));
  }

  /** 列出组，按创建时间倒序 */
  async list(params?: ListGroupsParams): Promise<GroupListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<GroupListResponse>('/groups', { params }),
    );
    return res.data;
  }
}
