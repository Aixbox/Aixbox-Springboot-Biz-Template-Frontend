<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { testAdd, testInfo, testUpdate } from '#/api/demo/test';
import { defaultFormValueGetter, useBeforeCloseDiff } from '#/utils/popup';

import { drawerSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  arrayToStringFields: ['checkboxType'],
  commonConfig: {
    formItemClass: 'col-span-2',
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
});

function setupForm(update: boolean) {
  formApi.updateSchema([
    {
      dependencies: {
        show: () => update,
        triggerFields: [''],
      },
      fieldName: 'clientId',
    },
    {
      componentProps: {
        disabled: update,
      },
      fieldName: 'clientKey',
    },
    {
      componentProps: {
        disabled: update,
      },
      fieldName: 'clientSecret',
    },
  ]);
}

const { onBeforeClose, markInitialized, resetInitialized } = useBeforeCloseDiff(
  {
    initializedGetter: defaultFormValueGetter(formApi),
    currentGetter: defaultFormValueGetter(formApi),
  },
);

// 提取生成状态字段Schema的函数
const getStatusSchema = (disabled: boolean) => [
  {
    componentProps: { disabled },
    fieldName: 'status',
  },
];

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onBeforeClose,
  onClosed: handleClosed,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const { id } = drawerApi.getData() as { id?: number | string };
    isUpdate.value = !!id;
    // 初始化
    setupForm(isUpdate.value);
    if (isUpdate.value && id) {
      const record = await testInfo(id);
      // 不能禁用id为1的记录
      formApi.updateSchema(getStatusSchema(record.id === 1));
      await formApi.setValues(record);
    } else {
      // 新增模式: 确保状态字段可用
      formApi.updateSchema(getStatusSchema(false));
    }
    await markInitialized();

    drawerApi.drawerLoading(false);
  },
});

async function handleConfirm() {
  try {
    drawerApi.lock(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = cloneDeep(await formApi.submitForm());
    await (isUpdate.value ? testUpdate(data) : testAdd(data));
    resetInitialized();
    emit('reload');
    drawerApi.close();
  } catch (error) {
    console.error(error);
  } finally {
    drawerApi.lock(false);
  }
}

async function handleClosed() {
  await formApi.resetForm();
  resetInitialized();
}
</script>

<template>
  <BasicDrawer :title="title" class="w-[600px]">
    <BasicForm />
  </BasicDrawer>
</template>
