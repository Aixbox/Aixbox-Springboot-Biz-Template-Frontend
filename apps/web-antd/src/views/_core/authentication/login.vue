<script lang="ts" setup>
import type {
  CaptchaPoint,
  LoginAndRegisterParams,
  VbenFormSchema,
} from '@vben/common-ui';

import { computed, ref } from 'vue';

import { AuthenticationLogin, PointSelectionCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { CaptchaApi, checkCaptcha, getCaptcha } from '#/api';
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

const submit = async (
  params: LoginAndRegisterParams,
  onSuccess?: () => Promise<void> | void,
) => {
  const captcha = await getCaptcha();

  backgroundImage.value = captcha.captcha.backgroundImage;
  templateImage.value = captcha.captcha.templateImage;
  captchaId.value = captcha.id;
  loginParams.value = params;
  loginOnSuccess.value = onSuccess;
  // new Date().getTime() - startTime.getTime()
  showCaptcha.value = true;
};

const clickCount = ref(0);
const backgroundImage = ref('');
const templateImage = ref('');
const showCaptcha = ref(false);
const startTime = ref<Date>(new Date());
const trackList = ref<CaptchaApi.Track[]>([]);
const captchaId = ref<string | undefined>(undefined);
const loginParams = ref<LoginAndRegisterParams>({
  username: '',
  password: '',
  grantType: 'password',
});
const loginOnSuccess = ref<() => Promise<void> | void>();

const handleClick = (point: CaptchaPoint) => {
  clickCount.value++;
  if (clickCount.value === 1) {
    startTime.value = new Date();
  }
  trackList.value.push({
    x: point.x,
    y: point.y,
    t: Date.now() - startTime.value.getTime(),
    type: 'click',
  });
};

const handleConfirm = async (points: CaptchaPoint[], clear: () => void) => {
  const checkResponse = await checkCaptcha({
    data: {
      bgImageWidth: 300,
      bgImageHeight: 180,
      startTime: startTime.value,
      stopTime: new Date(),
      trackList: trackList.value,
    },
    id: captchaId.value,
  });
  clear();

  if (checkResponse.id) {
    // console.log(`验证成功: token`, res);
    // 携带token调用登录接口
    loginParams.value.uuid = checkResponse.id;
    authStore.authLogin(loginParams.value, loginOnSuccess.value);
  } else {
    handleRefresh();
  }
};

const handleRefresh = async () => {
  const captcha = await getCaptcha();

  backgroundImage.value = captcha.captcha.backgroundImage;
  templateImage.value = captcha.captcha.templateImage;
  captchaId.value = captcha.id;
  clickCount.value = 0;
};
</script>

<template>
  <div>
    <AuthenticationLogin
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      @submit="submit"
    />

    <Teleport to="body">
      <div
        v-if="showCaptcha"
        class="bg-overlay fixed inset-0 z-50 flex items-center justify-center"
        @click="showCaptcha = false"
      >
        <PointSelectionCaptcha
          :captcha-image="backgroundImage"
          height="180"
          :hint-image="templateImage"
          padding-x="12"
          padding-y="16"
          :show-confirm="true"
          :width="300"
          @click="handleClick"
          @confirm="handleConfirm"
          @refresh="handleRefresh"
        >
          <template #title>
            {{ $t('examples.captcha.captchaCardTitle') }}
          </template>
        </PointSelectionCaptcha>
      </div>
    </Teleport>
  </div>
</template>
