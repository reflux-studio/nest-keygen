import { JsonApiResource, JsonApiSingleResponse } from '../../keygen.types';

/** 当前认证 bearer 的 profile，GET /me 返回 */
export type ProfileResponse = JsonApiSingleResponse<JsonApiResource>;
