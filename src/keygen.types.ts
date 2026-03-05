/** Keygen 客户端配置，支持 License 或 Token 认证 */
export interface KeygenOptions {
  /** 账户 ID */
  account: string;
  /** API Token（Bearer/Token 认证） */
  token?: string;
  /** License Key（License 认证，用于客户端激活等） */
  licenseKey?: string;
  /** 环境代码，如 sandbox */
  environment?: string;
  /** API 版本，如 1.1，通过 Keygen-Version header 覆盖 */
  apiVersion?: string;
  /** API 基础 URL，默认 https://api.keygen.sh */
  baseUrl?: string;
  /** 是否注册为 Nest 全局模块 */
  isGlobal?: boolean;
}

/** JSON:API 关系数据 */
export interface JsonApiRelationshipData {
  type: string;
  id: string;
}

/** JSON:API 关系定义 */
export interface JsonApiRelationship {
  data: JsonApiRelationshipData | JsonApiRelationshipData[] | null;
  links?: { related?: string; self?: string };
}

/** JSON:API 资源结构，Keygen API 基于 JSON:API 规范 */
export interface JsonApiResource<
  TAttributes extends Record<string, any> = Record<string, any>,
  TRelationships = Record<string, JsonApiRelationship>,
> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: TRelationships;
  links?: Record<string, string>;
  meta?: Record<string, any>;
}

/** JSON:API 单资源响应 */
export interface JsonApiSingleResponse<T = JsonApiResource> {
  data: T;
  included?: JsonApiResource[];
  meta?: Record<string, any>;
  links?: Record<string, string>;
}

/** JSON:API 列表响应 */
export interface JsonApiListResponse<T = JsonApiResource> {
  data: T[];
  included?: JsonApiResource[];
  meta?: Record<string, any>;
  links?: Record<string, string>;
}

/** 错误项，包含 title/detail/code/source */
export interface JsonApiError {
  title: string;
  detail: string;
  code: string;
  source?: { pointer?: string; parameter?: string };
}

/** 错误响应，4xx/5xx 时返回 errors 数组 */
export interface JsonApiErrorResponse {
  errors: JsonApiError[];
}

/** 分页参数，page[size] 1-100，page[number] 从 1 开始 */
export interface PageParams {
  size?: number;
  number?: number;
}

/** 列表查询参数，支持 limit 和 page 分页 */
export interface ListQueryParams {
  limit?: number;
  page?: PageParams;
  [key: string]: any;
}
