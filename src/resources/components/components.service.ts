import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ComponentResponse,
  ComponentListResponse,
  AddComponentData,
  UpdateComponentData,
  ListComponentsParams,
} from './components.types';

@Injectable()
export class ComponentsService {
  constructor(private readonly httpService: HttpService) {}

  /** 添加组件到机器，POST /components */
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
    const res = await firstValueFrom(
      this.httpService.post<ComponentResponse>('/components', body),
    );
    return res.data;
  }

  /** 获取组件详情 */
  async retrieve(componentId: string): Promise<ComponentResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ComponentResponse>(`/components/${componentId}`),
    );
    return res.data;
  }

  /** 更新组件属性 */
  async update(
    componentId: string,
    data: UpdateComponentData,
  ): Promise<ComponentResponse> {
    const body = { data: { type: 'components', attributes: data } };
    const res = await firstValueFrom(
      this.httpService.patch<ComponentResponse>(
        `/components/${componentId}`,
        body,
      ),
    );
    return res.data;
  }

  /** 永久删除组件 */
  async remove(componentId: string): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/components/${componentId}`));
  }

  /** 列出组件，支持 machine/license/product 过滤 */
  async list(params?: ListComponentsParams): Promise<ComponentListResponse> {
    const res = await firstValueFrom(
      this.httpService.get<ComponentListResponse>(
        '/components',
        params ? { params } : {},
      ),
    );
    return res.data;
  }
}
