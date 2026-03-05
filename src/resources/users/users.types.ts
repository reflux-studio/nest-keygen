import {
  JsonApiRelationship,
  JsonApiResource,
  JsonApiSingleResponse,
  JsonApiListResponse,
  ListQueryParams,
} from '../../keygen.types';

/** User 属性 */
export interface UserAttributes {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  username: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  role: string;
  protected: boolean;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export interface UserRelationships {
  account: JsonApiRelationship;
  group: JsonApiRelationship;
  products: JsonApiRelationship;
  licenses: JsonApiRelationship;
  machines: JsonApiRelationship;
  tokens: JsonApiRelationship;
}

export type UserResource = JsonApiResource<UserAttributes, UserRelationships>;
export type UserResponse = JsonApiSingleResponse<UserResource>;
export type UserListResponse = JsonApiListResponse<UserResource>;

export interface CreateUserData {
  firstName?: string;
  lastName?: string;
  email: string;
  username?: string;
  password?: string;
  role?: 'user' | 'admin';
  protected?: boolean;
  metadata?: Record<string, any>;
  groupId?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  protected?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ListUsersParams extends ListQueryParams {
  product?: string;
  group?: string;
  status?: string;
}
