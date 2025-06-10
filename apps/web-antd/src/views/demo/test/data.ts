import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { getDictOptions } from '#/utils/dict';
import { renderDict, renderDictTags } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'id',
    label: 'id',
  },
  {
    component: 'Input',
    fieldName: 'inputType',
    label: '名字',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_USER_SEX, true),
    },
    fieldName: 'sex',
    label: '性别',
  },

  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
  },
  {
    component: 'Input',
    fieldName: 'integerType',
    label: 'int类型',
  },
  {
    component: 'Input',
    fieldName: 'textareaType',
    label: '文本域类型',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_YES_NO, false, true),
    },
    fieldName: 'radioIsOrNot',
    label: '是否',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: 'id',
    field: 'id',
  },
  {
    title: '名字',
    field: 'inputType',
  },
  {
    title: '性别',
    field: 'sex',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.sex, DictEnum.SYS_USER_SEX, true);
      },
    },
  },

  {
    title: '创建时间',
    field: 'createTime',
  },
  {
    title: 'int类型',
    field: 'integerType',
  },
  {
    title: '文本域类型',
    field: 'textareaType',
  },
  // todo 图片类型
  {
    title: '是否',
    field: 'radioIsOrNot',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.radioIsOrNot, DictEnum.SYS_YES_NO, false, true);
      },
    },
  },

  {
    title: '复选框类型',
    field: 'checkboxType',
    width: 120,
    slots: {
      default: ({ row }) => {
        if (typeof row.checkboxType === 'string') {
          const values = row.checkboxType
            .split(',')
            .map((item: any) => item.trim());
          return renderDictTags(
            values,
            getDictOptions(DictEnum.SYS_DEVICE_TYPE),
            false,
          );
        }
        return row.checkboxType || '';
      },
    },
  },

  {
    title: '操作',
    field: 'action',
    fixed: 'right',
    width: 150,
    slots: { default: 'action' },
  },
];

export const modalSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'id',
    label: 'id',
  },
  {
    component: 'Textarea',
    formItemClass: 'items-start',
    fieldName: 'inputType',
    label: '名字',
    componentProps: {
      autoSize: true,
    },
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_USER_SEX),
    },
    fieldName: 'sex',
    label: '性别',
  },
  {
    component: 'Input',
    fieldName: 'integerType',
    label: 'int类型',
  },
  {
    component: 'Textarea',
    formItemClass: 'items-start',
    fieldName: 'textareaType',
    label: '文本域类型',
    componentProps: {
      autoSize: true,
    },
  },
  {
    component: 'Upload',
    fieldName: 'selectType',
    label: '选择类型',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_YES_NO),
      optionType: 'button',
    },
    fieldName: 'radioIsOrNot',
    label: '是否',
  },
  {
    component: 'CheckboxGroup',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_DEVICE_TYPE),
    },
    fieldName: 'checkboxType',
    label: '复选框类型',
  },
];

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'id',
    label: 'id',
  },
  {
    component: 'Textarea',
    formItemClass: 'items-start',
    fieldName: 'inputType',
    label: '名字',
    componentProps: {
      autoSize: true,
    },
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_USER_SEX),
    },
    fieldName: 'sex',
    label: '性别',
  },
  {
    component: 'Input',
    fieldName: 'integerType',
    label: 'int类型',
  },
  {
    component: 'Textarea',
    formItemClass: 'items-start',
    fieldName: 'textareaType',
    label: '文本域类型',
    componentProps: {
      autoSize: true,
    },
  },
  {
    component: 'Upload',
    fieldName: 'selectType',
    label: '选择类型',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_YES_NO),
      optionType: 'button',
    },
    fieldName: 'radioIsOrNot',
    label: '是否',
  },
  {
    component: 'CheckboxGroup',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_DEVICE_TYPE),
    },
    fieldName: 'checkboxType',
    label: '复选框类型',
  },
];
