/** 忘记密码请求，deliver=false 时由 webhook 处理 */
export interface ForgotPasswordData {
  email: string;
  deliver?: boolean;
}
