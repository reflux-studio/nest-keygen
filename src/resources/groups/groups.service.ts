import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  GroupResponse,
  GroupListResponse,
  CreateGroupData,
  UpdateGroupData,
  ListGroupsParams,
} from './groups.types';

@Injectable()
export class GroupsService {
  constructor(private readonly http: KeygenHttpService) {}

  async create(data: CreateGroupData): Promise<GroupResponse> {
    const body = { data: { type: 'groups', attributes: data } };
    return this.http.post<GroupResponse>('/groups', body);
  }

  async retrieve(groupId: string): Promise<GroupResponse> {
    return this.http.get<GroupResponse>(`/groups/${groupId}`);
  }

  async update(groupId: string, data: UpdateGroupData): Promise<GroupResponse> {
    const body = { data: { type: 'groups', attributes: data } };
    return this.http.patch<GroupResponse>(`/groups/${groupId}`, body);
  }

  async delete(groupId: string): Promise<void> {
    return this.http.delete(`/groups/${groupId}`);
  }

  async list(params?: ListGroupsParams): Promise<GroupListResponse> {
    return this.http.get<GroupListResponse>('/groups', params);
  }
}
