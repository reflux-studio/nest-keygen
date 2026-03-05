import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface ArtifactAttributes {
  filename: string;
  filetype: string | null;
  filesize: number | null;
  platform: string | null;
  arch: string | null;
  signature: string | null;
  checksum: string | null;
  status: 'WAITING' | 'UPLOADED' | 'FAILED' | 'YANKED';
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface ArtifactRelationships {
  account: JsonApiRelationship;
  release: JsonApiRelationship;
  environment: JsonApiRelationship;
}

export type ArtifactResource = JsonApiResource<
  ArtifactAttributes,
  ArtifactRelationships
>;
export type ArtifactResponse = JsonApiSingleResponse<ArtifactResource>;
export type ArtifactListResponse = JsonApiListResponse<ArtifactResource>;

export interface UploadArtifactData {
  filename: string;
  releaseId: string;
  filetype?: string;
  filesize?: number;
  platform?: string;
  arch?: string;
  signature?: string;
  checksum?: string;
  metadata?: Record<string, any>;
}

export interface UpdateArtifactData {
  signature?: string;
  checksum?: string;
  metadata?: Record<string, any>;
}

export interface ListArtifactsParams extends ListQueryParams {
  release?: string;
  product?: string;
  platform?: string;
  arch?: string;
  status?: string;
}
