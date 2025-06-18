<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DemoTest } from '#/api/demo/test/model';

import { createVNode, h, onBeforeUnmount, ref, render } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { getVxePopupContainer } from '@vben/utils';

import {
  Cascader,
  Image,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Tooltip,
} from 'ant-design-vue';

import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
import { testExport, testList, testRemove } from '#/api/demo/test';
import { commonDownloadExcel } from '#/utils/file/download';

import CascaderWithPopover from './cascader-with-popover.vue';
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

function onChange(value: any) {
  console.log(value);
}

const value = ref([]);
const options = [
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
            popoverContent: '1<br>2<br><br>3',
          },
          {
            value: 'key2',
            label: 'beef',
            popoverContent: '2',
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
            popoverContent: '3',
          },
          {
            value: 'key22',
            label: 'banana',
            popoverContent: '4',
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

let observer: MutationObserver | null = null;

function findLeafOptionByLabel(options, label) {
  for (const opt of options) {
    if (opt.label === label && !opt.children && opt.popoverContent) {
      return opt;
    }
    if (opt.children) {
      const found = findLeafOptionByLabel(opt.children, label);
      if (found) return found;
    }
  }
  return null;
}

let tooltipContainer = null;
let tooltipVNode = null;

function showTooltip(content, rect) {
  if (!tooltipContainer) {
    tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'custom-cascader-tooltip';
    document.body.append(tooltipContainer);
  }
  tooltipContainer.style.position = 'absolute';
  tooltipContainer.style.top = `${rect.top}px`;
  tooltipContainer.style.left = `${rect.right}px`;
  tooltipContainer.style.height = `${rect.height}px`;
  tooltipContainer.style.width = '250px';
  tooltipContainer.style.zIndex = '99999';
  tooltipContainer.style.pointerEvents = 'none';

  tooltipVNode = createVNode(
    Tooltip,
    {
      placement: 'right',
      arrow: false,
      open: true,
      overlayClassName: 'cascader-item-popover custom-tooltip-overlay',
    },
    {
      title: () => h('div', { innerHTML: content }),
      default: () => ' ',
    },
  );
  render(tooltipVNode, tooltipContainer);
}

function hideTooltip() {
  if (tooltipContainer) {
    render(null, tooltipContainer); // 卸载 vnode
    // 可选：document.body.removeChild(tooltipContainer);
    // tooltipContainer = null;
  }
}

function enhanceCascaderMenu() {
  setTimeout(() => {
    const dropdown = document.querySelector(
      '.ant-cascader-dropdown, [class*="ant-cascader-dropdown"]',
    );
    if (!dropdown) return;
    const rect = dropdown.getBoundingClientRect();

    const menuList = dropdown.querySelectorAll('.ant-cascader-menu');
    if (menuList.length === 0) return;
    const lastMenu = menuList[menuList.length - 1];
    if (!lastMenu) return;
    const items = lastMenu.querySelectorAll('.ant-cascader-menu-item');
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const label = item.textContent?.trim();
        if (!label) {
          hideTooltip();
          return;
        }
        const leaf = findLeafOptionByLabel(options, label);
        if (leaf && leaf.popoverContent) {
          showTooltip(leaf.popoverContent, rect);
        } else {
          hideTooltip();
        }
      });
      item.addEventListener('mouseleave', () => {
        hideTooltip();
      });
    });
  }, 100);
}

function startObserver() {
  const dropdown = document.querySelector('.ant-cascader-dropdown');
  if (!dropdown) return;
  observer = new MutationObserver(() => {
    enhanceCascaderMenu();
  });
  observer.observe(dropdown, { childList: true, subtree: true });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// 监听面板打开
function onDropdownVisibleChange(visible: boolean) {
  console.log('onDropdownVisibleChange', visible);
  setTimeout(() => {
    if (visible) {
      startObserver();
      enhanceCascaderMenu();
    } else {
      stopObserver();
    }
  }, 100);
}

onBeforeUnmount(() => {
  stopObserver();
});
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
    <Cascader
      v-model:value="value"
      :options="options"
      placeholder="请选择"
      @dropdown-visible-change="onDropdownVisibleChange"
    />
    <CascaderWithPopover />
  </Page>
</template>

<style>
.cascader-item-popover {
  max-width: 250px;
}

.custom-cascader-tooltip {
  z-index: 99999 !important;
  pointer-events: none;
}

.cascader-item-popover .ant-tooltip-arrow {
  display: none !important;
}
</style>
