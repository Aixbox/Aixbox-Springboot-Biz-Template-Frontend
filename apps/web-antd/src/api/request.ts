/**
 * 该文件可自行根据业务逻辑进行调整
 */

import type { HttpResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
  stringify,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message, Modal } from 'ant-design-vue';
import { isEmpty, isNull } from 'lodash-es';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

// TODO 使用动态获取配置
const clientId = 'e5cd7e4891bf95d1d19206ce24a7b32e';

/**
 * 是否已经处在登出过程中了 一个标志位
 * 主要是防止一个页面会请求多个api 都401 会导致登出执行多次
 */
let isLogoutProcessing = false;

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    // 后端地址
    baseURL,
    // 消息提示类型
    errorMessageMode: 'message',
    // 是否返回原生响应 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();
      // 添加token
      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers.ClientID = clientId;

      /**
       * 格式化get/delete参数
       * 如果包含自定义的paramsSerializer则不走此逻辑
       */
      if (
        ['DELETE', 'GET'].includes(config.method?.toUpperCase() || '') &&
        config.params &&
        !config.paramsSerializer
      ) {
        /**
         * 1. 格式化参数 微服务在传递区间时间选择(后端的params Map类型参数)需要格式化key 否则接收不到
         * 2. 数组参数需要格式化 后端才能正常接收 会变成arr=1&arr=2&arr=3的格式来接收
         */
        config.paramsSerializer = (params) =>
          stringify(params, { arrayFormat: 'repeat' });
      }

      return config;
    },
  });

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 0,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.error ?? responseData?.message ?? '';
      // 如果没有错误信息，则会根据状态码进行提示
      message.error(errorMessage || msg);
    }),
  );

  client.addResponseInterceptor<HttpResponse>({
    fulfilled: async (response) => {
      const { isReturnNativeResponse, isTransformResponse } = response.config;
      // 是否返回原生响应 比如：需要获取响应时使用该属性
      if (isReturnNativeResponse) {
        return response;
      }
      // 不进行任何处理，直接返回
      // 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (!isTransformResponse) {
        /**
         * 需要判断下载二进制的情况 正常是返回二进制 报错会返回json
         * 当type为blob且content-type为application/json时 则判断已经下载出错
         */
        if (
          response.config.responseType === 'blob' &&
          response.headers['content-type']?.includes?.('application/json')
        ) {
          // 这时候的data为blob类型
          const blob = response.data as unknown as Blob;
          // 拿到字符串转json对象
          response.data = JSON.parse(await blob.text());
          // 然后按正常逻辑执行下面的代码(判断业务状态码)
        } else {
          // 其他情况 直接返回
          return response.data;
        }
      }

      const axiosResponseData = response.data;
      if (!axiosResponseData) {
        throw new Error($t('http.apiRequestFailed'));
      }

      // 后端并没有采用严格的{code, msg, data}模式
      const { code, data, msg, ...other } = axiosResponseData;

      // 业务状态码为0则请求成功
      const hasSuccess = Reflect.has(axiosResponseData, 'code') && code === 0;

      if (hasSuccess) {
        let successMsg = msg;

        if (isNull(successMsg) || isEmpty(successMsg)) {
          successMsg = $t(`http.operationSuccess`);
        }

        if (response.config.successMessageMode === 'modal') {
          Modal.success({
            content: successMsg,
            title: $t('http.successTip'),
          });
        } else if (response.config.successMessageMode === 'message') {
          message.success(successMsg);
        }
        // 分页情况下为code msg rows total 并没有data字段
        // 如果有data 直接返回data 没有data将剩余参数(...other)封装为data返回
        // 需要考虑data为null的情况(比如查询为空) 所以这里直接判断undefined
        if (data !== undefined) {
          return data;
        }
        // 没有data 将其他参数包装为data
        return other;
      }

      // 在此处根据自己项目的实际情况对不同的code执行不同的操作
      // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
      let timeoutMsg = '';
      switch (code) {
        case 401: {
          // 已经在登出过程中 不再执行
          if (isLogoutProcessing) {
            throw new Error(timeoutMsg);
          }
          isLogoutProcessing = true;
          const _msg = $t('http.loginTimeout');
          const userStore = useAuthStore();
          userStore.logout().finally(() => {
            message.error(_msg);
            isLogoutProcessing = false;
          });
          // 不再执行下面逻辑
          throw new Error(_msg);
        }
        default: {
          if (msg) {
            timeoutMsg = msg;
          }
        }
      }

      // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
      // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
      if (response.config.errorMessageMode === 'modal') {
        Modal.error({
          content: timeoutMsg,
          title: $t('http.errorTip'),
        });
      } else if (response.config.errorMessageMode === 'message') {
        message.error(timeoutMsg);
      }

      throw new Error(timeoutMsg || $t('http.apiRequestFailed'));
    },
  });

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
