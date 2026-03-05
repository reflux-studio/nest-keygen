import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../interfaces/common.types';

export interface LicenseAttributes {
  key: string;
  name: string | null;
  expiry: string | null;
  status: string;
  uses: number;
  maxMachines: number | null;
  maxUses: number | null;
  maxUsers: number | null;
  requireCheckIn: boolean;
  requireHeartbeat: boolean;
  lastCheckIn: string | null;
  nextCheckIn: string | null;
  suspended: boolean;
  protected: boolean;
  permissions: string[];
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface LicenseRelationships {
  account: JsonApiRelationship;
  product: JsonApiRelationship;
  policy: JsonApiRelationship;
  user: JsonApiRelationship;
  group: JsonApiRelationship;
  entitlements: JsonApiRelationship;
  machines: JsonApiRelationship;
  tokens: JsonApiRelationship;
}

export type LicenseResource = JsonApiResource<
  LicenseAttributes,
  LicenseRelationships
>;
export type LicenseResponse = JsonApiSingleResponse<LicenseResource>;
export type LicenseListResponse = JsonApiListResponse<LicenseResource>;

export interface CreateLicenseData {
  policyId: string;
  userId?: string;
  groupId?: string;
  name?: string;
  key?: string;
  expiry?: string;
  maxMachines?: number;
  maxUses?: number;
  maxUsers?: number;
  metadata?: Record<string, any>;
}

export interface UpdateLicenseData {
  name?: string;
  expiry?: string | null;
  maxMachines?: number | null;
  maxUses?: number | null;
  maxUsers?: number | null;
  requireCheckIn?: boolean;
  requireHeartbeat?: boolean;
  protected?: boolean;
  metadata?: Record<string, any>;
}

export interface LicenseValidationScope {
  fingerprint?: string;
  fingerprints?: string[];
  components?: string[];
  user?: string;
  entitlements?: string[];
  product?: string;
  policy?: string;
}

export interface ValidateLicenseMeta {
  scope?: LicenseValidationScope;
}

export interface ValidateKeyMeta {
  key: string;
  scope?: LicenseValidationScope;
  nonce?: string;
}

export interface LicenseValidationAttributes {
  valid: boolean;
  detail: string;
  code: string;
  constant: string;
}

export type LicenseValidationResponse =
  JsonApiSingleResponse<LicenseResource> & {
    meta: LicenseValidationAttributes;
  };

export interface CheckOutLicenseParams {
  encrypt?: boolean;
  ttl?: number;
  include?: string[];
}

export interface AttachEntitlementsData {
  entitlementIds: string[];
}

export interface DetachEntitlementsData {
  entitlementIds: string[];
}

export interface ListLicensesParams extends ListQueryParams {
  product?: string;
  policy?: string;
  user?: string;
  group?: string;
  status?: string;
}
