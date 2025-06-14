<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DemoTest } from '#/api/demo/test/model';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { getVxePopupContainer } from '@vben/utils';

import { Image, Modal, Popconfirm, Space, Spin } from 'ant-design-vue';

import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
import { testExport, testList, testRemove } from '#/api/demo/test';
import { commonDownloadExcel } from '#/utils/file/download';

import { columns, fallbackImageBase64, querySchema } from './data';
import testDrawer from './test-drawer.vue';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  // 日期选择格式化
  fieldMappingTime: [],
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await testList({
          pageNo: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  id: 'demo-test-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [TestDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: testDrawer,
});

function handleAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

async function handleEdit(record: DemoTest) {
  drawerApi.setData({ id: record.id });
  drawerApi.open();
}

async function handleDelete(row: DemoTest) {
  await testRemove([row.id]);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: DemoTest) => row.id);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await testRemove(ids);
      await tableApi.query();
    },
  });
}

function handleDownloadExcel() {
  commonDownloadExcel(testExport, '测试', tableApi.formApi.form.values, {
    fieldMappingTime: formOptions.fieldMappingTime,
  });
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="参数列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            v-access:code="['demo:test:export']"
            @click="handleDownloadExcel"
          >
            {{ $t('pages.common.export') }}
          </a-button>
          <a-button
            :disabled="!vxeCheckboxChecked(tableApi)"
            danger
            type="primary"
            v-access:code="['demo:test:remove']"
            @click="handleMultiDelete"
          >
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['demo:test:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #url="{ row }">
        <!-- placeholder为图片未加载时显示的占位图 -->
        <!-- fallback为图片加载失败时显示 -->
        <!-- 需要设置key属性 否则切换翻页会有延迟 -->
        <Image
          :key="row.id"
          :src="row.selectType"
          height="50px"
          :fallback="fallbackImageBase64"
        >
          <template #placeholder>
            <div class="flex size-full items-center justify-center">
              <Spin />
            </div>
          </template>
        </Image>
      </template>
      <template #action="{ row }">
        <Space>
          <ghost-button
            v-access:code="['demo:test:edit']"
            @click.stop="handleEdit(row)"
          >
            {{ $t('pages.common.edit') }}
          </ghost-button>
          <Popconfirm
            :get-popup-container="getVxePopupContainer"
            placement="left"
            title="确认删除？"
            @confirm="handleDelete(row)"
          >
            <ghost-button
              danger
              v-access:code="['demo:test:remove']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </ghost-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <TestDrawer @reload="tableApi.query()" />
  </Page>
</template>
