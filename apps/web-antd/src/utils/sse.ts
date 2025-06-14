import { watch } from 'vue';

import { useAccessStore } from '@vben/stores';

import { useEventSource } from '@vueuse/core';
import { notification } from 'ant-design-vue';

// 初始化
export const initSSE = (url: any) => {
  if (import.meta.env.VITE_APP_SSE === 'false') {
    return;
  }

  const accessStore = useAccessStore();
  url = `${url}?Authorization=Bearer ${accessStore.accessToken}&clientid=${
    import.meta.env.VITE_APP_CLIENT_ID
  }`;
  const { data, error } = useEventSource(url, [], {
    autoReconnect: {
      retries: 10,
      delay: 3000,
      onFailed() {
        console.log('Failed to connect after 10 retries');
      },
    },
  });

  watch(error, () => {
    console.log('SSE connection error:', error.value);
    error.value = null;
  });

  watch(data, () => {
    if (!data.value) return;
    notification.success({
      message: '消息',
      description: data.value,
    });

    data.value = null;
  });
};
