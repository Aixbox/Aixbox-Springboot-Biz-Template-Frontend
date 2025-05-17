<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed } from 'vue';

import { useAccess } from '@vben/access';
import { Fallback, Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { columns, querySchema } from './data';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      // query: async (_, formValues = {}) => {
      //   const resp = await menuList({
      //     ...formValues,
      //   });
      //   return { rows: resp };
      // },
    },
  },
  rowConfig: {
    keyField: 'menuId',
  },
  /**
   * 开启虚拟滚动
   * 数据量小可以选择关闭
   * 如果遇到样式问题(空白、错位 滚动等)可以选择关闭虚拟滚动
   */
  scrollY: {
    enabled: true,
    gt: 0,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'menuId',
    // 自动转换为tree 由vxe处理 无需手动转换
    transform: true,
  },
  id: 'system-menu-index',
};

const [BasicTable] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    // cellDblclick: (e) => {
    //   const { row = {} } = e;
    //   if (!row?.children) {
    //     return;
    //   }
    //   const isExpanded = row?.expand;
    //   tableApi.grid.setTreeExpand(row, !isExpanded);
    //   row.expand = !isExpanded;
    // },
    // 需要监听使用箭头展开的情况 否则展开/折叠的数据不一致
    // toggleTreeExpand: (e) => {
    //   const { row = {}, expanded } = e;
    //   row.expand = expanded;
    // },
  },
});

/**
 * 与后台逻辑相同
 * 只有超级管理能访问菜单管理
 */
const { hasAccessByRoles } = useAccess();
const isAdmin = computed(() => {
  return hasAccessByRoles(['superadmin']);
});
</script>

<template>
  <Page v-if="isAdmin" :auto-content-height="true">
    <BasicTable />
  </Page>
  <Fallback v-else description="您没有菜单管理的访问权限" status="403" />
</template>
