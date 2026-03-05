import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

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
