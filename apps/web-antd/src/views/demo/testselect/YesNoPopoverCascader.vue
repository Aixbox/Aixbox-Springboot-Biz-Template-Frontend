<script>
import { defineComponent, h, ref, watch } from 'vue';

export default defineComponent({
  name: 'YesNoPopoverCascader',
  props: {
    fieldNames: {
      default: () => ({ label: 'label', value: 'value', children: 'children' }),
      type: Object,
    },
    modelValue: {
      default: () => [],
      type: Array,
    },
    options: {
      default: () => [],
      type: Array,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const selectedValue = ref(props.modelValue);
    const yesNoValue = ref('否');

    // 自定义渲染函数，为最后一级添加 Popover
    const displayRender = (labels, selectedOptions) => {
      if (!selectedOptions || selectedOptions.length === 0)
        return labels.join(' / ');

      return h('div', { class: 'cascader-labels' }, [
        ...labels
          .slice(0, -1)
          .map((label, index) =>
            h('span', { key: selectedOptions[index].value }, [
              label,
              h('span', { style: { margin: '0 4px' } }, ' / '),
            ]),
          ),
        h('span', { key: selectedOptions[selectedOptions.length - 1].value }, [
          labels[labels.length - 1],
          // 对最后一级添加 Popover
          h(
            'a-popover',
            {
              overlayClassName: 'yes-no-popover',
              placement: 'right',
              trigger: 'click',
            },
            {
              content: () =>
                h('div', { class: 'yes-no-content' }, [
                  h('div', { class: 'popover-title' }, '是非选择选项'),
                  h(
                    'div',
                    { class: 'popover-desc' },
                    '项用于对某个问题或条件进行简单明确的输入或否定。',
                  ),
                  h('div', { class: 'radio-group' }, [
                    h(
                      'a-radio-group',
                      {
                        modelValue: yesNoValue.value,
                        'onUpdate:modelValue': (val) => {
                          yesNoValue.value = val;
                        },
                      },
                      [
                        h('a-radio', { value: '是' }, '是'),
                        h('a-radio', { value: '否' }, '否'),
                      ],
                    ),
                  ]),
                ]),
              default: () =>
                h(
                  'a-button',
                  {
                    size: 'small',
                    style: {
                      marginLeft: '4px',
                      padding: '0 4px',
                    },
                    type: 'link',
                  },
                  [
                    h('span', { class: 'anticon' }, [
                      h('i', { class: 'fas fa-question-circle' }),
                    ]),
                  ],
                ),
            },
          ),
        ]),
      ]);
    };

    // 监听值变化
    const handleChange = (value, selectedOptions) => {
      emit('update:modelValue', value);
      emit('change', value, selectedOptions, yesNoValue.value);
    };

    // 监听 props.modelValue 的变化，同步到内部的 selectedValue
    watch(
      () => props.modelValue,
      (newVal) => {
        selectedValue.value = newVal;
      },
    );

    // 监听内部 selectedValue 的变化，同步到父组件
    watch(
      () => selectedValue.value,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          handleChange(newVal, []);
        }
      },
    );

    return {
      displayRender,
      selectedValue,
      yesNoValue,
    };
  },
});
</script>

<template>
  <div>
    <a-cascader
      v-model="selectedValue"
      :options="options"
      :field-names="fieldNames"
      :display-render="displayRender"
      placeholder="请选择"
    />
  </div>
</template>

<style scoped>
.cascader-labels {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

:deep(.yes-no-popover) {
  max-width: 300px;
}

:deep(.popover-title) {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}

:deep(.popover-desc) {
  margin-bottom: 16px;
  color: #666;
}

:deep(.radio-group) {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>
