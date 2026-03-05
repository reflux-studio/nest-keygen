import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  MachineResponse,
  MachineListResponse,
  ActivateMachineData,
  UpdateMachineData,
  CheckOutMachineParams,
  ListMachinesParams,
} from './machines.types';

@Injectable()
export class MachinesService {
  constructor(private readonly httpService: HttpService) {}

  /** 激活机器，POST /machines，需关联 license */
  async activate(data: ActivateMachineData): Promise<MachineResponse> {
    const { licenseId, ownerId, groupId, ...attributes } = data;
    const relationships: Record<
      string,
      { data: { type: string; id: string } | null }
    > = {
      license: { data: { type: 'licenses', id: licenseId } },
    };
    if (ownerId)
      relationships['owner'] = { data: { type: 'users', id: ownerId } };
    if (groupId)
      relationships['group'] = { data: { type: 'groups', id: groupId } };

    const body = { data: { type: 'machines', attributes, relationships } };
    const res = await firstValueFrom(
      this.httpService.post<MachineResponse>('/machines', body),
    );
    return res.data;
  }

  /** 获取机器详情 */
  async retrieve(machineId: string): Promise<MachineResponse> {
    const res = await firstValueFrom(
      this.httpService.get<MachineResponse>(`/machines/${machineId}`),
    );
    return res.data;
  }

  /** 更新机器属性 */
  async update(
    machineId: string,
    data: UpdateMachineData,
  ): Promise<MachineResponse> {
    const body = { data: { type: 'machines', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<MachineResponse>(`/machines/${machineId}`, body),
    );
    return res.data;
  }

  /** 停用机器，永久删除 */
  async deactivate(machineId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/machines/${machineId}`));
  }

  /** 列出机器，支持 license/product/user/group/fingerprint 过滤 */
  async list(params?: ListMachinesParams): Promise<MachineListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<MachineListResponse>(
        '/machines',
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 签出离线机器文件证书 */
  async checkOut(
    machineId: string,
    params?: CheckOutMachineParams,
  ): Promise<any> {
    const res = await firstValueFrom(
      this.httpService.post<any>(
        `/machines/${machineId}/actions/check-out`,
        params,
      ),
    );
    return res.data;
  }

  /** 发送心跳，维持 lease */
  async ping(machineId: string): Promise<MachineResponse> {
    const res = await firstValueFrom(
      this.httpService.post<MachineResponse>(
        `/machines/${machineId}/actions/ping`,
      ),
    );
    return res.data;
  }

  /** 重置心跳监控，不停止机器 */
  async reset(machineId: string): Promise<MachineResponse> {
    const res = await firstValueFrom(
      this.httpService.post<MachineResponse>(
        `/machines/${machineId}/actions/reset`,
      ),
    );
    return res.data;
  }

  /** 更换机器所属用户 */
  async changeOwner(machineId: string, userId: string): Promise<void> {
    const body = { data: { type: 'users', id: userId } };
    await firstValueFrom(
      this.httpService.put(`/machines/${machineId}/owner`, body),
    );
  }

  /** 更换机器的组 */
  async changeGroup(machineId: string, groupId: string | null): Promise<void> {
    const body = { data: groupId ? { type: 'groups', id: groupId } : null };
    await firstValueFrom(
      this.httpService.put(`/machines/${machineId}/group`, body),
    );
  }
}
