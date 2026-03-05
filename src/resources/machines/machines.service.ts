import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
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
  constructor(private readonly http: KeygenHttpService) {}

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
    return this.http.post<MachineResponse>('/machines', body);
  }

  async retrieve(machineId: string): Promise<MachineResponse> {
    return this.http.get<MachineResponse>(`/machines/${machineId}`);
  }

  async update(
    machineId: string,
    data: UpdateMachineData,
  ): Promise<MachineResponse> {
    const body = { data: { type: 'machines', attributes: data } };
    return this.http.patch<MachineResponse>(`/machines/${machineId}`, body);
  }

  async deactivate(machineId: string): Promise<void> {
    return this.http.delete(`/machines/${machineId}`);
  }

  async list(params?: ListMachinesParams): Promise<MachineListResponse> {
    return this.http.get<MachineListResponse>('/machines', params);
  }

  async checkOut(
    machineId: string,
    params?: CheckOutMachineParams,
  ): Promise<any> {
    return this.http.post<any>(
      `/machines/${machineId}/actions/check-out`,
      params,
    );
  }

  async ping(machineId: string): Promise<MachineResponse> {
    return this.http.post<MachineResponse>(
      `/machines/${machineId}/actions/ping`,
    );
  }

  async reset(machineId: string): Promise<MachineResponse> {
    return this.http.post<MachineResponse>(
      `/machines/${machineId}/actions/reset`,
    );
  }

  async changeOwner(machineId: string, userId: string): Promise<void> {
    const body = { data: { type: 'users', id: userId } };
    return this.http.put(`/machines/${machineId}/owner`, body);
  }

  async changeGroup(machineId: string, groupId: string | null): Promise<void> {
    const body = { data: groupId ? { type: 'groups', id: groupId } : null };
    return this.http.put(`/machines/${machineId}/group`, body);
  }
}
