<script lang="ts" setup>
import type { LoginAndRegisterParams, VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});

const submit = (
  params: LoginAndRegisterParams,
  onSuccess?: () => Promise<void> | void,
) => {
  const baseURL = import.meta.env.VITE_GLOB_API_URL;
  const captchaConfig = {
    // 请求验证码接口
    requestCaptchaDataUrl: `${baseURL}/auth/captcha`,
    // 验证验证码接口
    validCaptchaUrl: `${baseURL}/auth/captcha/verify`,
    // 绑定的div
    bindEl: '#captcha-box',
    // 验证成功回调函数
    validSuccess: (res: any, c: any, t: any) => {
      // 验证码验证成功回调...
      // 销毁验证码
      t.destroyWindow();

      // console.log(`验证成功: token`, res);
      // 携带token调用登录接口
      params.uuid = res.data.id;
      authStore.authLogin(params, onSuccess);
    },
  };

  const style = {
    // 按钮样式
    btnUrl: 'https://minio.tianai.cloud/public/captcha-btn/btn3.png',
    // 背景样式
    // bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
    bgUrl:
      'https://img1.baidu.com/it/u=1669573393,120316417&fm=253&fmt=auto&app=120&f=JPEG',
    // logo地址
    logoUrl: ' ',
    // 滑动边框样式
    moveTrackMaskBgColor: '#f7b645',
    moveTrackMaskBorderColor: '#ef9c0d',
  };

  window.initTAC('/static/tac', captchaConfig, style).then((tac) => {
    tac.init();
  });
};
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="submit"
  />
  <div
    id="captcha-box"
    class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform"
  ></div>
</template>
