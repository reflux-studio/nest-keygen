import { Injectable } from '@nestjs/common';
import { KeygenHttpService } from '../../common/keygen-http.service';
import {
  ComponentResponse,
  ComponentListResponse,
  AddComponentData,
  UpdateComponentData,
  ListComponentsParams,
} from './components.types';

@Injectable()
export class ComponentsService {
  constructor(private readonly http: KeygenHttpService) {}

  async add(data: AddComponentData): Promise<ComponentResponse> {
    const { machineId, ...attributes } = data;
    const body = {
      data: {
        type: 'components',
        attributes,
        relationships: {
          machine: { data: { type: 'machines', id: machineId } },
        },
      },
    };
    return this.http.post<ComponentResponse>('/components', body);
  }

  async retrieve(componentId: string): Promise<ComponentResponse> {
    return this.http.get<ComponentResponse>(`/components/${componentId}`);
  }

  async update(
    componentId: string,
    data: UpdateComponentData,
  ): Promise<ComponentResponse> {
    const body = { data: { type: 'components', attributes: data } };
    return this.http.patch<ComponentResponse>(
      `/components/${componentId}`,
      body,
    );
  }

  async remove(componentId: string): Promise<void> {
    return this.http.delete(`/components/${componentId}`);
  }

  async list(params?: ListComponentsParams): Promise<ComponentListResponse> {
    return this.http.get<ComponentListResponse>('/components', params);
  }
}
