import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ProcessResponse,
  ProcessListResponse,
  SpawnProcessData,
  UpdateProcessData,
  ListProcessesParams,
} from './processes.types';

@Injectable()
export class ProcessesService {
  constructor(private readonly httpService: HttpService) {}

  /** 创建 process，需定期 ping 否则会被自动清理 */
  async spawn(data: SpawnProcessData): Promise<ProcessResponse> {
    const { machineId, ...attributes } = data;
    const body = {
      data: {
        type: 'processes',
        attributes,
        relationships: {
          machine: { data: { type: 'machines', id: machineId } },
        },
      },
    };
    const res = await firstValueFrom(
      this.httpService.post<ProcessResponse>('/processes', body),
    );
    return res.data;
  }

  /** 获取 process 详情 */
  async retrieve(processId: string): Promise<ProcessResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ProcessResponse>(`/processes/${processId}`),
    );
    return res.data;
  }

  /** 更新 process（仅 metadata） */
  async update(
    processId: string,
    data: UpdateProcessData,
  ): Promise<ProcessResponse> {
    const body = { data: { type: 'processes', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<ProcessResponse>(`/processes/${processId}`, body),
    );
    return res.data;
  }

  /** 永久删除 process */
  async kill(processId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/processes/${processId}`));
  }

  /** 列出 processes，支持 machine/license/product/user 过滤 */
  async list(params?: ListProcessesParams): Promise<ProcessListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ProcessListResponse>(
        '/processes',
        params ? { params } : {},
      ),
    );
    return res.data;
  }

  /** 发送心跳，维持 process 存活 */
  async ping(processId: string): Promise<ProcessResponse> {
    const res = await firstValueFrom(
      this.httpService.post<ProcessResponse>(
        `/processes/${processId}/actions/ping`,
      ),
    );
    return res.data;
  }
}
