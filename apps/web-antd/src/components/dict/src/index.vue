<!-- eslint-disable eqeqeq -->
<script setup lang="ts">
import type { DictData } from '#/api/system/dict/dict-data-model';

import { computed } from 'vue';

import { Spin, Tag } from 'ant-design-vue';

import { tagTypes } from './data';

interface Props {
  dicts: DictData[]; // dict数组
  value: boolean | number | string; // value
}

const props = withDefaults(defineProps<Props>(), {
  dicts: undefined,
});

const color = computed<string>(() => {
  const current = props.dicts.find((item) => {
    if (item.value || item.value == false) {
      return item.value == props.value;
    }
    return item.dictValue == props.value;
  });
  const listClass = current?.listClass ?? '';
  // 是否为默认的颜色
  const isDefault = Reflect.has(tagTypes, listClass);
  // 判断是默认还是自定义颜色
  if (isDefault) {
    // 这里做了antd - element-plus的兼容
    return tagTypes[listClass]!.color;
  }
  return listClass;
});

const cssClass = computed<string>(() => {
  const current = props.dicts.find((item) => {
    if (item.value || item.value == false) {
      return item.value == props.value;
    }
    return item.dictValue == props.value;
  });
  return current?.cssClass ?? '';
});

const label = computed<number | string>(() => {
  const current = props.dicts.find((item) => {
    if (item.value || item.value == false) {
      return item.value == props.value;
    }
    return item.dictValue == props.value;
  });
  return current?.dictLabel ?? 'unknown';
});

const tagComponent = computed(() => (color.value ? Tag : 'div'));

const loading = computed(() => {
  return props.dicts?.length === 0;
});
</script>

<template>
  <div>
    <component
      v-if="!loading"
      :is="tagComponent"
      :class="cssClass"
      :color="color"
    >
      {{ label }}
    </component>
    <Spin v-else :spinning="true" size="small" />
  </div>
</template>
