import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  ProcessResponse,
  ProcessListResponse,
  SpawnProcessData,
  UpdateProcessData,
  ListProcessesParams,
} from './processes.types';

@Injectable()
export class ProcessesService {
  constructor(private readonly http: KeygenHttpService) {}

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
    return this.http.post<ProcessResponse>('/processes', body);
  }

  async retrieve(processId: string): Promise<ProcessResponse> {
    return this.http.get<ProcessResponse>(`/processes/${processId}`);
  }

  async update(
    processId: string,
    data: UpdateProcessData,
  ): Promise<ProcessResponse> {
    const body = { data: { type: 'processes', attributes: data } };
    return this.http.patch<ProcessResponse>(`/processes/${processId}`, body);
  }

  async kill(processId: string): Promise<void> {
    return this.http.delete(`/processes/${processId}`);
  }

  async list(params?: ListProcessesParams): Promise<ProcessListResponse> {
    return this.http.get<ProcessListResponse>('/processes', params);
  }

  async ping(processId: string): Promise<ProcessResponse> {
    return this.http.post<ProcessResponse>(
      `/processes/${processId}/actions/ping`,
    );
  }
}
