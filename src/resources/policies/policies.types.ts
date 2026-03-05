import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface PolicyAttributes {
  name: string;
  duration: number | null;
  strict: boolean;
  floating: boolean;
  maxMachines: number | null;
  maxUses: number | null;
  maxUsers: number | null;
  requireHeartbeat: boolean;
  requireCheckIn: boolean;
  expirationStrategy:
    | 'RESTRICT_ACCESS'
    | 'REVOKE_ACCESS'
    | 'MAINTAIN_ACCESS'
    | 'ALLOW_ACCESS';
  authenticationStrategy: 'TOKEN' | 'LICENSE' | 'MIXED' | 'NONE';
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface PolicyRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
  entitlements: JsonApiRelationship;
}

export type PolicyResource = JsonApiResource<
  PolicyAttributes,
  PolicyRelationships
>;
export type PolicyResponse = JsonApiSingleResponse<PolicyResource>;
export type PolicyListResponse = JsonApiListResponse<PolicyResource>;

export interface CreatePolicyData {
  name: string;
  productId: string;
  duration?: number | null;
  strict?: boolean;
  floating?: boolean;
  maxMachines?: number | null;
  maxUses?: number | null;
  maxUsers?: number | null;
  requireHeartbeat?: boolean;
  requireCheckIn?: boolean;
  expirationStrategy?:
    | 'RESTRICT_ACCESS'
    | 'REVOKE_ACCESS'
    | 'MAINTAIN_ACCESS'
    | 'ALLOW_ACCESS';
  authenticationStrategy?: 'TOKEN' | 'LICENSE' | 'MIXED' | 'NONE';
  metadata?: Record<string, any>;
}

export interface UpdatePolicyData {
  name?: string;
  duration?: number | null;
  strict?: boolean;
  floating?: boolean;
  maxMachines?: number | null;
  maxUses?: number | null;
  maxUsers?: number | null;
  requireHeartbeat?: boolean;
  requireCheckIn?: boolean;
  expirationStrategy?:
    | 'RESTRICT_ACCESS'
    | 'REVOKE_ACCESS'
    | 'MAINTAIN_ACCESS'
    | 'ALLOW_ACCESS';
  authenticationStrategy?: 'TOKEN' | 'LICENSE' | 'MIXED' | 'NONE';
  metadata?: Record<string, any>;
}

export type ListPoliciesParams = ListQueryParams;
