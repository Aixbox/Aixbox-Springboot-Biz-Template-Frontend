import { baseRequestClient, requestClient } from '#/api/request';

// TODO 使用动态获取配置
const clientId = 'e5cd7e4891bf95d1d19206ce24a7b32e';

/**
 * 登录类型
 * password 密码
 * sms 短信
 * social 第三方oauth
 * email 邮箱
 * xcx 小程序
 */
type GrantType = 'email' | 'password' | 'sms' | 'social' | 'xcx';

export namespace AuthApi {
  /**
   * @description: 所有登录类型都需要用到的
   * @param clientId 客户端ID 这里为必填项 但是在loginApi内部处理了 所以为可选
   * @param grantType 授权/登录类型
   */
  export interface BaseLoginParams {
    clientId?: string;
    grantType: GrantType;
  }

  /** 登录接口参数 */
  export interface LoginParams extends BaseLoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/system/auth/login', {
    ...data,
    clientId,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
