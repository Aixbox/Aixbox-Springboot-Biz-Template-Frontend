<!-- eslint-disable unicorn/prefer-dom-node-append -->
<!-- eslint-disable unicorn/prefer-dom-node-dataset -->
<script lang="ts" setup>
import type { CascaderProps } from 'ant-design-vue';

import { ref } from 'vue';

import { Cascader } from 'ant-design-vue';

const options: CascaderProps['options'] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'freezeKey',
        label: 'freeze',
        children: [
          {
            value: 'key1',
            label: 'salmon',
          },
          {
            value: 'key2',
            label: 'beef',
          },
        ],
      },
      {
        value: 'fruitsKey',
        label: 'fruits',
        children: [
          {
            value: 'key11',
            label: 'apple',
          },
          {
            value: 'key22',
            label: 'banana',
          },
        ],
      },
    ],
  },
  {
    value: 'Chinese delicious food',
    label: '中国美食',
    children: [
      {
        value: 'key3',
        label: '月饼',
        children: [
          {
            value: 'key4',
            label: '蛋黄馅',
          },
          {
            value: 'key5',
            label: '五仁馅',
          },
        ],
      },
    ],
  },
];

const value = ref<string[]>([]);
</script>
<template>
  <Cascader
    v-model:value="value"
    :options="options"
    placeholder="Please select"
  />
</template>
