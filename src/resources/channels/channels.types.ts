import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** 渠道属性，由 releases/artifacts 自动填充，只读，如 stable/beta */
export interface ChannelAttributes {
  name: string;
  key: string;
  created: string;
  updated: string;
}

export interface ChannelRelationships {
  account: JsonApiRelationship;
}

export type ChannelResource = JsonApiResource<
  ChannelAttributes,
  ChannelRelationships
>;
export type ChannelResponse = JsonApiSingleResponse<ChannelResource>;
export type ChannelListResponse = JsonApiListResponse<ChannelResource>;

export type ListChannelsParams = ListQueryParams;
