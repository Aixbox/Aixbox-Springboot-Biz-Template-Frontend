<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

import { Dropdown, Menu, Popover, Radio } from 'ant-design-vue';

const menuData = [
  {
    key: 'selection',
    title: '选择类',
    children: [
      {
        key: 'boolean',
        title: '是/否',
        popoverContent: {
          title: '是非选择选项',
          content: '用于对某个问题或条件进行简单明确的确认或否定。',
          defaultValue: '否',
        },
      },
      {
        key: 'dropdown',
        title: '下拉菜单',
        popoverContent: {
          title: '下拉菜单选项',
          content: '用于从预定义的选项列表中选择一个或多个选项。',
          defaultValue: '选项1',
        },
      },
    ],
  },
  {
    key: 'input',
    title: '输入类',
    children: [
      {
        key: 'text',
        title: '文本输入',
        popoverContent: {
          title: '文本输入选项',
          content: '用于输入单行文本内容。',
          defaultValue: '',
        },
      },
      {
        key: 'textarea',
        title: '多行文本',
        popoverContent: {
          title: '多行文本选项',
          content: '用于输入多行文本内容。',
          defaultValue: '',
        },
      },
    ],
  },
];

const activeItemKey = ref<null | string>(null);
const currentPopoverData = ref<any>(null);
const showPopover = ref(false);
const radioValue = ref('否');
let hideTimer: null | ReturnType<typeof setTimeout> = null;

function onItemHover(item: any, e: MouseEvent) {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (item.popoverContent) {
    activeItemKey.value = item.key;
    currentPopoverData.value = item.popoverContent;
    radioValue.value = item.popoverContent.defaultValue;
    showPopover.value = true;
  }
}

function onItemLeave() {
  hideTimer = setTimeout(() => {
    showPopover.value = false;
    activeItemKey.value = null;
  }, 200);
}

function handleMenuClick(item: any) {
  console.log('Selected item:', item);
}

function onRadioChange(e: any) {
  radioValue.value = e.target.value;
}

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer);
});
</script>

<template>
  <div class="cascader-with-popover">
    <Dropdown :trigger="['click']">
      <template #overlay>
        <Menu mode="vertical">
          <Menu.SubMenu
            v-for="menu in menuData"
            :key="menu.key"
            :title="menu.title"
          >
            <Menu.Item
              v-for="submenu in menu.children"
              :key="submenu.key"
              @mouseenter="(e) => onItemHover(submenu, e)"
              @mouseleave="onItemLeave"
              @click="handleMenuClick(submenu)"
            >
              <Popover
                v-if="submenu.key === activeItemKey && showPopover"
                trigger="manual"
                :open="true"
                placement="right"
              >
                <template #content>
                  <div class="popover-content">
                    <h4>{{ currentPopoverData.title }}</h4>
                    <p>{{ currentPopoverData.content }}</p>
                    <Radio.Group
                      v-model:value="radioValue"
                      @change="onRadioChange"
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </Radio.Group>
                  </div>
                </template>
                <span>{{ submenu.title }}</span>
              </Popover>
              <template v-else>{{ submenu.title }}</template>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </template>
      <a-button>数据项类型</a-button>
    </Dropdown>
  </div>
</template>

<style scoped>
.cascader-with-popover {
  position: relative;
  display: inline-block;
}

.popover-content {
  max-width: 250px;
}

.popover-content h4 {
  margin-top: 0;
  margin-bottom: 8px;
}

.popover-content p {
  margin-bottom: 12px;
}
</style>
